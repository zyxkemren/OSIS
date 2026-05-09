"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { EditContainer, EditTitle, EditForm, EditSlider } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData, supabase } from "@/lib/supabase";
import { FaPlus, FaTrash, FaUserPlus, FaCamera } from "react-icons/fa6";
import imageCompression from "browser-image-compression";

export default function CabinetPage() {
  const [cabinet, setCabinet] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quality, setQuality] = useState(0.1);

  // State untuk melacak target upload mana yang sedang aktif
  const [uploadTarget, setUploadTarget] = useState<{ kemenId: string; angId?: string } | null>(null);

  const fetchData = async () => {
    try {
      const res = await getData("cabinet");
      setCabinet(res.items || []);
      setVisible(false);
    } catch (error) {
      console.error("Failed to fetch cabinet:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await addData("cabinet", { items: cabinet });
      setVisible(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // --- Image Optimization Logic to Supabase ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadTarget) return;

    setIsUploading(true);
    try {
      // 1. Kompresi WebP
      const options = {
        maxSizeMB: quality, // 100KB
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const compressedFile = await imageCompression(file, options);

      // 2. Tentukan nama file unik dan folder tujuan (cabinet)
      const fileName = `cabinet_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;

      // 3. Upload file yang sudah dikompres ke Supabase
      const { error } = await supabase.storage.from("uploads").upload(`cabinet/${fileName}`, compressedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

      if (error) {
        throw error;
      }

      // 4. Ambil Public URL dari Supabase
      const { data: publicUrlData } = supabase.storage.from("uploads").getPublicUrl(`cabinet/${fileName}`);

      const imageUrl = publicUrlData.publicUrl;

      // 5. Update State Cabinet (Logic asli kamu, ganti base64 dengan imageUrl)
      const { kemenId, angId } = uploadTarget;

      const updatedCabinet = cabinet.map((k) => {
        if (k.id === kemenId) {
          if (angId) {
            // Jika ada angId, berarti update foto anggota
            const newAnggota = k.anggota.map((a: any) => (a.id === angId ? { ...a, foto: imageUrl } : a));
            return { ...k, anggota: newAnggota };
          } else {
            // Jika tidak ada angId, berarti update thumbnail kementerian
            return { ...k, thumbnail: imageUrl };
          }
        }
        return k;
      });

      setCabinet(updatedCabinet);
      setVisible(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Gagal mengupload gambar. Coba lagi ya!");
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
      if (event.target) event.target.value = ""; // reset input
    }
  };

  const triggerUpload = (kemenId: string, angId?: string) => {
    setUploadTarget({ kemenId, angId });
    fileInputRef.current?.click();
  };

  // --- Logic Kementerian ---
  const addKementerian = () => {
    setCabinet([...cabinet, { id: `kemen-${Date.now()}`, title: "", thumbnail: "", desc: "", anggota: [] }]);
    setVisible(true);
  };

  const updateKemen = (id: string, field: string, value: string) => {
    setCabinet(cabinet.map((k) => (k.id === id ? { ...k, [field]: value } : k)));
    setVisible(true);
  };

  // --- Logic Anggota ---
  const addAnggota = (kemenId: string) => {
    setCabinet(
      cabinet.map((k) =>
        k.id === kemenId
          ? {
              ...k,
              anggota: [...k.anggota, { id: `member-${Date.now()}`, nama: "", jabatan: "", foto: "" }],
            }
          : k,
      ),
    );
    setVisible(true);
  };

  const updateAnggota = (kemenId: string, angId: string, field: string, value: string) => {
    setCabinet(
      cabinet.map((k) => {
        if (k.id === kemenId) {
          return { ...k, anggota: k.anggota.map((a: any) => (a.id === angId ? { ...a, [field]: value } : a)) };
        }
        return k;
      }),
    );
    setVisible(true);
  };

  return (
    <div className="main-container">
      <span className="background"></span>
      <Sidebar active={2} />

      <div className="home">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>Cabinet Manager</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "250px" }}>
            <label className="form-label uppercase" style={{ marginBottom: 0, whiteSpace: "nowrap" }}>
              QUALITY: <span style={{ color: "#5865f2" }}>{quality} MB</span>
            </label>
            <EditSlider min={0.02} max={1.0} step={0.02} defaultValue={quality} unit="MB" onChange={(val) => setQuality(val)} />
          </div>
          <button
            onClick={addKementerian}
            className="form-input"
            style={{ width: "auto", padding: "0 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FaPlus size={12} /> Tambah Kementerian
          </button>
        </div>

        {/* Hidden File Input */}
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />

        {cabinet.map((kemen) => (
          <EditContainer key={kemen.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <EditTitle>{kemen.title || "new item"}</EditTitle>
              <button
                onClick={() => setCabinet(cabinet.filter((k) => k.id !== kemen.id))}
                style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", marginRight: "2rem" }}
              >
                <FaTrash size={16} />
              </button>
            </div>

            <EditForm>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Thumbnail Kementerian */}
                <div className="flex flex-col gap-2 w-full lg:w-[400px] shrink-0">
                  <label className="form-label uppercase tracking-wider">Foto Kementerian</label>
                  <div
                    onClick={() => triggerUpload(kemen.id)}
                    className={`relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 aspect-video flex items-center justify-center ${
                      kemen.thumbnail ? "border-2 border-blue-500" : "border-2 border-dashed border-gray-600 hover:border-gray-400 bg-white/5"
                    }`}
                  >
                    {kemen.thumbnail ? (
                      <>
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${kemen.thumbnail})` }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-2">
                            <FaCamera size={24} className="text-white" />
                            <span className="text-xs text-white font-bold tracking-widest">GANTI FOTO</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <FaCamera size={32} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-xs text-gray-500 font-medium group-hover:text-blue-400 tracking-wider">UPLOAD FOTO</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Inputs */}
                <div className="flex flex-col gap-5 flex-1 w-full">
                  <div className="flex flex-col gap-2">
                    <label className="form-label uppercase">Nama Kementerian</label>
                    <input
                      type="text"
                      className="form-input w-full "
                      placeholder="Contoh: Kementerian Ristek..."
                      value={kemen.title}
                      onChange={(e) => updateKemen(kemen.id, "title", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2 h-full">
                    <label className="form-label uppercase">Deskripsi</label>
                    <textarea
                      className="form-input w-full h-full min-h-[120px] resize-y !p-[15px]"
                      placeholder="Berikan deskripsi singkat kementerian..."
                      value={kemen.desc}
                      onChange={(e) => updateKemen(kemen.id, "desc", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* DAFTAR ANGGOTA */}
              <div style={{ marginTop: "25px", borderTop: "1px solid #333", paddingTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <label className="form-label uppercase">DAFTAR ANGGOTA</label>
                  <button
                    onClick={() => addAnggota(kemen.id)}
                    style={{
                      background: "#222",
                      border: "1px solid #444",
                      color: "#ccc",
                      padding: "5px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaUserPlus size={12} /> Tambah Anggota
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {kemen.anggota.map((ang: any) => (
                    <div
                      key={ang.id}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "flex-start", // Berubah ke start agar input tinggi tidak masalah
                        background: "rgba(255, 255, 255, 0.03)",
                        padding: "1.25rem",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "all 0.2s ease",
                      }}
                      className="group hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      {/* Foto Anggota */}
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "20%",
                          border: ang.foto ? "none" : "1px dashed #555",
                          flexShrink: 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundImage: ang.foto ? `url(${ang.foto})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        onClick={() => triggerUpload(kemen.id, ang.id)}
                      >
                        {!ang.foto && <FaCamera size={14} style={{ color: "#555" }} />}
                      </div>

                      {/* Container Input - Menggunakan Grid agar lebih rapi */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                        <div className="flex flex-col gap-1">
                          <label className="!text-[0.75rem] uppercase tracking-wider text-gray-500 font-semibold">Nama Lengkap</label>
                          <input
                            className="form-input-clean"
                            placeholder="Daffa Adli Putra Umardani"
                            value={ang.nama}
                            onChange={(e) => updateAnggota(kemen.id, ang.id, "nama", e.target.value)}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="!text-[0.75rem] uppercase tracking-wider text-gray-500 font-semibold">Jabatan</label>
                          <input
                            className="form-input-clean"
                            placeholder="Sekretaris 1"
                            value={ang.jabatan}
                            onChange={(e) => updateAnggota(kemen.id, ang.id, "jabatan", e.target.value)}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="!text-[0.75rem] uppercase tracking-wider text-gray-500 font-semibold">Angkatan</label>
                          <input
                            type="number"
                            className="form-input-clean"
                            placeholder="26"
                            value={ang.angkatan}
                            onChange={(e) => updateAnggota(kemen.id, ang.id, "angkatan", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Tombol Hapus */}
                      <button
                        onClick={() =>
                          setCabinet(cabinet.map((k) => (k.id === kemen.id ? { ...k, anggota: k.anggota.filter((a) => a.id !== ang.id) } : k)))
                        }
                        className="p-2 mt-5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Hapus Anggota"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </EditForm>
          </EditContainer>
        ))}
        <DescriptionText text="© Kementrian Informasi dan Teknologi" />
      </div>
      <ActionBar visible={visible} onSave={handleSave} onReset={fetchData} />
      {isUploading && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#000",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            zIndex: 9999,
            border: "1px solid #333",
          }}
        >
          Optimizing Image...
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { EditContainer, EditTitle, EditForm } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData } from "@/lib/firebase/firebase";
import { FaPlus, FaTrash, FaUserPlus, FaCamera } from "react-icons/fa6";
import imageCompression from "browser-image-compression";

export default function CabinetPage() {
  const [cabinet, setCabinet] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // --- Image Optimization Logic ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadTarget) return;

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 0.1, // 100KB
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const compressedFile = await imageCompression(file, options);
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

      const { kemenId, angId } = uploadTarget;

      const updatedCabinet = cabinet.map((k) => {
        if (k.id === kemenId) {
          if (angId) {
            // Jika ada angId, berarti update foto anggota
            const newAnggota = k.anggota.map((a: any) => (a.id === angId ? { ...a, foto: base64 } : a));
            return { ...k, anggota: newAnggota };
          } else {
            // Jika tidak ada angId, berarti update thumbnail kementerian
            return { ...k, thumbnail: base64 };
          }
        }
        return k;
      });

      setCabinet(updatedCabinet);
      setVisible(true);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
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
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "20px" }}>
                {/* Thumbnail Kementerian */}
                <div>
                  <label className="form-label">FOTO PERKEMENTERIAN</label>
                  <div
                    className="upload-box"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "12px",
                      border: kemen.thumbnail ? "none" : "2px dashed #444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      backgroundImage: kemen.thumbnail ? `url(${kemen.thumbnail})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "rgba(255,255,255,0.02)",
                    }}
                    onClick={() => triggerUpload(kemen.id)}
                  >
                    {!kemen.thumbnail && <FaCamera size={24} style={{ color: "#444" }} />}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label className="form-label">NAMA</label>
                    <input className="form-input" value={kemen.title} onChange={(e) => updateKemen(kemen.id, "title", e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">DESKRIPSI</label>
                    <textarea
                      className="form-input"
                      style={{ minHeight: "65px" }}
                      value={kemen.desc}
                      onChange={(e) => updateKemen(kemen.id, "desc", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* DAFTAR ANGGOTA */}
              <div style={{ marginTop: "25px", borderTop: "1px solid #333", paddingTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <label className="form-label">DAFTAR ANGGOTA</label>
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
                        gap: "15px",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.02)",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      {/* Foto Anggota */}
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
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

                      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <input
                          className="form-input"
                          style={{ fontSize: "13px" }}
                          placeholder="nama (huruf kecil semua)"
                          value={ang.nama}
                          onChange={(e) => updateAnggota(kemen.id, ang.id, "nama", e.target.value)}
                        />
                        <input
                          className="form-input"
                          style={{ fontSize: "13px" }}
                          placeholder="jabatan (huruf kecil semua)"
                          value={ang.jabatan}
                          onChange={(e) => updateAnggota(kemen.id, ang.id, "jabatan", e.target.value)}
                        />
                      </div>

                      <button
                        onClick={() =>
                          setCabinet(cabinet.map((k) => (k.id === kemen.id ? { ...k, anggota: k.anggota.filter((a: any) => a.id !== ang.id) } : k)))
                        }
                        style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}
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

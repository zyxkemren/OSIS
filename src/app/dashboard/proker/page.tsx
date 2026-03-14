"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { EditContainer, EditTitle, EditForm } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData, supabase } from "@/lib/supabase";
import { FaPlus, FaTrash, FaCamera, FaYoutube } from "react-icons/fa6";
import imageCompression from "browser-image-compression";

export default function ProkerPage() {
  const [prokers, setProkers] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<number | string | null>(null);

  const fetchData = async () => {
    try {
      const res = await getData("prokers");
      // Urutkan berdasarkan tanggal terbaru (descending)
      const sorted = (res?.items || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setProkers(sorted);
      setVisible(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await addData("prokers", { items: prokers });
      setVisible(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || uploadTargetId === null) return;

    setIsUploading(true);
    try {
      // 1. Kompres gambar (Logic lama kamu yang dipertahankan)
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true, fileType: "image/webp" };
      const compressedFile = await imageCompression(file, options);

      // 2. Bikin nama file unik biar tidak saling tindih
      const fileName = `proker_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;

      // 3. Upload file yang sudah dikompres ke Supabase Storage
      // Kita masukkan ke dalam folder 'prokers' di dalam bucket 'uploads'
      const { data, error } = await supabase.storage.from("uploads").upload(`prokers/${fileName}`, compressedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

      if (error) {
        throw error;
      }

      // 4. Ambil Public URL dari gambar yang baru diupload
      const { data: publicUrlData } = supabase.storage.from("uploads").getPublicUrl(`prokers/${fileName}`);

      const imageUrl = publicUrlData.publicUrl;

      // 5. Simpan URL tersebut ke dalam state prokers (menggantikan Base64)
      setProkers(prokers.map((p) => (p.id === uploadTargetId ? { ...p, thumbnail: imageUrl } : p)));
      setVisible(true);
    } catch (e) {
      console.error("Upload error:", e);
      alert("Gagal mengupload gambar. Pastikan bucket 'uploads' sudah public.");
    } finally {
      setIsUploading(false);
      setUploadTargetId(null);
      if (event.target) event.target.value = "";
    }
  };
  
  const addProker = () => {
    // LOGIKA AUTO-ID: Cari angka ID tertinggi lalu tambah 1
    // Jika data kosong, mulai dari 0
    const maxId = prokers.length > 0 ? Math.max(...prokers.map((p) => Number(p.id))) : -1;

    const nextId = maxId + 1;

    const newProker = {
      id: nextId, // ID berupa angka sederhana: 0, 1, 2...
      title: "",
      date: new Date().toISOString(),
      thumbnail: "",
      youtube_link: "",
      ketua_pelaksana: "",
      content: "",
    };

    setProkers([newProker, ...prokers]);
    setVisible(true);
  };

  const updateProker = (id: number | string, field: string, value: string) => {
    setProkers(prokers.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    setVisible(true);
  };

  return (
    <div className="main-container">
      <span className="background"></span>
      <Sidebar active={3} />

      <div className="home">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "15px" }}>
          <h1 style={{ margin: 0 }}>Program Kerja</h1>
          <button
            onClick={addProker}
            className="form-input"
            style={{ width: "auto", padding: "0 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FaPlus size={12} /> Proker Baru
          </button>
        </div>

        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />

        {prokers.map((proker) => (
          <EditContainer key={proker.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <EditTitle>{proker.title || "Judul Proker"}</EditTitle>
                <EditTitle>PROKER ID: {proker.id}</EditTitle>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Hapus proker ID ${proker.id}?`)) {
                    setProkers(prokers.filter((p) => p.id !== proker.id));
                    setVisible(true);
                  }
                }}
                style={{
                  background: "rgba(255,77,77,0.1)",
                  border: "none",
                  color: "#ff4d4d",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  margin: "2rem",
                }}
              >
                <FaTrash size={16} />
              </button>
            </div>

            <EditForm>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {/* Thumbnail */}
                <div style={{ width: "100%" }}>
                  <label className="form-label">THUMBNAIL (800x450)</label>
                  <div
                    className="upload-box"
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: "12px",
                      border: proker.thumbnail ? "none" : "2px dashed #333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      backgroundImage: proker.thumbnail ? `url(${proker.thumbnail})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "rgba(255,255,255,0.01)",
                      overflow: "hidden",
                    }}
                    onClick={() => {
                      setUploadTargetId(proker.id);
                      fileInputRef.current?.click();
                    }}
                  >
                    {!proker.thumbnail && <FaCamera size={24} style={{ color: "#333" }} />}
                  </div>
                </div>

                {/* Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label className="form-label">JUDUL PROGRAM KERJA</label>
                    <input
                      className="form-input"
                      value={proker.title}
                      onChange={(e) => updateProker(proker.id, "title", e.target.value)}
                      placeholder="Contoh: LDKS 2026"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
                    <div>
                      <label className="form-label">TANGGAL</label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={proker.date?.slice(0, 16)}
                        onChange={(e) => updateProker(proker.id, "date", new Date(e.target.value).toISOString())}
                      />
                    </div>
                    <div>
                      <label className="form-label">KETUA PELAKSANA</label>
                      <input
                        className="form-input"
                        value={proker.ketua_pelaksana}
                        onChange={(e) => updateProker(proker.id, "ketua_pelaksana", e.target.value)}
                        placeholder="Nama Ketua"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Link Youtube */}
              <div style={{ marginTop: "20px" }}>
                <label className="form-label">YOUTUBE VIDEO ID / LINK</label>
                <div style={{ position: "relative" }}>
                  <FaYoutube
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "14px",
                      color: proker.youtube_link ? "#ff0000" : "#333",
                    }}
                    size={14}
                  />
                  <input
                    className="form-input"
                    style={{ paddingLeft: "35px", width: "100%" }}
                    value={proker.youtube_link}
                    onChange={(e) => updateProker(proker.id, "youtube_link", e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                {proker.youtube_link && proker.youtube_link.length === 11 && (
                  <span style={{ fontSize: "10px", color: "#4ade80", marginTop: "5px", display: "block" }}>
                    ✅ Video ID Terdeteksi: {proker.youtube_link}
                  </span>
                )}
              </div>

              <div style={{ marginTop: "20px" }}>
                <label className="form-label">KONTEN (MARKDOWN)</label>
                <textarea
                  className="form-input custom-scroll"
                  style={{
                    minHeight: "250px",
                    width: "100%",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    paddingTop: "15px",
                    resize: "vertical",
                  }}
                  value={proker.content}
                  onChange={(e) => updateProker(proker.id, "content", e.target.value)}
                  placeholder="### Contoh Markdown..."
                />
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
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "50px",
            zIndex: 9999,
            border: "1px solid #333",
            fontSize: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          Optimizing WebP...
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { EditContainer, EditTitle, EditForm, EditSlider } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData, supabase } from "@/lib/supabase";
import { FaPlus, FaTrash, FaCamera, FaYoutube } from "react-icons/fa6";
import imageCompression from "browser-image-compression";

export default function ProkerPage() {
  const [prokers, setProkers] = useState<any[]>([]);

  // STATE BARU: Menyimpan semua anggota kabinet dari database
  const [cabinetMembers, setCabinetMembers] = useState<any[]>([]);

  const [visible, setVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<number | string | null>(null);
  const [quality, setQuality] = useState(0.1);

  const fetchData = async () => {
    try {
      // FETCHING PARALEL: Ambil data proker DAN data kabinet sekaligus
      const [prokersRes, cabinetRes] = await Promise.all([getData("prokers"), getData("cabinet")]);

      // 1. Set Data Proker
      const sorted = (prokersRes?.items || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setProkers(sorted);

      // 2. Set Data Anggota Kabinet (Diekstrak dari dalam kementerian)
      let allMembers: any[] = [];
      if (cabinetRes?.items) {
        cabinetRes.items.forEach((kemen: any) => {
          if (kemen.anggota) {
            kemen.anggota.forEach((ang: any) => {
              // Kita simpan nama kementeriannya juga untuk fitur auto-fill
              allMembers.push({ ...ang, kementerian_title: kemen.title });
            });
          }
        });
      }
      setCabinetMembers(allMembers);

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
      const options = { maxSizeMB: quality, maxWidthOrHeight: 1280, useWebWorker: true, fileType: "image/webp" };
      const compressedFile = await imageCompression(file, options);
      const fileName = `proker_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;

      const { error } = await supabase.storage.from("uploads").upload(`prokers/${fileName}`, compressedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from("uploads").getPublicUrl(`prokers/${fileName}`);
      const imageUrl = publicUrlData.publicUrl;

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
    const maxId = prokers.length > 0 ? Math.max(...prokers.map((p) => Number(p.id))) : -1;
    const nextId = maxId + 1;

    const newProker = {
      id: nextId,
      title: "",
      date: new Date().toISOString(),
      thumbnail: "",
      youtube_link: "",
      ketua_pelaksana: "",
      divisi: "",
      content: "",
    };

    setProkers([newProker, ...prokers]);
    setVisible(true);
  };

  // UPDATE FUNGSI: Dibuat lebih pintar agar bisa menerima banyak update sekaligus (object)
  const updateProker = (id: number | string, updates: Record<string, any>) => {
    setProkers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    setVisible(true);
  };

  // Mengelompokkan proker berdasarkan "divisi" agar editnya per divisi
  const groupedProkers = prokers.reduce(
    (acc, proker) => {
      const div = proker.divisi?.trim() ? proker.divisi : "BELUM ADA DIVISI";
      if (!acc[div]) acc[div] = [];
      acc[div].push(proker);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <div className="main-container">
      <span className="background"></span>
      <Sidebar active={3} />

      <div className="home">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", gap: "15px" }}>
          <h1 style={{ margin: 0 }}>Program Kerja</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "250px" }}>
            <label className="form-label" style={{ marginBottom: 0, whiteSpace: "nowrap" }}>
              QUALITY: <span style={{ color: "#5865f2" }}>{quality} MB</span>
            </label>
            <EditSlider min={0.02} max={1.0} step={0.02} defaultValue={quality} unit="MB" onChange={(val) => setQuality(val)} />
          </div>
          <button
            onClick={addProker}
            className="form-input"
            style={{
              width: "auto",
              padding: "0 20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#5865f2",
              color: "white",
              border: "none",
            }}
          >
            <FaPlus size={12} /> Proker Baru
          </button>
        </div>

        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />

        {Object.entries(groupedProkers).map(([divisiName, items]) => (
          <div key={divisiName} style={{ marginBottom: "50px" }}>
            {/* Header Divisi */}
            <div
              style={{
                background: "rgba(88, 101, 242, 0.1)",
                borderLeft: "4px solid #5865f2",
                padding: "10px 20px",
                marginBottom: "20px",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <h2 style={{ margin: 0, color: "#5865f2", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "1px" }}>{divisiName}</h2>
            </div>

            {/* List Proker di dalam Divisi */}
            {(items as any).map((proker) => (
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
                      margin: "1rem",
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
                          onChange={(e) => updateProker(proker.id, { title: e.target.value })}
                          placeholder="Contoh: LDKS 2026"
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                          <label className="form-label">DIVISI</label>
                          <input
                            className="form-input"
                            value={proker.divisi || ""}
                            onChange={(e) => updateProker(proker.id, { divisi: e.target.value })}
                            placeholder="Contoh: IT"
                          />
                        </div>

                        {/* --- KETUA PELAKSANA DENGAN DATALIST & AUTOFILL DIVISI --- */}
                        <div>
                          <label className="form-label">KETUA PELAKSANA</label>
                          <input
                            list={`list-cabinet-${proker.id}`}
                            className="form-input"
                            value={proker.ketua_pelaksana || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              // Cari apakah nama yang diketik/dipilih ada di database kabinet
                              const foundMember = cabinetMembers.find((m) => m.nama === val);

                              if (foundMember && !proker.divisi) {
                                // AUTO-FILL: Jika nama ketemu dan divisi masih kosong, isi otomatis!
                                updateProker(proker.id, {
                                  ketua_pelaksana: val,
                                  divisi: foundMember.kementerian_title,
                                });
                              } else {
                                // Update biasa
                                updateProker(proker.id, { ketua_pelaksana: val });
                              }
                            }}
                            placeholder="Pilih atau ketik nama..."
                          />
                          <datalist id={`list-cabinet-${proker.id}`}>
                            {cabinetMembers.map((member) => (
                              <option key={member.id} value={member.nama}>
                                {member.nama}
                              </option>
                            ))}
                          </datalist>
                        </div>
                        {/* -------------------------------------------------------- */}
                      </div>

                      <div>
                        <label className="form-label">TANGGAL</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={proker.date?.slice(0, 16)}
                          onChange={(e) => updateProker(proker.id, { date: new Date(e.target.value).toISOString() })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Link Youtube */}
                  <div style={{ marginTop: "20px" }}>
                    <label className="form-label">YOUTUBE VIDEO ID / LINK</label>
                    <div style={{ position: "relative" }}>
                      <FaYoutube
                        style={{ position: "absolute", left: "12px", top: "14px", color: proker.youtube_link ? "#ff0000" : "#333" }}
                        size={14}
                      />
                      <input
                        className="form-input"
                        style={{ paddingLeft: "35px", width: "100%" }}
                        value={proker.youtube_link}
                        onChange={(e) => updateProker(proker.id, { youtube_link: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
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
                      onChange={(e) => updateProker(proker.id, { content: e.target.value })}
                      placeholder="### Contoh Markdown..."
                    />
                  </div>
                </EditForm>
              </EditContainer>
            ))}
          </div>
        ))}

        {prokers.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>Belum ada proker. Klik "Proker Baru" untuk mulai menambahkan.</div>
        )}

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

"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { EditContainer, EditTitle, EditForm } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData } from "@/lib/firebase/firebase";
import { FaPlus, FaTrash, FaUserPlus } from "react-icons/fa6";

export default function CabinetPage() {
  const [cabinet, setCabinet] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [isSidebarClosed] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getData("cabinet");
      // Sesuai permintaan: langsung ambil array items dari dokumen
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
      // Simpan flat: collection 'cabinet' -> doc 'config' -> { items: [...] }
      await addData("cabinet", { items: cabinet });
      setVisible(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // --- Logic Kementerian ---
  const addKementerian = () => {
    const newKemen = {
      id: `kemen-${Date.now()}`,
      title: "",
      thumbnail: "",
      desc: "",
      anggota: [],
    };
    setCabinet([...cabinet, newKemen]);
    setVisible(true);
  };

  const removeKementerian = (id: string) => {
    setCabinet(cabinet.filter((k) => k.id !== id));
    setVisible(true);
  };

  const updateKemen = (id: string, field: string, value: string) => {
    setCabinet(cabinet.map((k) => (k.id === id ? { ...k, [field]: value } : k)));
    setVisible(true);
  };

  // --- Logic Anggota ---
  const addAnggota = (kemenId: string) => {
    setCabinet(
      cabinet.map((k) => {
        if (k.id === kemenId) {
          return {
            ...k,
            anggota: [
              ...k.anggota,
              {
                id: `member-${Date.now()}`,
                nama: "",
                jabatan: "",
                foto: "",
              },
            ],
          };
        }
        return k;
      }),
    );
    setVisible(true);
  };

  const updateAnggota = (kemenId: string, angId: string, field: string, value: string) => {
    setCabinet(
      cabinet.map((k) => {
        if (k.id === kemenId) {
          const newAnggota = k.anggota.map((a: any) => (a.id === angId ? { ...a, [field]: value } : a));
          return { ...k, anggota: newAnggota };
        }
        return k;
      }),
    );
    setVisible(true);
  };

  const removeAnggota = (kemenId: string, angId: string) => {
    setCabinet(
      cabinet.map((k) => {
        if (k.id === kemenId) {
          return { ...k, anggota: k.anggota.filter((a: any) => a.id !== angId) };
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

      <div className={`home ${isSidebarClosed ? "close" : ""}`}>
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

        {cabinet.map((kemen) => (
          <EditContainer key={kemen.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <EditTitle>{kemen.title || "Kementerian Baru"}</EditTitle>
              <button onClick={() => removeKementerian(kemen.id)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer" }}>
                <FaTrash size={16} />
              </button>
            </div>

            <EditForm>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label className="form-label">NAMA KEMENTERIAN</label>
                  <input className="form-input" value={kemen.title} onChange={(e) => updateKemen(kemen.id, "title", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">THUMBNAIL URL</label>
                  <input className="form-input" value={kemen.thumbnail} onChange={(e) => updateKemen(kemen.id, "thumbnail", e.target.value)} />
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <label className="form-label">DESKRIPSI</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: "60px", paddingTop: "10px" }}
                  value={kemen.desc}
                  onChange={(e) => updateKemen(kemen.id, "desc", e.target.value)}
                />
              </div>

              {/* ANGGOTA */}
              <div style={{ marginTop: "25px", borderTop: "1px solid #333", paddingTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    DAFTAR ANGGOTA
                  </label>
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
                        gap: "10px",
                        alignItems: "flex-end",
                        background: "rgba(255,255,255,0.02)",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                        <div>
                          <label style={{ fontSize: "10px", color: "#666", display: "block", marginBottom: "5px" }}>NAMA</label>
                          <input
                            className="form-input"
                            style={{ fontSize: "13px" }}
                            value={ang.nama}
                            onChange={(e) => updateAnggota(kemen.id, ang.id, "nama", e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: "#666", display: "block", marginBottom: "5px" }}>JABATAN</label>
                          <input
                            className="form-input"
                            style={{ fontSize: "13px" }}
                            value={ang.jabatan}
                            onChange={(e) => updateAnggota(kemen.id, ang.id, "jabatan", e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: "#666", display: "block", marginBottom: "5px" }}>URL FOTO</label>
                          <input
                            className="form-input"
                            style={{ fontSize: "13px" }}
                            value={ang.foto}
                            onChange={(e) => updateAnggota(kemen.id, ang.id, "foto", e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeAnggota(kemen.id, ang.id)}
                        style={{ background: "none", border: "none", color: "#666", cursor: "pointer", paddingBottom: "10px" }}
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
    </div>
  );
}

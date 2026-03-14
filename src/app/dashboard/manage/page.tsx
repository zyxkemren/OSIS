"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { EditContainer, EditTitle, EditForm } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData } from "@/lib/firebase/firebase";
import { FaPlus, FaTrash, FaYoutube } from "react-icons/fa6";

// Fungsi sakti untuk ambil ID Youtube
const getYouTubeID = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : url;
};

export default function ContentDashboard() {
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    video_id: "",
    video_caption: "",
    hero_items: [],
  });
  const [visible, setVisible] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getData("content");
      if (res) setFormData(res);
      setVisible(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await addData("content", formData);
      setVisible(false);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const updateField = (field: string, value: any) => {
    let finalValue = value;

    // OTOMATIS: Jika field video_id diinput link, potong jadi ID
    if (field === "video_id" && (value.includes("youtube.com") || value.includes("youtu.be"))) {
      finalValue = getYouTubeID(value);
    }

    setFormData((prev: any) => ({ ...prev, [field]: finalValue }));
    setVisible(true);
  };

  // --- Hero Slider Logic ---
  const addHeroItem = () => {
    const newItem = {
      id: Date.now(),
      prokerId: "",
    };
    updateField("hero_items", [...(formData.hero_items || []), newItem]);
  };

  const removeHeroItem = (id: number) => {
    updateField(
      "hero_items",
      formData.hero_items.filter((item: any) => item.id !== id),
    );
  };

  const updateHeroItem = (index: number, field: string, value: string) => {
    const updatedHero = [...formData.hero_items];
    updatedHero[index][field] = value;
    updateField("hero_items", updatedHero);
  };

  return (
    <div className="main-container">
      <span className="background"></span>
      <Sidebar active={2} />

      <div className="home">
        <h1>Content Management</h1>

        {/* Section 1: Intro Text & Video */}
        <EditContainer>
          <EditTitle>Intro & Video Section</EditTitle>
          <EditForm>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input className="form-input" placeholder="Page Title" value={formData.title} onChange={(e) => updateField("title", e.target.value)} />
              <textarea
                className="form-input"
                style={{ minHeight: "100px" }}
                placeholder="Page Description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ position: "relative" }}>
                  <FaYoutube style={{ position: "absolute", left: "12px", top: "14px", color: formData.video_id ? "#ff0000" : "#333" }} size={14} />
                  <input
                    className="form-input"
                    style={{ paddingLeft: "35px" }}
                    placeholder="YouTube Video ID / Link"
                    value={formData.video_id}
                    onChange={(e) => updateField("video_id", e.target.value)}
                  />
                </div>
                <input
                  className="form-input"
                  placeholder="Video Caption"
                  value={formData.video_caption}
                  onChange={(e) => updateField("video_caption", e.target.value)}
                />
              </div>
              {formData.video_id?.length === 11 && (
                <span style={{ fontSize: "10px", color: "#4ade80", marginTop: "-10px" }}>✅ YouTube ID Valid: {formData.video_id}</span>
              )}
            </div>
          </EditForm>
        </EditContainer>

        {/* Section 2: Hero Slider */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "30px" }}>
          <h2>Hero Slider Setting</h2>
          <button
            className="form-input"
            style={{ width: "auto", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            onClick={addHeroItem}
          >
            <FaPlus size={12} /> Tambah Slide
          </button>
        </div>

        {formData.hero_items?.map((item: any, index: number) => (
          <EditContainer key={item.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <EditTitle>Slide #{index + 1}</EditTitle>
              <button
                onClick={() => removeHeroItem(item.id)}
                style={{
                  color: "#ff4d4d",
                  background: "rgba(255,77,77,0.1)",
                  border: "none",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash size={14} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label className="form-label">HUBUNGKAN DENGAN PROKER ID</label>
              <input
                className="form-input"
                placeholder="Masukkan ID Proker (contoh: 0 atau 1)"
                value={item.prokerId}
                onChange={(e) => updateHeroItem(index, "prokerId", e.target.value)}
              />
              <p style={{ fontSize: "11px", color: "#666" }}>*Sistem akan otomatis mengambil Thumbnail dan Judul dari Proker dengan ID ini.</p>
            </div>
          </EditContainer>
        ))}

        <DescriptionText text="© Kementrian Informasi dan Teknologi" />
      </div>

      <ActionBar visible={visible} onSave={handleSave} onReset={fetchData} />
    </div>
  );
}

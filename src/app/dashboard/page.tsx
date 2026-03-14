"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { Form, EditContainer, EditTitle, EditForm } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData } from "@/lib/supabase";
import { FaCamera } from "react-icons/fa6";
import imageCompression from "browser-image-compression"; // Pastikan sudah install ini

const options = [
  { id: "website_title", label: "website title", placeholder: "Alba" },
  {
    id: "website_description",
    label: "website description",
    placeholder: "Adalah website...",
    type: "textarea",
  },
];

type FormData = {
  payment?: string;
  [key: string]: any;
};

export default function Home() {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [visible, setVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      const generalData = await getData("general");

      setFormData(generalData || {});
      console.log("Fetched data:", generalData);
      setVisible(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSave = async () => {
    try {
      await addData("general", formData);
      setVisible(false);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const onChange = (updatedData: any) => {
    setFormData(updatedData);
    setVisible(true);
  };

  // Handler Upload & Kompresi WebP
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Kompresi Gambar
      const optionsCompression = {
        maxSizeMB: 0.1, // Max 100KB
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: "image/webp", // Force convert ke WebP
      };

      const compressedFile = await imageCompression(file, optionsCompression);

      // 2. Bikin nama file unik
      const fileName = `icon_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;

      // 3. Upload file ke Supabase (masuk ke folder 'general')
      const { error } = await supabase.storage.from("uploads").upload(`general/${fileName}`, compressedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

      if (error) {
        throw error;
      }

      // 4. Ambil Public URL dari gambar
      const { data: publicUrlData } = supabase.storage.from("uploads").getPublicUrl(`general/${fileName}`);

      const imageUrl = publicUrlData.publicUrl;

      // 5. Update state dengan URL dari Supabase
      const updatedData = { ...formData, url: imageUrl };
      setFormData(updatedData);
      setVisible(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Gagal mengupload ikon. Coba lagi ya!");
    } finally {
      setIsUploading(false);
      // Reset input file biar bisa upload file yang sama 2x kalau butuh
      if (event.target) event.target.value = "";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="main-container">
      <span className="background"></span>
      <Sidebar active={0} />

      <div className={`home ${isSidebarClosed ? "close" : ""}`}>
        <h1>{formData?.server_name || "Dashboard"}</h1>

        <EditContainer>
          <EditTitle>General Settings</EditTitle>
          <EditForm>
            <label className="form-label" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>
              WEBSITE ICON
            </label>

            {/* Box Preview & Upload */}
            <div
              className="upload-box"
              style={{
                width: "100px",
                height: "100px",
                border: formData.url ? "none" : "2px dashed #444",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: formData.url ? `url(${formData.url})` : "none",
                marginBottom: "20px",
                position: "relative",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
              onClick={() => document.getElementById("upl")?.click()}
            >
              {!formData.url && !isUploading && <FaCamera size={30} style={{ color: "#666" }} />}
              {isUploading && <div style={{ fontSize: "10px", color: "#aaa" }}>Processing...</div>}
            </div>

            <input type="file" id="upl" hidden accept="image/*" onChange={handleFileUpload} disabled={isUploading} />

            <Form formData={formData} options={options} onChange={onChange} />
          </EditForm>
        </EditContainer>

        <DescriptionText text="© Kementrian Informasi dan Teknologi" />
      </div>

      <ActionBar visible={visible} onSave={handleSave} onReset={fetchData} />
    </div>
  );
}

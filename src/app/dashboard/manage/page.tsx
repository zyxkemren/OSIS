"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { StatsDisplay, StatsTotal, Leaderboard } from "@/components/ui/stats";
import { Form, EditContainer, EditTitle, EditForm } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData } from "@/lib/firebase/firebase";
import { FaCamera } from "react-icons/fa6";
import imageCompression from "browser-image-compression"; // Pastikan sudah install ini

const options = [
  { id: "page_title", label: "page title", placeholder: "Welcome to ..." },
  {
    id: "page_description",
    label: "page description",
    placeholder: "deskripsi osis, atau apalah bebas",
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
      const generalData = await getData("content");

      setFormData(generalData || {});
      console.log("Fetched data:", generalData);
      setVisible(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSave = async () => {
    try {
      await addData("content", formData);
      setVisible(false);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const onChange = (updatedData: any) => {
    setFormData(updatedData);
    setVisible(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="main-container">
      <span className="background"></span>
      <Sidebar active={1} />

      <div className={`home ${isSidebarClosed ? "close" : ""}`}>
        <h1>{formData?.server_name || "Dashboard"}</h1>

        <EditContainer>
          <EditTitle>buat di bagian home</EditTitle>
          <EditForm>
            <Form formData={formData} options={options} onChange={onChange} />
          </EditForm>
        </EditContainer>

        <DescriptionText text="© Kementrian Informasi dan Teknologi" />
      </div>

      <ActionBar visible={visible} onSave={handleSave} onReset={fetchData} />
    </div>
  );
}

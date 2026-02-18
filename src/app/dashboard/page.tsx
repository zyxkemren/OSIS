"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { DescriptionText } from "@/components/ui/text";
import { StatsDisplay, StatsTotal, Leaderboard } from "@/components/ui/stats";
import { Form, EditContainer, EditTitle, EditForm, InputInfo } from "@/components/ui/edit";
import { ActionBar } from "@/components/ui/actionbar";
import { getData, addData } from "@/lib/firebase/firebase";
import axios from "axios";

const options = [
  { id: "website_name", label: "website name", placeholder: "Alba" },
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
  const [stats, setStats] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalStats, setTotalStats] = useState([]);


  const fetchData = async () => {
    try {
      const generalData = await getData("general");
      const statsData = await getData("stats");
      const leaderboardData = await getData("leaderboard");
      const totalStatsData = await getData("totalStats");

      setFormData(generalData);
      setStats(statsData);
      setLeaderboard(leaderboardData);
      setTotalStats(totalStatsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await addData("general", formData);
      console.log(response);
      setVisible(false);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const onChange = (updatedData) => {
    setFormData(updatedData);
    setVisible(true);

    console.log("Form data changed:", updatedData);
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
        <StatsDisplay data={stats} />
        <EditContainer>
          <EditTitle>General Settings</EditTitle>
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

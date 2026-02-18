"use client";

import React, { useState, useEffect } from "react";
import { AddButton, ResetButton } from "./button";

export function ActionBar({ visible, onSave, onReset }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        left: "0",
        width: "100vw",
        opacity: visible ? 1 : 0,
        transition: "all 0.3s ease",
        transform: visible ? "translateY(-50px)" : "translateY(30px)",
        display: "flex",
        justifyContent: "center",
        zIndex: "10",
        pointerEvents: "none",
      }}
    >
      <div
        className="actionbar"
        style={{
          backgroundColor: "#1f2129",
          maxWidth: "94vw",
          width: "900px",
          outline: "3px solid #272934",
          boxShadow: "0 0 30px 5px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px",
          zIndex: "10",
          pointerEvents: "auto",
        }}
      >
        <span style={{ margin: "0 30px 0 10px" }}>You have unsaved changes</span>
        <div className="button-container" style={{ display: "flex", whiteSpace: "nowrap", gap: "10px" }}>
          <ResetButton text="Reset" onClick={onReset} />
          <AddButton text="Save changes" onClick={onSave} />
        </div>
      </div>
    </div>
  );
}

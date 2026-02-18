"use client";

import { useState, useEffect } from "react";
import "./edit.css";

export default function Anjay({ formData: initialFormData, onChange }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleInputChange = (id, value) => {
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  return (
    <form style={{ margin: "20%" }}>
      <input
        type="text"
        id="1"
        placeholder="Input something.."
        className="form-input"
        value={formData["1"] || ""}
        onChange={(e) => handleInputChange("1", e.target.value)}
      />
      <input
        type="text"
        id="2"
        placeholder="Input something.."
        className="form-input"
        value={formData["2"] || ""}
        onChange={(e) => handleInputChange("2", e.target.value)}
      />
      <input
        type="text"
        id="3"
        placeholder="Input something.."
        className="form-input"
        value={formData["3"] || ""}
        onChange={(e) => handleInputChange("3", e.target.value)}
      />
    </form>
  );
}

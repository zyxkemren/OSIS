"use client";

import "./navbar.css";
import { LuMenu } from "react-icons/lu";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar({ active, logo }: { active: number; logo: string }) {
  const [isOpen, setIsOpen] = useState(false);
  // Tambahkan state baru untuk nyimpen section mana yang lagi aktif di layar
  const [activeSection, setActiveSection] = useState(active);

  // --- LOGIC 1: Handle Resize Mobile Menu ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) setIsOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- LOGIC 2: Intersection Observer (Scroll Spy) ---
  useEffect(() => {
    // Setting observer: Akan trigger kalau 50% dari section udah kelihatan di layar
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "home") setActiveSection(1);
            if (entry.target.id === "cabinet") setActiveSection(2);
            if (entry.target.id === "proker") setActiveSection(3);
          }
        });
      },
      { threshold: 0.5 }, // 0.5 artinya 50% section terlihat
    );

    // Daftarin ID mana aja yang mau dipantau
    const sections = ["home", "cabinet", "proker"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect(); // Bersihin observer pas pindah halaman
  }, []);

  // --- LOGIC 3: Smooth Scroll ---
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="navbar">
        <nav>
          <button className="checkbtn" onClick={() => setIsOpen(!isOpen)}>
            <LuMenu size={40} style={{ color: "white" }} />
          </button>

          <h1 className="logo">{logo}</h1>

          <ul className="desktop-menu">
            <li>
              {/* Ganti pengecekan class pakai activeSection */}
              <Link href="/#home" onClick={(e) => handleSmoothScroll(e, "home")} className={activeSection === 1 ? "active" : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/#cabinet" onClick={(e) => handleSmoothScroll(e, "cabinet")} className={activeSection === 2 ? "active" : ""}>
                Cabinet
              </Link>
            </li>
            <li>
              <Link href="/#proker" onClick={(e) => handleSmoothScroll(e, "proker")} className={activeSection === 3 ? "active" : ""}>
                Program Kerja
              </Link>
            </li>
            <li>
              <a href="https://www.instagram.com/osis.alba/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link href="/#home" onClick={(e) => handleSmoothScroll(e, "home")} className={activeSection === 1 ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/#cabinet" onClick={(e) => handleSmoothScroll(e, "cabinet")} className={activeSection === 2 ? "active" : ""}>
              Cabinet
            </Link>
          </li>
          <li>
            <Link href="/#proker" onClick={(e) => handleSmoothScroll(e, "proker")} className={activeSection === 3 ? "active" : ""}>
              Program Kerja
            </Link>
          </li>
          <li>
            <a href="https://www.instagram.com/osis.alba/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

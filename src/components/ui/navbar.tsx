"use client";

import "./navbar.css";
import { LuMenu } from "react-icons/lu";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar({ active, logo }: { active: number; logo: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // LOGIC AUTO-CLOSE MENU MOBILE SAAT LAYAR JADI DESKTOP
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setIsOpen(false);
      }
    };

    // Jalankan sekali saat mount (opsional, tapi bagus buat init)
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* NAVBAR UTAMA */}
      <div className="navbar">
        <nav>
          {/* Tombol Hamburger */}
          <button className="checkbtn" onClick={() => setIsOpen(!isOpen)}>
            <LuMenu size={40} style={{ color: "white" }} />
          </button>

          {/* Logo */}
          <h1 className="logo">{logo}</h1>

          {/* MENU DESKTOP */}
          <ul className="desktop-menu">
            <li>
              <Link href="/" className={active === 1 ? "active" : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/perks" className={active === 2 ? "active" : ""}>
                Cabinet
              </Link>
            </li>
            <li>
              <Link href="/perks" className={active === 2 ? "active" : ""}>
                Event
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

      {/* MENU MOBILE */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link href="/" className={active === 1 ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/perks" className={active === 2 ? "active" : ""}>
              Cabinet
            </Link>
          </li>
          <li>
            <Link href="/perks" className={active === 2 ? "active" : ""}>
              Event
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

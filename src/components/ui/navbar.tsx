"use client";

import "./navbar.css";
import { LuMenu } from "react-icons/lu";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar({ active, logo }: { active: number; logo: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

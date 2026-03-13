"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSidebar } from "../sidebar-provider";
import { LuMenu } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { getData } from "@/lib/firebase/firebase";
import "./sidebar.css";

export default function Sidebar({ active }) {
  const { isSidebarClosed, setIsSidebarClosed } = useSidebar();
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isNavbar, setIsNavbar] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const router = useRouter();
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 700) {
        setIsSmallScreen(true);
        setIsSidebarClosed(true);
      }
      if (window.innerWidth <= 468) {
        setIsNavbar(true);
      } else {
        setIsSmallScreen(false);
        setIsNavbar(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarClosed]);

  const toggleSidebar = () => {
    if (!isSmallScreen) {
      setIsSidebarClosed((prev) => !prev);
    }
  };

  const toggleMode = () => {
    setIsLightMode((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      if (isLightMode) {
        body.classList.add("light");
      } else {
        body.classList.remove("light");
      }
    }
  }, [isLightMode]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.push("/dashboard/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarRef]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const generalData = await getData("general");

        setUserData(generalData || {});

        console.log("Fetched user data:", generalData); 
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <link href="https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css" rel="stylesheet" />
      {isNavbar ? (
        <nav className="navbar" ref={navbarRef}>
          <button className="hamburger" onClick={toggleMenu}>
            <i className="bx bx-menu" style={{ fontSize: "30px" }} />
          </button>
          <div className="logo">
            OSIS Alba
            <img src={userData?.url} alt="Profile" />
          </div>
          <ul className={`menu-links ${isMenuOpen ? "open" : ""}`}>
            <li className={`nav-link ${active === 0 ? "active" : ""}`}>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li className={`nav-link ${active === 1 ? "active" : ""}`}>
              <Link href="/dashboard/manage">Page Content</Link>
            </li>
            <li className={`nav-link ${active === 2 ? "active" : ""}`}>
              <Link href="/dashboard/cabinet">Cabinet</Link>
            </li>
            <li className={`nav-link ${active === 3 ? "active" : ""}`}>
              <Link href="/dashboard/proker">Proker</Link>
            </li>
          </ul>
        </nav>
      ) : (
        <nav className={`sidebar ${isSidebarClosed ? "close" : ""}`}>
          <header>
            <div className="image-text">
              <span className="image">
                <img src={userData?.url} alt="Profile" />
              </span>
              <div className="text logo-text">
                <span className="name">OSIS Alba</span>
                <span className="profession">Kementrian IT</span>
              </div>
            </div>
            <i className="bx bx-chevron-right toggle" onClick={toggleSidebar} />
          </header>
          <div className="menu-bar">
            <div className="menu">
              <ul className="menu-links">
                <li className={`nav-link ${active === 0 ? "active" : ""}`}>
                  <Link href="/dashboard">
                    <i className="bx bx-home-alt icon" />
                    <span className="text nav-text">Dashboard</span>
                  </Link>
                </li>
                <li className={`nav-link ${active === 1 ? "active" : ""}`}>
                  <Link href="/dashboard/manage">
                    <i className="bx bx-file icon" />
                    <span className="text nav-text">Page Content</span>
                  </Link>
                </li>
                <li className={`nav-link ${active === 2 ? "active" : ""}`}>
                  <Link href="/dashboard/cabinet">
                    <i className="bx bx-group icon" />
                    <span className="text nav-text">Cabinet</span>
                  </Link>
                </li>
                <li className={`nav-link ${active === 3 ? "active" : ""}`}>
                  <Link href="/dashboard/proker">
                    <i className="bx bx-task icon" />
                    <span className="text nav-text">Proker</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="bottom-content">
              <li>
                <Link href="/login" onClick={handleLogout}>
                  <i className="bx bx-log-out icon" />
                  <span className="text nav-text">Logout</span>
                </Link>
              </li>
              <li className="mode">
                <div className="sun-moon">
                  <i className="bx bx-moon icon sun" />
                  <i className="bx bx-sun icon moon" />
                </div>
                <span className="mode-text text">{isLightMode ? "Dark mode" : "Light mode"}</span>
                <div className="toggle-switch" onClick={toggleMode}>
                  <span className="switch" />
                </div>
              </li>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}

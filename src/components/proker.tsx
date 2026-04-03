"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BiX } from "react-icons/bi";
import { MdOutlineExplore } from "react-icons/md"; // MdCalendarMonth dihapus
import ReactMarkdown from "react-markdown";
import "./proker.css";

const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

interface ProkerProps {
  items: any[];
  externalSelectedId?: number | null;
  onCloseModal?: () => void;
}

export default function ProkerSection({ items, externalSelectedId, onCloseModal }: ProkerProps) {
  const [selectedProker, setSelectedProker] = useState<any>(null);
  const [isListOpen, setIsListOpen] = useState(false);

  // Sorting tetap berdasarkan tanggal dari data agar urutannya tidak berantakan
  const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // LOGIC PENTING: Monitor kiriman ID dari Hero
  useEffect(() => {
    if (externalSelectedId) {
      const found = items.find((item) => item.id === externalSelectedId);
      if (found) {
        setSelectedProker(found);
        const element = document.querySelector(".proker");
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [externalSelectedId, items]);

  const closeDetail = () => {
    setSelectedProker(null);
    if (onCloseModal) onCloseModal();
  };

  return (
    <div className="proker">
      <h2 className="event-name !text-[#304356] mb-10 section-title">Program Kerja</h2>

      <div className="proker-container">
        {/* LATEST */}
        <div className="proker-box proker-div1" onClick={() => setSelectedProker(sorted[0])}>
          {sorted[0] && (
            <>
              <Image src={sorted[0].thumbnail} fill alt="latest" className="proker-img" />
              <div className="proker-overlay-latest">
                <div className="ministry">{sorted[0].title}</div>
              </div>
            </>
          )}
        </div>

        {/* NORMAL BOXES */}
        {[1, 2, 3].map(
          (i) =>
            sorted[i] && (
              <div key={i} className="proker-box" onClick={() => setSelectedProker(sorted[i])}>
                <Image src={sorted[i].thumbnail} fill alt="event" className="proker-img" />
              </div>
            ),
        )}

        {/* EXPLORE MORE */}
        <div className="explore-box" onClick={() => setIsListOpen(true)}>
          {sorted[4] && <Image src={sorted[4].thumbnail} fill alt="explore" className="proker-img blur-bg" />}
          <div className="explore-content">
            <MdOutlineExplore size={80} className="explore-icon" />
            <span className="explore-text">Explore More</span>
          </div>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {selectedProker && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={closeDetail}></div>
          <div className="modal-card custom-scroll">
            <button className="modal-close" onClick={closeDetail}>
              <BiX size={30} />
            </button>
            <div className="modal-banner">
              <Image src={selectedProker.thumbnail} fill alt="banner" className="proker-img" />
              <div className="modal-gradient-overlay"></div>
            </div>
            <div className="modal-body">
              <h2 className="modal-title" style={{ marginTop: "10px" }}>
                {selectedProker.title}
              </h2>
              <p style={{ color: "#aaa", marginBottom: "20px", fontSize: "0.95rem" }}>
                <span style={{ color: "#60a5fa", fontSize: "0.85rem" }}>{selectedProker.ketua_pelaksana}</span>
              </p>

              <div className="markdown-content">
                <ReactMarkdown>{selectedProker.content}</ReactMarkdown>
              </div>

              {selectedProker.youtube_link && (
                <div className="modal-video-container">
                  <div className="video-wrapper">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeID(selectedProker.youtube_link)}`}
                      title="YouTube video player"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL LIST ALL */}
      {isListOpen && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setIsListOpen(false)}></div>
          <div className="modal-card custom-scroll" style={{ maxWidth: "600px" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "white", margin: 0 }}>Semua Proker</h3>
              <BiX size={30} style={{ color: "white", cursor: "pointer" }} onClick={() => setIsListOpen(false)} />
            </div>
            <div style={{ padding: "20px" }}>
              {sorted.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedProker(item);
                    setIsListOpen(false);
                  }}
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "15px",
                    cursor: "pointer",
                    background: "#222",
                    padding: "10px",
                    borderRadius: "15px",
                  }}
                >
                  <div style={{ position: "relative", width: "80px", height: "50px", borderRadius: "8px", overflow: "hidden" }}>
                    <Image src={item.thumbnail} fill alt="t" className="proker-img" />
                  </div>
                  <div className="flex flex-col gap-1 justify-center h-full">
                    <span style={{ color: "white", fontWeight: "500" }}>{item.title}</span>
                    <span style={{ color: "#60a5fa", fontSize: "0.85rem" }}>{item.ketua_pelaksana}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

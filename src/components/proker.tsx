"use client";

import { useState } from "react";
import Image from "next/image";
import { BiX } from "react-icons/bi";
import { MdOutlineExplore, MdCalendarMonth } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import "./proker.css";

const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function ProkerSection({ items }: { items: any[] }) {
  const [selectedProker, setSelectedProker] = useState<any>(null);
  const [isListOpen, setIsListOpen] = useState(false);

  const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const closeDetail = () => setSelectedProker(null);

  return (
    <div className="proker">
      <h2 className="event-name !text-[#304356] mb-10">Our Event</h2>

      <div className="proker-container">
        {/* DIV 1: LATEST */}
        <div className="proker-box proker-div1" onClick={() => setSelectedProker(sorted[0])}>
          <Image src={sorted[0].thumbnail} fill alt="latest" className="proker-img" />
          <div className="proker-overlay-latest">
            <div className="ministry">{sorted[0].title}</div>
          </div>
        </div>

        {/* DIV 2, 3, 4: NORMAL (Data index 1, 2, 3) */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="proker-box" onClick={() => setSelectedProker(sorted[i])}>
            <Image src={sorted[i].thumbnail} fill alt="event" className="proker-img" />
          </div>
        ))}

        {/* DIV 5: EXPLORE MORE (Pakai gambar index ke-4) */}
        <div className="explore-box" onClick={() => setIsListOpen(true)}>
          {sorted[4] && <Image src={sorted[4].thumbnail} fill alt="explore" className="proker-img blur-bg" />}
          <div style={{ zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <MdOutlineExplore size={80} className="explore-icon"/>
            <span className="explore-text">EXPLORE</span>
          </div>
        </div>
      </div>

      {/* --- MODAL DETAIL (Tetap Sama) --- */}
      {selectedProker && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={closeDetail}></div>
          <div className="modal-card custom-scroll">
            <button className="modal-close" onClick={closeDetail}>
              <BiX size={30} />
            </button>
            <div className="modal-banner">
              <Image src={selectedProker.thumbnail} fill alt="banner" className="proker-img" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #18191b, transparent)" }}></div>
            </div>
            <div className="modal-body">
              <div className="modal-date">
                <MdCalendarMonth />
                <span>{new Date(selectedProker.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "20px", fontWeight: "bold" }}>{selectedProker.title}</h2>
              {/* Di dalam Modal Detail, tepat di bawah .markdown-content */}
              <div className="markdown-content">
                <ReactMarkdown>{selectedProker.content}</ReactMarkdown>
              </div>

              {/* Section Video YouTube */}
              {selectedProker.youtube_link && (
                <div className="modal-video-container">
                  <div className="video-wrapper">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeID(selectedProker.youtube_link)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL LIST ALL (Sama seperti sebelumnya) --- */}
      {/* --- MODAL LIST ALL --- */}
      {isListOpen && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setIsListOpen(false)}></div>
          <div className="modal-card list-modal">
            <div className="list-header">
              <h3 className="list-title">Semua Program Kerja</h3>
              <button className="list-close-btn" onClick={() => setIsListOpen(false)}>
                <BiX size={30} />
              </button>
            </div>

            <div className="list-content custom-scroll">
              {sorted.map((item) => (
                <div
                  key={item.id}
                  className="list-item"
                  onClick={() => {
                    setSelectedProker(item);
                    setIsListOpen(false);
                  }}
                >
                  <div className="list-item-img-wrapper">
                    <Image src={item.thumbnail} fill alt="thumb" className="proker-img" />
                  </div>
                  <div className="list-item-info">
                    <span className="list-item-date">
                      <MdCalendarMonth size={14} />
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <h4 className="list-item-title">{item.title}</h4>
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

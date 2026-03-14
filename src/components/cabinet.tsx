"use client";

import { useState } from "react";
import Image from "next/image";
import { BiX } from "react-icons/bi";
import { getData } from "@/lib/firebase/firebase";
import "./cabinet.css";

interface Member {
  id?: string; 
  nama: string;
  jabatan: string;
  foto: string;
}

interface CabinetItem {
  id: string;
  title: string;
  thumbnail: string;
  desc: string;
  anggota: Member[];
}

export default function CabinetSection({ items }: { items: CabinetItem[] }) {
  const [selectedCabinet, setSelectedCabinet] = useState<CabinetItem | null>(null);

  return (
    <div className="cabinet-section">
      <h2 className="section-title">Meet Our Cabinet</h2>

      {/* Horizontal Scroll Container */}
      <div className="cabinet-scroll-container custom-scroll">
        {items.map((item) => (
          <div key={item.id} className="cabinet-card" onClick={() => setSelectedCabinet(item)}>
            <Image src={item.thumbnail} fill alt={item.title} className="cabinet-bg-img" />
            <div className="cabinet-overlay">
              <div className="ministry-tag">{item.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Cabinet */}
      {selectedCabinet && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setSelectedCabinet(null)}></div>
          <div className="modal-card detail-modal custom-scroll">
            <button className="modal-close" onClick={() => setSelectedCabinet(null)}>
              <BiX size={30} />
            </button>

            <div className="modal-banner">
              <Image src={selectedCabinet.thumbnail} fill alt="banner" className="proker-img" />
              <div className="banner-gradient"></div>
            </div>

            <div className="modal-body">
              <h2 className="modal-title">{selectedCabinet.title}</h2>
              <p className="modal-desc">{selectedCabinet.desc}</p>

              <div className="members-grid">
                {selectedCabinet.anggota.map((member, idx) => (
                  <div key={idx} className="member-card">
                    <div className="member-photo-wrapper">
                      <Image src={member.foto} fill alt={member.nama} className="member-photo" />
                    </div>
                    <p className="member-name">{member.nama}</p>
                    <p className="member-role">{member.jabatan}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

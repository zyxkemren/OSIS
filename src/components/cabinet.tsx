"use client";

import { useState } from "react";
import Image from "next/image";
import { BiX, BiChevronRight } from "react-icons/bi";
import "./cabinet.css";

interface Member {
  id?: string;
  nama: string;
  jabatan: string;
  foto: string;
  angkatan?: string;
}

interface CabinetItem {
  id: string;
  title: string;
  thumbnail: string;
  desc: string;
  anggota: Member[];
}

interface CabinetProps {
  items: CabinetItem[];
  allProkers?: any[]; // <--- TAMBAHAN: Menerima seluruh data proker
  onSelectProker?: (prokerId: number | string) => void; // <--- TAMBAHAN: Fungsi ketika proker diklik
}

export default function CabinetSection({ items, allProkers = [], onSelectProker }: CabinetProps) {
  const [selectedCabinet, setSelectedCabinet] = useState<CabinetItem | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // LOGIKA PENCARIAN PROKER:
  // Mencari proker di mana 'ketua_pelaksana' sama dengan nama member yang sedang diklik.
  // Menggunakan toLowerCase() dan trim() agar pencarian tidak sensitif huruf besar/kecil dan spasi berlebih.
  const memberProkers = selectedMember
    ? allProkers.filter((p) => p.ketua_pelaksana?.toLowerCase().trim() === selectedMember.nama.toLowerCase().trim())
    : [];

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

      {/* MODAL KEMENTERIAN */}
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
                  <div key={idx} className="member-card" onClick={() => setSelectedMember(member)} style={{ cursor: "pointer" }}>
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

      {/* MODAL BIODATA ANGGOTA */}
      {selectedMember && (
        <div className="modal-overlay" style={{ zIndex: 1100, transform: "scale(1.05)" }}>
          <div className="modal-backdrop" onClick={() => setSelectedMember(null)}></div>
          <div className="modal-card biodata-modal">
            <button className="modal-close" onClick={() => setSelectedMember(null)}>
              <BiX size={30} />
            </button>

            <div className="biodata-content">
              <div className="member-photo-wrapper big">
                <Image src={selectedMember.foto} fill alt={selectedMember.nama} className="member-photo" />
              </div>
              <div className="biodata-details">
                <p className="biodata-kementrian">
                  {selectedCabinet?.title.replace("IT", "Informasi dan Teknologi").replace("BPH", "Badan Pengurus Harian")}
                </p>
                <h3 className="modal-title">{selectedMember.nama}</h3>
                <div className="biodata-jabatan-container">
                  <p className="biodata-jabatan">{selectedMember.jabatan}</p>
                  {selectedMember.angkatan && <p className="biodata-jabatan">Angkatan {selectedMember.angkatan}</p>}
                </div>
              </div>
            </div>

            {/* --- LIST PROKER YANG DIPEGANG ANGGOTA --- */}
            {memberProkers.length > 0 && (
              <div className="member-proker-container">
                <h4 className="proker-title-small">Ketua Pelaksana Program:</h4>
                <div className="member-proker-list custom-scroll">
                  {memberProkers.map((proker) => (
                    <div
                      key={proker.id}
                      className="member-proker-item"
                      onClick={() => {
                        if (onSelectProker) {
                          onSelectProker(proker.id);
                          setSelectedMember(null); // Tutup modal anggota
                          setSelectedCabinet(null); // Tutup modal kementerian agar langsung lompat ke view proker
                        }
                      }}
                    >
                      <span>{proker.title}</span>
                      {onSelectProker && <BiChevronRight size={22} className="proker-arrow-icon" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

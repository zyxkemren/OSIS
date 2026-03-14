"use client";

import { getData } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import Navbar from "@/components/ui/navbar";
import "./main.css";
import ProkerSection from "@/components/proker";
import CabinetSection from "@/components/cabinet";
import HeroSection from "@/components/hero";

export default function HomePage() {
  const [data, setData] = useState({
    general: {} as any,
    content: {} as any,
    cabinet: [] as any[],
    prokers: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleLearnMore = (id: number) => {
    setSelectedId(id);
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [general, content, cabinet, prokers] = await Promise.all([
          getData("general"),
          getData("content"),
          getData("cabinet"),
          getData("prokers"),
        ]);

        const sortedProker = (prokers?.items || []).sort((a: any, b: any) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        if (isMounted) {
          setData({
            general: general || {},
            content: content || {},
            cabinet: cabinet?.items || [],
            prokers: sortedProker,
          });
        }
      } catch (e) {
        console.error("Fetch error:", e);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  if (error) return <h1>error bos</h1>;

  const heroDisplayItems = (() => {
    // 1. Cek apakah ada settingan hero di dashboard
    if (data.content?.hero_items && data.content.hero_items.length > 0) {
      return data.content.hero_items
        .map((hero: any) => {
          // Cari data proker yang ID-nya cocok dengan prokerId di hero setting
          const linkedProker = data.prokers.find((p) => String(p.id) === String(hero.prokerId));

          if (linkedProker) {
            return {
              id: linkedProker.id,
              prokerId: linkedProker.id,
              eventName: linkedProker.title,
              tagline: "Our Event", 
              banner: linkedProker.thumbnail,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    // 2. Jika settingan dashboard kosong, pakai 2 proker terbaru otomatis
    return data.prokers.slice(0, 2).map((p: any) => ({
      id: p.id,
      prokerId: p.id,
      eventName: p.title,
      tagline: "Latest Event",
      banner: p.thumbnail,
    }));
  })();

  return (
    <main className="main-layout">
      <Navbar active={1} logo={data.general?.website_name || "OSIS Al Bayan"} />

      <HeroSection items={heroDisplayItems} onLearnMore={handleLearnMore} />

      <section className="intro-section" id="home">
        <div className="intro-header">
          <h1>{data.content?.title || "title blm diatur"}</h1>
        </div>

        <div className="intro-content">
          <p className="intro-desc">{data.content?.description || "deskripsi belum diatur."}</p>

          <div className="video-section">
            <div className="video-box">
              <iframe
                className="video-iframe"
                src={`https://www.youtube.com/embed/${data.content?.video_id || "Y4mgpC_kj3M"}?rel=0&controls=0&disablekb=1&autoplay=1&mute=1`}
                title="After Movie OSIS"
                allowFullScreen
              ></iframe>
            </div>
            <p className="video-caption">🎥 {data.content?.video_caption || "After Movie OSIS"}</p>
          </div>
        </div>
      </section>

      {/* Sosmed, Cabinet, and Proker Sections... */}
      <section className="sosmed-section">
        <div className="sosmed-wrapper">
          <a href={data.general?.instagram_osis || "#"} target="_blank" rel="noopener noreferrer" className="sosmed">
            <FaInstagram /> <span>Instagram OSIS Albayan</span>
          </a>
          <a href={data.general?.youtube_channel || "#"} target="_blank" rel="noopener noreferrer" className="sosmed utama">
            <FaYoutube /> <span>Youtube OSIS Albayan</span>
          </a>
          <a href={data.general?.instagram_mpk || "#"} target="_blank" rel="noopener noreferrer" className="sosmed">
            <FaInstagram /> <span>Instagram MPK Albayan</span>
          </a>
        </div>
      </section>

      <section id="cabinet" className="sec3 !py-[5rem] !px-0">
        <CabinetSection items={data.cabinet} />
      </section>

      <section id="proker" className="sec3 !pt-0 !pb-[5rem]">
        <ProkerSection items={data.prokers} externalSelectedId={selectedId} onCloseModal={() => setSelectedId(null)} />
      </section>

      <footer className="footer">© {data.general?.footer_text || `Kementerian Informasi dan Teknologi ${new Date().getFullYear()}`}</footer>
    </main>
  );
}

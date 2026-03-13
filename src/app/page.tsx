"use client";

import { getData } from "@/lib/firebase/firebase";
import { useState, useEffect, useMemo } from "react"; // Tambah useMemo
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import Navbar from "@/components/ui/navbar";
import Image from "next/image";
import "./main.css";
import ProkerSection from "@/components/proker";
import CabinetSection from "@/components/cabinet";
import HeroSection from "@/components/hero";

// PINDAHKAN DATA KE ATAS TANPA 'EXPORT'
const dummyProker = [
  {
    id: 1,
    title: "Rahasia Ngoding Sambil Ngopi",
    date: "2026-03-12T08:30:00Z",
    thumbnail: "https://picsum.photos/seed/coding/800/450",
    youtube_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content:
      '### Pendahuluan\nNgoding tanpa kopi itu ibarat sayur tanpa garam.\n\n![Kopi](https://picsum.photos/seed/coffee/600/300)\n\n**Kenapa harus kopi?**\n* Menambah fokus.\n* Menunda kantuk.\n\n> "Code is like humor. When you have to explain it, it’s bad."',
  },
  {
    id: 2,
    title: "Review Setup Minimalis 2026",
    date: "2026-03-12T09:15:22Z",
    thumbnail: "https://picsum.photos/seed/setup/800/450",
    youtube_link: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    content:
      "## Setup Masa Depan\nBanyak orang tanya gimana cara bikin meja rapi.\n\n![Desk](https://picsum.photos/seed/desk/600/300)\n\n### Komponen Utama:\n1. Monitor Ultra-wide.\n2. Mechanical Keyboard.\n3. Tanaman kecil.",
  },
  {
    id: 3,
    title: "Tips Traveling Murah ke Mars",
    date: "2026-03-11T21:00:00Z",
    thumbnail: "https://picsum.photos/seed/mars/800/450",
    youtube_link: "https://www.youtube.com/watch?v=pW8H7P02W3Q",
    content:
      "### Persiapan Roket\nJangan lupa bawa bekal yang awet.\n\n![Space](https://picsum.photos/seed/space/600/300)\n\n**Barang bawaan:**\n* Baju astronot.\n* Powerbank.\n* Kamera buat konten IG.",
  },
  {
    id: 4,
    title: "Belajar Masak Mie Instan Mewah",
    date: "2026-03-11T12:45:10Z",
    thumbnail: "https://picsum.photos/seed/food/800/450",
    youtube_link: "https://www.youtube.com/watch?v=XvK_GqV-4Fk",
    content:
      "## Level Up Mie Instan\nGak perlu mahal buat makan enak.\n\n![Ramen](https://picsum.photos/seed/ramen/600/300)\n\nCoba deh teknik **slow cooking** (aka nunggu air mendidih).",
  },
  {
    id: 5,
    title: "Tutorial Tidur 8 Jam dalam 4 Jam",
    date: "2026-03-10T23:59:59Z",
    thumbnail: "https://picsum.photos/seed/sleep/800/450",
    youtube_link: "https://www.youtube.com/watch?v=6K_S8-lO-XU",
    content:
      "### Power Nap Is Real\nSebenernya ini mustahil, tapi mari kita coba teorinya.\n\n![Sleepy](https://picsum.photos/seed/nap/600/300)\n\n* Matikan lampu.\n* Jauhkan HP.",
  },
  {
    id: 6,
    title: "Koleksi Tanaman Indoor Hits",
    date: "2026-03-09T15:20:00Z",
    thumbnail: "https://picsum.photos/seed/plant/800/450",
    youtube_link: "https://www.youtube.com/watch?v=UqN6yqO_f_k",
    content:
      "## Hijaukan Kamarmu\nTanaman bikin udara seger dan mata adem.\n\n![Plants](https://picsum.photos/seed/indoorplant/600/300)\n\n**Rekomendasi:**\n- Monstera.\n- Lidah Mertua.",
  },
  {
    id: 7,
    title: "Cara Menghindari Deadline",
    date: "2026-03-08T10:00:00Z",
    thumbnail: "https://picsum.photos/seed/stress/800/450",
    youtube_link: "https://www.youtube.com/watch?v=Yp69X-yB9Yw",
    content:
      '### Seni Menunda\nDeadline adalah motivasi terbaik!\n\n![Work](https://picsum.photos/seed/work/600/300)\n\n> "Procrastination is the thief of time."',
  },
];

export const dummyCabinet = [
  {
    id: "bph",
    title: "Badan Pengurus Harian",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070",
    desc: "Inti dari organisasi yang bertanggung jawab atas koordinasi seluruh kementerian dan pengambilan keputusan strategis OSIS.",
    anggota: [
      { nama: "Zidane", jabatan: "Ketua OSIS", foto: "https://i.pravatar.cc/150?u=a1" },
      { nama: "Alaric", jabatan: "Wakil Ketua OSIS", foto: "https://i.pravatar.cc/150?u=a2" },
      { nama: "Shafa", jabatan: "Sekretaris 1", foto: "https://i.pravatar.cc/150?u=a3" },
      { nama: "Keysha", jabatan: "Sekretaris 2", foto: "https://i.pravatar.cc/150?u=a4" },
      { nama: "Raihan", jabatan: "Bendahara 1", foto: "https://i.pravatar.cc/150?u=a5" },
      { nama: "Alya", jabatan: "Bendahara 2", foto: "https://i.pravatar.cc/150?u=a6" },
    ],
  },
  {
    id: "kemen-it",
    title: "Kementerian Informasi dan Teknologi",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
    desc: "Mengelola seluruh platform digital OSIS, website, dan dokumentasi kegiatan sekolah.",
    anggota: [
      { nama: "Rafi", jabatan: "Menteri", foto: "https://i.pravatar.cc/150?u=i1" },
      { nama: "Arga", jabatan: "Staff", foto: "https://i.pravatar.cc/150?u=i2" },
      { nama: "Lutfi", jabatan: "Staff", foto: "https://i.pravatar.cc/150?u=i3" },
      { nama: "Zahra", jabatan: "Staff", foto: "https://i.pravatar.cc/150?u=i4" },
    ],
  },
  {
    id: "kemen-seni",
    title: "Kementerian Seni dan Budaya",
    thumbnail: "https://images.unsplash.com/photo-1514525253361-bee8a187449b?q=80&w=1964",
    desc: "Mengembangkan bakat kreativitas siswa dalam bidang seni pertunjukan, rupa, dan musik.",
    anggota: [
      { nama: "Dimas", jabatan: "Menteri", foto: "https://i.pravatar.cc/150?u=s1" },
      { nama: "Gendis", jabatan: "Staff", foto: "https://i.pravatar.cc/150?u=s2" },
      { nama: "Fauzan", jabatan: "Staff", foto: "https://i.pravatar.cc/150?u=s3" },
    ],
  },
];

const dummyHero = [
  {
    id: "hero-1",
    prokerId: 1,
    eventName: "Sanlat 2026",
    tagline: "Our event",
    banner: "./img/_MG_7205.jpg.jpeg",
  },
  {
    id: "hero-2",
    prokerId: 7,
    eventName: "Albacadabra 2025",
    tagline: "Our event",
    banner: "./img/abcd25.png",
  },
];

export default function HomePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Sorting proker menggunakan useMemo biar nggak re-run terus
  const sortedProker = useMemo(() => {
    return [...dummyProker].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const handleLearnMore = (id: number) => {
    setSelectedId(id);
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const res = await getData("anggota");
        if (isMounted) setData(res);
      } catch (e) {
        console.error(e);
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

  return (
    <main className="main-layout">
      <Navbar active={1} logo="OSIS Al Bayan" />

      <HeroSection items={dummyHero} onLearnMore={handleLearnMore} />

      <section className="intro-section" id="home">
        <div className="intro-header">
          <h1>Welcome to Arthawisesa</h1>
        </div>

        <div className="intro-content">
          <p className="intro-desc">
            {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\nIt has survived not only five centuries. but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing`}
          </p>

          <div className="video-section">
            <div className="video-box">
              <iframe
                className="video-iframe"
                src="https://www.youtube.com/embed/Y4mgpC_kj3M?rel=0&controls=0&disablekb=1&autoplay=1&mute=1"
                title="After Movie OSIS"
                allowFullScreen
              ></iframe>
            </div>
            <p className="video-caption">🎥 After Movie Sanlat 2026</p>
          </div>
        </div>
      </section>

      <section className="sosmed-section">
        <div className="sosmed-wrapper">
          <a href="https://www.instagram.com/osis.alba/" target="_blank" rel="noopener noreferrer" className="sosmed">
            <FaInstagram />
            <span>Instagram OSIS Albayan</span>
          </a>
          <a href="https://www.youtube.com/@osissmapualbayancibadak5627" target="_blank" rel="noopener noreferrer" className="sosmed utama">
            <FaYoutube />
            <span>Youtube OSIS Albayan</span>
          </a>
          <a href="https://www.instagram.com/mpk.alba/" target="_blank" rel="noopener noreferrer" className="sosmed">
            <FaInstagram />
            <span>Instagram MPK Albayan</span>
          </a>
        </div>
      </section>

      <section id="cabinet" className="sec3 !py-[5rem] !px-0">
        <CabinetSection items={dummyCabinet} />
      </section>

      <section id="event" className="sec3 !pt-0 !pb-[5rem]">
        <ProkerSection items={sortedProker} externalSelectedId={selectedId} onCloseModal={() => setSelectedId(null)} />
      </section>

      <footer className="footer">© Kementerian Informasi dan Teknologi 2026</footer>
    </main>
  );
}

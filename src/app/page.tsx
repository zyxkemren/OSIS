"use client";

import { getData } from "@/lib/firebase/firebase";
import { useState, useEffect } from "react";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import Navbar from "@/components/ui/navbar";
import Image from "next/image";
import "./main.css";

export default function HomePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getData("anggota");
        setData(res);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Waduh, ada masalah pas ambil data.</h1>;

  return (
    <main className="overflow-x-hidden">
      <Navbar active={1} logo="OSIS AL Bayan" />
      <div className="start w-full h-[100vh] flex flex-col items-start justify-between px-30 pb-25 pt-25">
        <div className="banner">
          <Image
            src="/img/_MG_7205.jpg.jpeg" // Ganti dengan path gambarmu
            alt="Albacadabra Background"
            layout="fill"
            objectFit="fit"
            objectPosition="bottom"
            unoptimized={true}
            priority
          />
        </div>
        <div className="start-arrow flex flex-row justify-between w-full">
          <BiSolidLeftArrow className="text-white text-4xl" />
          <BiSolidRightArrow className="text-white text-4xl" />
        </div>
        <div className="flex flex-row items-center justify-between w-full z-2">
          <div className="flex flex-col items-center justify-end gap-3">
            <div className="flex flex-col">
              <span className="text-gray-200">Our event</span>
              <h2 className="event-name text-white text-[2rem] font-[100]">SANLAT (Pesantren Kilat) 26</h2>
            </div>
            <div className="bg-white w-full text-center px-full py-[10px] rounded-[50px] cursor-pointer">Learn more</div>
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <div className="flex flex-row items-center items-center justify-between drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
              <Image src="/img/osisalba.svg" alt="Logo" width={50} height={50} unoptimized={true} />
              <Image src="/img/osis.svg" alt="Logo" width={35} height={35} unoptimized={true} />
              <Image src="/img/alba.svg" alt="Logo" width={50} height={50} unoptimized={true} />
            </div>
            <p>SMA PU AL BAYAN CIBADAK</p>
          </div>
        </div>
      </div>
      <div className="relative z-1 w-full h-[200px] bg-gradient-to-t from-[#001f3f] to-transparent -mt-[280px]"></div>
      <div className="flex flex-row justify-between bg-[#001f3f] w-full p-50 gap-[5vw]">
        <div className="flex flex-col max-w-[60vw] gap-[25px]">
          <h2 className="text-[3rem] font-bold">Welcome to Arthawisesa</h2>
          <p className="whitespace-pre-line">
            {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\nIt has survived not only
            five centuries. but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
            release of Letraset sheets containing`}
          </p>
        </div>
        <div className="w-full max-w-[30vw] mx-auto p-4]">
          <div className="relative aspect-video rounded-[25px] overflow-hidden drop-shadow-[0_0_40px_#ffffff59]">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-none"
              frameBorder={0}
              src="https://www.youtube.com/embed/Y4mgpC_kj3M"
              title="After Movie OSIS"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              style={{ border: "none" }}
              allowFullScreen
            ></iframe>
          </div>
          <p className="mt-4 text-center font-medium text-gray-700">🎥 After Movie Sanlat 2026</p>
        </div>
      </div>
      <div className="w-full px-50 py-10 flex flex-col  bg-[#18191b]">
        <span className="text-center text-white text-[1.5rem] font-black">Follow our social media</span>
        <div className="w-full pt-10 flex flex-row justify-between gap-[3vw]">
          <div className="w-full h-[100px] border-[3px] border-white rounded-[20px]"></div>
          <div className="w-full h-[100px] bg-white rounded-[20px]"></div>
          <div className="w-full h-[100px] border-[3px] border-white rounded-[20px]"></div>
        </div>
      </div>
      <div className="cabinet py-30 px-50">
        <h2 className="text-[2rem] font-bold !text-[#304356] mb-10">Meet our cabinet</h2>
        <div className="w-full flex flex-row gap-4 overflow-x-auto pb-4 custom-scroll">
          <div className="boxes">
            <div className="ministry">Kementrian Kontol</div>
          </div>
          <div className="boxes">
            <div className="ministry">Kementrian Kontol</div>
          </div>
          <div className="boxes">
            <div className="ministry">Kementrian Kontol</div>
          </div>
          <div className="boxes">
            <div className="ministry">Kementrian Kontol</div>
          </div>
        </div>
      </div>
    </main>
  );
}

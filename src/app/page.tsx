"use client";

import { getData } from "@/lib/firebase/firebase";
import { useState, useEffect } from "react";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import Navbar from "@/components/ui/navbar";
import Image from "next/image";

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
      <div className="background"></div>
      <Navbar active={1} logo="OSIS AL Bayan" />
      <div className="start w-full h-[80vh] flex flex-col items-start justify-between px-30 pb-25 pt-25">
        <div className="start-menu w-full h-[100px] flex flex-row justify-between items-center">
          <h2>SMA PU Albayan Cibadak</h2>
          <div className="logo flex flex-row items-center gap-4">
            <span>
              <Image src="/img/osis.png" alt="Logo" width={50} height={50} />
            </span>
            <span>
              <Image src="/img/alba.png" alt="Logo" width={60} height={50} />
            </span>
          </div>
        </div>
        <div className="banner">
          <Image
            src="/img/abcd25.png" // Ganti dengan path gambarmu
            alt="Albacadabra Background"
            layout="fill"
            objectFit="fit"
            objectPosition="bottom"
            priority
          />
        </div>
        <div className="start-arrow flex flex-row justify-between w-full">
          <BiSolidLeftArrow className="text-white text-4xl" />
          <BiSolidRightArrow className="text-white text-4xl" />
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col">
            <span className="text-gray-200">Our event</span>
            <span className="text-white text-[2rem] font-bold">Albacadabra 2K25</span>
          </div>
          <div className="bg-white w-full text-center px-full py-[10px] rounded-[50px] cursor-pointer">Learn more</div>
        </div>
      </div>
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
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/naz0-szzYXk"
              title="After Movie OSIS"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <p className="mt-4 text-center font-medium text-gray-700">🎥 After Movie Nasionalismeku 2024</p>
        </div>
      </div>
      <div className="w-full px-50 py-10 flex flex-col  bg-[#18191b] ">
        <span className="text-center text-white text-[1.5rem] font-black">Follow our social media</span>
        <div className="w-full pt-10 flex flex-row justify-between gap-[3vw]">
          <div className="w-full h-[100px] border-[3px] border-white rounded-[20px]"></div>
          <div className="w-full h-[100px] bg-white rounded-[20px]"></div>
          <div className="w-full h-[100px] border-[3px] border-white rounded-[20px]"></div>
        </div>
      </div>
      <div></div>
    </main>
  );
}

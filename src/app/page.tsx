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
    <main>
      <Navbar active={1} logo="OSIS AL Bayan" />
      <div className="start width-full h-[80vh] flex flex-col items-start justify-between bg-red-500 p-20">
        <div className="start-menu w-full bg-yellow-100 h-[100px] flex flex-row justify-between items-center">
          <div>OSIS AL Bayan</div>
          <div className="logo flex flex-row items-center gap-4">
            <span>
              <Image src="/img/osis.png" alt="Logo" width={50} height={50} />
            </span>
            <span>
              <Image src="/img/alba.png" alt="Logo" width={60} height={50} />
            </span>
          </div>
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
      <div className="flex flex-row justify-between bg-yellow-300 w-full p-20 gap-[5vw]">
        <div className="flex flex-col max-w-[60vw] gap-[25px]">
          <span className="text-[2rem] font-bold">Introduction to Arthawisesa</span>
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
          <p className="mt-4 text-center font-medium text-gray-700">🎥 After Movie LDKS & Sertijab OSIS</p>
        </div>
      </div>
    </main>
  );
}

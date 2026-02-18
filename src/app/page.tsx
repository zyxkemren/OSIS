"use client";

import { getData } from "@/lib/firebase/firebase";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getData("general");
        setData(res);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, []);

  return !loading ? (
    <main>
      <h1>Data from Firebase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  ) : (
    <main>
      <h1>Loading...</h1>
    </main>
  );
}

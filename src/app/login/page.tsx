"use client";

import { supabase } from "@/lib/supabase"; // Sesuaikan path-nya ya!
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Supabase butuh format email.
      // Trik: Kalau admin kamu cuma ngetik "admin", kita otomatis tambahin domain di belakangnya.
      // Pastikan email ini SAMA dengan yang kamu daftarin di dashboard Supabase tadi ya!
      const email = username.includes("@") ? username : `${username}@osis.com`;

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) throw signInError;

      // Kalau sukses, lempar ke dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError("Username atau password salah");
      console.error(err.message);
    }
  };

  return (
    <div>
      <input placeholder="username atau email" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}

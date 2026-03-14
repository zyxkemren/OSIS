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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Login OSIS</h2>
          <p className="text-gray-500 mt-2 text-sm">Masuk untuk mengakses dashboard</p>
        </div>

        {/* Form Section */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Username atau Email
            </label>
            <input 
              type="text"
              placeholder="Contoh: admin" 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            onClick={handleLogin}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-4 focus:ring-blue-200 focus:outline-none"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

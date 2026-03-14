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
      const email = username.includes("@") ? username : `${username}@osis.com`;

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) throw signInError;

      router.push("/dashboard");
    } catch (err: any) {
      setError("Username atau password salah");
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-gray-100 px-4 font-sans">
      <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl p-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">Login to Dashboard</h1>
          <p className="text-sm text-gray-400 mt-2">Anomaly Network</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md text-center font-medium">
            {error}
          </div>
        )}

        {/* Form Section */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username atau Email
            </label>
            <input 
              type="text"
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
            />
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleLogin}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181b] focus:ring-white mt-4"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Sesuaikan path-nya!
import { Provider } from "@/components/ui/provider";
import { SidebarProvider } from "@/components/sidebar-provider";
import "./dashboard.css";
import "./template.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek session saat pertama kali load
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Pasang listener kalau sewaktu-waktu session habis/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    // Cleanup listener
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  return (
    <Provider>
      <SidebarProvider>{children}</SidebarProvider>
    </Provider>
  );
}

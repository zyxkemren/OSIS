"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { Provider } from "@/components/ui/provider";
import { SidebarProvider } from "@/components/sidebar-provider";
import "./dashboard.css";
import "./template.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

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
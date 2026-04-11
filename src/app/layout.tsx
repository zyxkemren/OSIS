import type { Metadata } from "next";
import {
  Poppins,
  Montserrat,
  Work_Sans,
  Plus_Jakarta_Sans,
  Lexend,
  Inter, // Tambah Inter
} from "next/font/google";
import "./globals.css";
import { getData } from "@/lib/supabase";
import { Analytics } from "@vercel/analytics/react";

// Konfigurasi Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--Inter", // Akan dipanggil di CSS via var(--Inter)
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--Poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--Montserrat",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--WorkSans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--PlusJakartaSans",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--Lexend",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteData: any = await getData("general");
  return {
    title: siteData?.data?.server_name ?? "OSIS AL BAYAN - Official Website",
    description: siteData?.data?.website_description ?? "Official Website",
    icons: {
      icon: [{ url: "/img/osisalba.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      title: siteData?.data?.server_name ?? "OSIS AL BAYAN - Official Website",
      description: siteData?.data?.website_description ?? "Official Website",
      images: [
        {
          url: siteData?.data?.website_image ?? "/img/thumbnail.png",
          width: 1200,
          height: 630,
          alt: siteData?.data?.server_name ?? "OSIS AL BAYAN - Official Website",
        },
      ],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          ${poppins.variable} 
          ${montserrat.variable} 
          ${workSans.variable} 
          ${plusJakarta.variable} 
          ${lexend.variable} 
          antialiased
        `}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

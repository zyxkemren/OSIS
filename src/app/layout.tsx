import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getData } from "@/lib/firebase/firebase";
import { Analytics } from "@vercel/analytics/react";

// Load fonts
const poppins = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins",
});

const montserrat = localFont({
  src: "./fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
});

const workSans = localFont({
  src: "./fonts/WorkSans-Regular.ttf",
  variable: "--font-worksans",
});

const plusJakarta = localFont({
  src: "./fonts/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--font-plusjakarta",
});

const lexend = localFont({
  src: "./fonts/Lexend-VariableFont_wght.ttf",
  variable: "--font-lexend",
});

// Metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  const siteData: any = await getData("general"); // Ambil data dari API / Database

  return {
    title: siteData?.data?.server_name ?? "OSIS Albayan",
description:
  siteData?.data?.website_description ??
  "Adalah Webstore Minecraft #1 di Indonesia ...",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${montserrat.variable} ${workSans.variable} ${plusJakarta.variable} ${lexend.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

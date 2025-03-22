import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/navbar";
import React from "react";
import { SelectedPage } from "@/utils/types";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});


export const metadata: Metadata = {
  title: "thoughtmirror",
  description: "AI-powered reflection",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

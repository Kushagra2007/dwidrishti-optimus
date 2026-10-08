import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { displayFont, uiFont } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Dwi Drishti News: same news, two views",
  description: "Cross-lingual Indian media perspective and framing analysis platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}

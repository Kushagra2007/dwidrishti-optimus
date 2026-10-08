import { Bricolage_Grotesque, Hanken_Grotesk, Noto_Sans_Devanagari } from "next/font/google";

export const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

export const uiFont = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const devanagariFont = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

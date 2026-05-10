import type { Metadata } from "next";
import { Geist, Geist_Mono, Jersey_10, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontGame = Jersey_10({
  variable: "--font-game",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "HIMATIC - Competition Dashboard",
  description: "Platform pendaftaran lomba HIMATIC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, fontGame.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}

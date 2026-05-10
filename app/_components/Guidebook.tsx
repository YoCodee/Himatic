"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const competitions = [
  {
    id: "uiux",
    shortName: "MUC",
    title: "Mobile UI/UX Competition",
    image: "/images/guidebook/uiux-competition.png",
    badges: ["Mahasiswa/i S1/D4/D3", "Maks. 2 Orang", "Rp100.000,00"],
    description:
      'Mobile UI/UX Competition adalah kompetisi yang berfokus pada perancangan tampilan serta pengalaman pengguna aplikasi digital berbasis mobile. Kompetisi ini mengajak peserta untuk menciptakan desain aplikasi yang inovatif, inklusif, dan fungsional.',
    guidebookUrl: "#",
    registerUrl: "/sign-up",
  },
  {
    id: "webdev",
    shortName: "WDC",
    title: "Web Development Competition",
    image: "/images/guidebook/cp-competition.png",
    badges: ["Mahasiswa/i S1/D4/D3", "Maks. 3 Orang", "Rp150.000,00"],
    description:
      "Web Development Competition adalah kompetisi yang menguji kemampuan peserta dalam membangun website yang fungsional, responsif, dan inovatif. Peserta akan merancang dan mengembangkan solusi web menggunakan teknologi pilihan mereka.",
    guidebookUrl: "#",
    registerUrl: "/sign-up",
  },
];

function CompetitionCard({
  comp,
  reverse,
}: {
  comp: (typeof competitions)[0];
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-10 items-stretch`}
    >
      {/* Image Side */}
      <div className="md:w-5/12 relative group">
        <div className="relative overflow-hidden border-2 border-yellow-400/30 rounded-sm aspect-[4/3]">
          {/* Pixel scan-line effect overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            }}
          />
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400 z-20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400 z-20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400 z-20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400 z-20" />

          <Image
            src={comp.image}
            alt={comp.title}
            width={800}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Info Side */}
      <div className="md:w-7/12 flex flex-col justify-center gap-4">
        {/* Short name */}
        <div>
          <span
            className="font-game text-yellow-400 text-lg tracking-widest"
            style={{ textShadow: "1px 1px 0 #000" }}
          >
            {comp.shortName}
          </span>
          <h3
            className="font-game text-white text-2xl md:text-3xl lg:text-4xl mt-1"
            style={{
              textShadow:
                "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
            }}
          >
            {comp.title}
          </h3>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {comp.badges.map((badge) => (
            <span
              key={badge}
              className="font-game text-sm text-white/90 bg-[#1c2040] border border-yellow-400/30 px-3 py-1.5 rounded-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm md:text-base font-sans leading-relaxed">
          {comp.description}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
          <Link href={comp.guidebookUrl}>
            <Button
              variant="pixel"
              className="font-game text-lg gap-2"
            >
              <span>▶</span> Selengkapnya
            </Button>
          </Link>
          <Link href={comp.registerUrl}>
            <button className="font-game text-lg text-yellow-400 border-2 border-yellow-400 bg-transparent px-4 py-1.5 hover:bg-yellow-400/10 transition-colors duration-200 flex items-center gap-2">
              <span>▶</span> Daftar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Guidebook() {
  return (
    <section
      id="guidebook"
      className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-24"
      style={{ backgroundColor: "#0c0e17" }}
    >
      {/* Section Title */}
      <div className="text-center mb-16 md:mb-20">
        <h2
          className="font-game text-yellow-400 text-4xl md:text-5xl tracking-wide inline-block"
          style={{
            textShadow:
              "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
          }}
        >
          {"< Guidebook />"}
        </h2>
        {/* Pixel divider */}
        <div className="flex items-center justify-center gap-1 mt-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-yellow-400"
              style={{
                width: i === 3 ? "12px" : "6px",
                height: i === 3 ? "12px" : "6px",
                opacity:
                  i === 0 || i === 6
                    ? 0.3
                    : i === 1 || i === 5
                      ? 0.5
                      : i === 2 || i === 4
                        ? 0.7
                        : 1,
              }}
            />
          ))}
        </div>
        <p className="font-sans text-white/50 text-sm md:text-base mt-4 max-w-xl mx-auto">
          Pilih lomba yang sesuai dengan minat dan keahlianmu. Unduh guidebook
          untuk informasi lengkap.
        </p>
      </div>

      {/* Competition Cards */}
      <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-24">
        {competitions.map((comp) => (
          <CompetitionCard
            key={comp.id}
            comp={comp}
          />
        ))}
      </div>
    </section>
  );
}

export default Guidebook;

"use client";

import React from "react";
import Image from "next/image";

const timelineEvents = [
  {
    date: "1 Juni 2026",
    title: "Pendaftaran Dibuka",
    description: "Pendaftaran online untuk semua kategori lomba resmi dibuka.",
    icon: "📝",
  },
  {
    date: "10 Juni 2026",
    title: "Penutupan Pendaftaran",
    description: "Batas akhir pendaftaran. Pastikan data kamu sudah lengkap!",
    icon: "🔒",
  },
  {
    date: "12 Juni 2026",
    title: "Technical Meeting",
    description: "Briefing teknis untuk seluruh peserta melalui platform online.",
    icon: "🎙️",
  },
  {
    date: "15 Juni 2026",
    title: "Babak Penyisihan",
    description: "Babak penyisihan UI/UX Design & Competitive Programming dimulai.",
    icon: "⚔️",
  },
  {
    date: "18 Juni 2026",
    title: "Pengumuman Finalis",
    description: "Pengumuman peserta yang lolos ke babak final.",
    icon: "📢",
  },
  {
    date: "20 Juni 2026",
    title: "Grand Final & Awarding",
    description: "Babak final dan pengumuman pemenang. Selamat berjuang!",
    icon: "🏆",
  },
];

function Timeline() {
  return (
    <section id="timeline" className="relative w-full overflow-hidden">

      <Image
        src="/images/hero/6dc2ad3da1445ed8adca5e83b6dd6f7b.jpg"
        alt="timeline background"
        width={1000}
        height={1000}
        className="absolute inset-0 w-full h-full object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/70 z-[1]" />


      <div
        className="absolute top-0 left-0 w-full h-32 z-[2] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #0c0e17, transparent)",
        }}
      />
      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 z-[2] pointer-events-none"
        style={{
          background: "linear-gradient(to top, #0c0e17, transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 py-20 md:py-28 px-6 md:px-12 lg:px-24">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            className="font-game text-yellow-400 text-4xl md:text-5xl tracking-wide inline-block"
            style={{
              textShadow:
                "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
            }}
          >
            {"< Timeline />"}
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
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical pixel line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-yellow-400/20">
            {/* Animated pixel dots on the line */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 w-1 h-1 bg-yellow-400/60"
                  style={{ top: `${i * 5}%` }}
                />
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="flex flex-col gap-2">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative pl-16 md:pl-20 group">
                {/* Pixel node on timeline */}
                <div className="absolute left-4 md:left-6 top-6 w-5 h-5 border-2 border-yellow-400 bg-[#0c0e17] z-10 rotate-45 group-hover:bg-yellow-400 transition-colors duration-300" />

                {/* Event card */}
                <div className="bg-[#0c0e17]/80 border border-yellow-400/20 p-5 md:p-6 rounded-sm relative overflow-hidden group-hover:border-yellow-400/50 transition-all duration-300">
                  {/* Pixel corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400/40 group-hover:bg-yellow-400 transition-colors duration-300" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400/40 group-hover:bg-yellow-400 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400/40 group-hover:bg-yellow-400 transition-colors duration-300" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400/40 group-hover:bg-yellow-400 transition-colors duration-300" />

                  {/* Date badge */}
                  <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-sm mb-3">
                    <span className="text-yellow-400 font-game text-sm">
                      {event.date}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{event.icon}</span>
                    <h3
                      className="font-game text-white text-xl md:text-2xl"
                      style={{ textShadow: "1px 1px 0 #000" }}
                    >
                      {event.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-white/60 text-sm md:text-base font-sans leading-relaxed">
                    {event.description}
                  </p>

                  {/* Step number */}
                  <div className="absolute top-4 right-4 font-game text-yellow-400/15 text-4xl md:text-5xl select-none">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;

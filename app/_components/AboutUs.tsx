"use client";

import React, { useEffect, useState } from "react";

// Competition data
const competitions = [
  {
    name: "UI/UX Design",
    date: new Date("2026-06-15T09:00:00"),
    icon: "🎨",
  },
  {
    name: "Web Development",
    date: new Date("2026-06-20T09:00:00"),
    icon: "🌐",
  },
];

function getTimeLeft(target: Date) {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownTimer({ targetDate, name, icon }: { targetDate: Date; name: string; icon: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HRS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEC", value: timeLeft.seconds },
  ];

  return (
    <div className="border-2 border-yellow-400/30 bg-[#141728] p-5 md:p-6 rounded-sm relative overflow-hidden">
      {/* Pixel corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400" />
      <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-yellow-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400" />

      {/* Competition name */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-game text-yellow-400 text-xl md:text-2xl tracking-wide">
          {name}
        </h4>
      </div>

      {/* Timer boxes */}
      <div className="flex gap-2 md:gap-3">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center flex-1">
            <div className="w-full bg-[#1c2040] border border-yellow-400/20 rounded-sm py-3 px-1 flex items-center justify-center">
              <span className="font-game text-white text-2xl md:text-4xl tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="font-game text-white/50 text-xs md:text-sm mt-1.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutUs() {
  return (
    <section
      id="about"
      className="w-full py-16 md:py-24 px-6 md:px-12 lg:px-24"
      style={{ backgroundColor: "#0c0e17" }}
    >
      {/* Section Title */}
      <div className="text-center mb-12 md:mb-16">
        <h2
          className="font-game text-yellow-400 text-4xl md:text-5xl tracking-wide inline-block relative"
          style={{
            textShadow:
              "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
          }}
        >
          {"< About Us />"}
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
                opacity: i === 0 || i === 6 ? 0.3 : i === 1 || i === 5 ? 0.5 : i === 2 || i === 4 ? 0.7 : 1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Left - About HIMATIC */}
        <div className="flex flex-col gap-6">
          <div className="border-l-4 border-yellow-400 pl-4">
            <h3
              className="font-game text-white text-2xl md:text-3xl mb-4"
              style={{
                textShadow: "1px 1px 0 #000",
              }}
            >
              Apa itu HIMATIC?
            </h3>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-sans">
              <span className="text-yellow-400 font-semibold">HIMATIC</span> adalah
              Himpunan Mahasiswa Teknik Informatika yang menjadi wadah pengembangan
              potensi mahasiswa di bidang teknologi informasi. Kami berkomitmen untuk
              menciptakan lingkungan belajar yang inovatif dan kolaboratif.
            </p>
          </div>

          {/* Competition list */}
          <div className="border-l-4 border-yellow-400 pl-4">
            <h3
              className="font-game text-white text-2xl md:text-3xl mb-4"
              style={{
                textShadow: "1px 1px 0 #000",
              }}
            >
              Lomba Kami
            </h3>
            <div className="flex flex-col gap-3">
              {competitions.map((comp) => (
                <div
                  key={comp.name}
                  className="flex items-center gap-3 bg-[#141728] border border-yellow-400/20 px-4 py-3 rounded-sm group hover:border-yellow-400/50 transition-colors duration-200"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {comp.icon}
                  </span>
                  <div>
                    <p className="font-game text-white text-lg">{comp.name}</p>
                    <p className="text-white/40 text-xs font-sans">
                      {comp.date.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {/* Pixel arrow */}
                  <span className="ml-auto font-game text-yellow-400/50 group-hover:text-yellow-400 transition-colors duration-200 text-xl">
                    {">"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Countdown Timers */}
        <div className="flex flex-col gap-6">
          <h3
            className="font-game text-white text-2xl md:text-3xl"
            style={{
              textShadow: "1px 1px 0 #000",
            }}
          >
            ⏳ Countdown
          </h3>
          {competitions.map((comp) => (
            <CountdownTimer
              key={comp.name}
              targetDate={comp.date}
              name={comp.name}
              icon={comp.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;

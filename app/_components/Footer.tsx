import React from "react";
import Link from "next/link";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Timeline", href: "#timeline" },
  { label: "Guidebook", href: "#guidebook" },
  { label: "FAQ", href: "#faq" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/", icon: "📸" },
  { label: "Discord", href: "https://discord.gg/", icon: "🎮" },
  { label: "YouTube", href: "https://youtube.com/", icon: "📺" },
];

function Footer() {
  return (
    <footer
      className="w-full border-t border-yellow-400/10"
      style={{ backgroundColor: "#080a11" }}
    >
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <span
                className="font-game text-yellow-400 text-3xl tracking-wide select-none"
                style={{
                  textShadow:
                    "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
                }}
              >
                HIMATIC
              </span>
            </Link>
            <p className="text-white/40 text-sm font-sans leading-relaxed max-w-xs">
              Himpunan Mahasiswa Teknik Informatika. Wadah pengembangan potensi
              mahasiswa di bidang teknologi informasi.
            </p>
            {/* Pixel decoration */}
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-yellow-400"
                  style={{ opacity: 0.2 + i * 0.15 }}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h4
              className="font-game text-white text-xl"
              style={{ textShadow: "1px 1px 0 #000" }}
            >
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-game text-white/50 text-base hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="text-yellow-400/30 group-hover:text-yellow-400 transition-colors duration-200 text-xs">
                      {"▶"}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4">
            <h4
              className="font-game text-white text-xl"
              style={{ textShadow: "1px 1px 0 #000" }}
            >
              Connect
            </h4>
            <ul className="flex flex-col gap-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-game text-white/50 text-base hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2.5 group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {link.icon}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-yellow-400/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs font-sans text-center md:text-left">
            © {new Date().getFullYear()} HIMATIC. All rights reserved.
          </p>
          <p className="font-game text-white/20 text-sm select-none">
            {"<"} Made with ❤️ {"/>"}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

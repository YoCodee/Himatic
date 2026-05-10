"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Timeline", href: "#timeline" },
  { label: "Guidebook", href: "#guidebook" },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const ctaHref = isLoggedIn ? (isAdmin ? "/admin" : "/dashboard") : "/sign-up";
  const ctaLabel = isLoggedIn ? (isAdmin ? "Admin" : "Dashboard") : "Daftar";

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="mx-auto flex items-center justify-between px-6 md:px-12 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-yellow-400 font-game text-3xl md:text-4xl tracking-wide select-none"
            style={{
              textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
            }}
          >
            HIMATIC
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-game text-xl text-white/80 hover:text-yellow-400 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href={ctaHref}>
            <Button variant="pixel" className="font-game text-xl">
              {ctaLabel}
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-white/10 ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-4 py-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-game text-2xl text-white/80 hover:text-yellow-400 transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href={ctaHref} onClick={() => setMobileOpen(false)}>
              <Button variant="pixel" className="font-game text-xl">
                {ctaLabel}
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
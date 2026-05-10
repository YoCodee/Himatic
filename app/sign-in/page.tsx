"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        setLoading(false);
        return;
      }

      // Fetch session to check role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0c0e17" }}
    >
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-game text-white/40 text-sm hover:text-yellow-400 transition-colors duration-200 mb-8"
        >
          <span>←</span> Kembali
        </Link>

        {/* Card */}
        <div className="border-2 border-yellow-400/30 bg-[#141728] p-6 md:p-8 rounded-sm relative">
          {/* Pixel corners */}
          <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-400" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-yellow-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-400" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🕹️</div>
            <h1
              className="font-game text-yellow-400 text-2xl md:text-3xl"
              style={{
                textShadow:
                  "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
              }}
            >
              Masuk
            </h1>
            <p className="text-white/40 text-sm font-sans mt-2">
              Login ke akun HIMATIC kamu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-game text-white/70 text-sm">
                Email <span className="text-yellow-400">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="email@contoh.com"
                className="w-full bg-[#1c2040] border border-yellow-400/20 rounded-sm px-4 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:border-yellow-400/60 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-game text-white/70 text-sm">
                Password <span className="text-yellow-400">*</span>
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Masukkan password"
                className="w-full bg-[#1c2040] border border-yellow-400/20 rounded-sm px-4 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:border-yellow-400/60 transition-colors duration-200"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-400/10 border border-red-400/30 rounded-sm px-4 py-2.5">
                <p className="text-red-400 text-sm font-game">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-game text-lg text-black bg-yellow-400 border-2 border-black shadow-[2px_2px_0_0_#000] py-2.5 mt-2 hover:brightness-110 active:shadow-[0_0_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Loading..." : "▶ Masuk"}
            </button>
          </form>

          {/* Register link */}
          <div className="text-center mt-6 border-t border-yellow-400/10 pt-5">
            <p className="text-white/40 text-sm font-sans">
              Belum punya akun?{" "}
              <Link
                href="/sign-up"
                className="font-game text-yellow-400 hover:underline"
              >
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

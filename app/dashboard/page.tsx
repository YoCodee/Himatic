"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

type MemberData = {
  name: string;
  email: string;
  phone: string;
  university: string;
};

const emptyMember: MemberData = {
  name: "",
  email: "",
  phone: "",
  university: "",
};

const competitions = [
  { id: "uiux", label: "UI/UX Design Competition", icon: "🎨", maxMembers: 2 },
  {
    id: "webdev",
    label: "Web Development Competition",
    icon: "🌐",
    maxMembers: 3,
  },
];

/* ─── Reusable Components ─── */

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/50 text-xs font-medium tracking-wide uppercase">
        {label} {required && <span className="text-yellow-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10 transition-all duration-200"
      />
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="font-game text-yellow-400 text-lg flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      {subtitle && (
        <p className="text-white/30 text-xs font-sans mt-1 ml-7">{subtitle}</p>
      )}
    </div>
  );
}

function MemberForm({
  title,
  member,
  onChange,
  onRemove,
}: {
  title: string;
  member: MemberData;
  onChange: (data: MemberData) => void;
  onRemove?: () => void;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-game text-yellow-400 text-lg">{title}</h4>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-500 text-xs font-medium transition-colors cursor-pointer"
          >
            ✕ Hapus
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <InputField
          label="Nama Lengkap"
          value={member.name}
          onChange={(val) => onChange({ ...member, name: val })}
          placeholder="John Doe"
        />
        <InputField
          label="Email"
          type="email"
          value={member.email}
          onChange={(val) => onChange({ ...member, email: val })}
          placeholder="john@email.com"
        />
        <InputField
          label="No. Telepon"
          type="tel"
          value={member.phone}
          onChange={(val) => onChange({ ...member, phone: val })}
          placeholder="08xxxxxxxxxx"
        />
        <InputField
          label="Asal Universitas"
          value={member.university}
          onChange={(val) => onChange({ ...member, university: val })}
          placeholder="Universitas ..."
        />
      </div>
    </Card>
  );
}

/* ─── Image Preview Upload ─── */

function FileUploadWithPreview({
  file,
  fileName,
  existingUrl,
  onFileChange,
  onClearExisting,
}: {
  file: File | null;
  fileName: string;
  existingUrl?: string | null;
  onFileChange: (file: File | null, name: string) => void;
  onClearExisting?: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreview(null);
      }
    } else if (existingUrl) {
      if (existingUrl.toLowerCase().endsWith(".pdf")) {
        setPreview(null);
      } else {
        setPreview(existingUrl);
      }
    } else {
      setPreview(null);
    }
  }, [file, existingUrl]);

  const handleFile = (f: File | null) => {
    onFileChange(f, f?.name || "");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] || null;
    if (f) handleFile(f);
  };

  const handleRemove = () => {
    onFileChange(null, "");
    if (existingUrl && onClearExisting) onClearExisting();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-yellow-400 bg-yellow-400/10"
            : (file || existingUrl)
              ? "border-green-400/30 bg-green-400/5"
              : "border-white/15 bg-white/5 hover:border-yellow-400/30 hover:bg-yellow-400/5"
        }`}
      >
        {(!file && !existingUrl) ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center text-xl">
              📎
            </div>
            <p className="text-white/50 text-sm font-medium">
              Klik atau drag file ke sini
            </p>
            <p className="text-white/20 text-xs">JPG, PNG, PDF — maks. 5MB</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center text-lg shrink-0">
              ✅
            </div>
            <div className="text-left min-w-0">
              <p className="text-white/80 text-sm font-medium truncate">
                {file ? fileName : (existingUrl?.split('/').pop() || 'Bukti Pembayaran')}
              </p>
              {file && (
                <p className="text-white/30 text-xs">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="mt-4 relative group">
          <p className="text-white/40 text-xs font-medium mb-2 uppercase tracking-wide">
            Preview
          </p>
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20">
            <Image
              src={preview}
              alt="Preview bukti pembayaran"
              width={600}
              height={400}
              className="w-full h-auto max-h-64 object-contain"
              unoptimized
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-lg hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* PDF indicator (no preview) */}
      {((file && !preview) || (existingUrl && existingUrl.toLowerCase().endsWith(".pdf"))) && (
        <div className="mt-3 flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            <span className="text-white/60 text-sm">
              {file ? fileName : (existingUrl?.split('/').pop() || 'Bukti Pembayaran.pdf')}
            </span>
          </div>
          <div className="flex gap-3">
            {!file && existingUrl && (
              <a
                href={existingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-500 text-xs font-medium cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Lihat PDF
              </a>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="text-red-400 hover:text-red-500 text-xs font-medium cursor-pointer"
            >
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard Page ─── */

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [competition, setCompetition] = useState("");
  const [teamName, setTeamName] = useState("");
  const [leader, setLeader] = useState<MemberData>({ ...emptyMember });
  const [members, setMembers] = useState<MemberData[]>([]);
  const [githubLink, setGithubLink] = useState("");
  const [figmaLink, setFigmaLink] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [existingTeam, setExistingTeam] = useState<{ id: number; status: string } | null>(null);
  const [adminMessages, setAdminMessages] = useState<{ message: string; admin: { username: string }; createdAt: string; isRead: boolean }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selectedComp = competitions.find((c) => c.id === competition);
  const maxExtraMembers = selectedComp ? selectedComp.maxMembers - 1 : 0;

  const user = session?.user ? { username: session.user.name || "", email: session.user.email || "" } : null;
  const loading = status === "loading";

  // Fetch existing team data on mount
  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/teams");
        const data = await res.json();
        if (data.team) {
          const t = data.team;
          setExistingTeam({ id: t.id, status: t.status });
          setCompetition(t.competition);
          setTeamName(t.teamName);
          setGithubLink(t.githubLink || "");
          setFigmaLink(t.figmaLink || "");
          setDriveLink(t.driveLink || "");
          setPaymentProofUrl(t.paymentProofUrl || null);
          const leaderData = t.members.find((m: { isLeader: boolean }) => m.isLeader);
          if (leaderData) setLeader({ name: leaderData.name, email: leaderData.email, phone: leaderData.phone, university: leaderData.university });
          const extraMembers = t.members.filter((m: { isLeader: boolean }) => !m.isLeader).map((m: { name: string; email: string; phone: string; university: string }) => ({ name: m.name, email: m.email, phone: m.phone, university: m.university }));
          setMembers(extraMembers);
          if (t.messages && t.messages.length > 0) setAdminMessages(t.messages);
          if (t.status === "VERIFIED") setSubmitted(true);
        } else {
          // Pre-fill leader with session data
          setLeader((prev) => ({ ...prev, email: session.user?.email || "", name: session.user?.name || "" }));
        }
      } catch (err) {
        console.error("Error fetching team:", err);
        setLeader((prev) => ({ ...prev, email: session.user?.email || "", name: session.user?.name || "" }));
      }
    };
    fetchTeam();
  }, [status, session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleCompetitionChange = (compId: string) => {
    const comp = competitions.find((c) => c.id === compId);
    setCompetition(compId);
    setMembers((prev) => prev.slice(0, comp ? comp.maxMembers - 1 : 0));
  };

  const handleAddMember = () => {
    if (members.length < maxExtraMembers)
      setMembers([...members, { ...emptyMember }]);
  };

  const handleRemoveMember = (i: number) =>
    setMembers(members.filter((_, idx) => idx !== i));

  const handleMemberChange = (i: number, data: MemberData) => {
    const updated = [...members];
    updated[i] = data;
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        competition,
        teamName,
        leader,
        members,
        githubLink,
        figmaLink,
        driveLink,
      };

      let res;
      if (existingTeam) {
        // Update existing team
        res = await fetch(`/api/teams/${existingTeam.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new team
        res = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Gagal mengirim pendaftaran");
        setSubmitting(false);
        return;
      }

      // Upload payment proof if exists
      if (paymentProof && data.team?.id) {
        const formData = new FormData();
        formData.append("file", paymentProof);
        await fetch(`/api/teams/${data.team.id}/upload`, {
          method: "POST",
          body: formData,
        });
      }

      const resTeam = await fetch("/api/teams");
      const dataTeam = await resTeam.json();
      if (dataTeam.team) {
        setPaymentProofUrl(dataTeam.team.paymentProofUrl || null);
      }

      setExistingTeam({ id: data.team.id, status: data.team.status });
      setSubmitted(true);
    } catch {
      setSubmitError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0c0e17" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-game text-yellow-400/60 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* Success */
  if (submitted) {
    const statusLabel =
      existingTeam?.status === "VERIFIED" ? "✅ Terverifikasi" :
      existingTeam?.status === "REVISION" ? "🔄 Perlu Revisi" :
      "⏳ Menunggu Verifikasi";

    const canEdit = existingTeam?.status !== "VERIFIED";

    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0c0e17" }}>
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-400/10 rounded-full flex items-center justify-center text-4xl">
            {existingTeam?.status === "VERIFIED" ? "🏆" : existingTeam?.status === "REVISION" ? "📝" : "⏳"}
          </div>
          <h2 className="font-game text-yellow-400 text-3xl md:text-4xl mb-3">
            {existingTeam?.status === "VERIFIED" ? "Pendaftaran Terverifikasi!" : "Pendaftaran Terkirim!"}
          </h2>
          <p className="text-white/50 font-sans text-sm mb-2">
            Terima kasih telah mendaftar{" "}
            <span className="text-yellow-400 font-semibold">
              {selectedComp?.label}
            </span>
          </p>
          <p className="font-game text-lg mb-6">{statusLabel}</p>

          {/* Admin Messages */}
          {adminMessages.length > 0 && (
            <div className="text-left mb-6 space-y-3">
              <p className="font-game text-yellow-400 text-sm">📩 Pesan dari Admin:</p>
              {adminMessages.map((msg, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-white/70 text-sm">{msg.message}</p>
                  <p className="text-white/25 text-xs mt-2">— {msg.admin.username} • {new Date(msg.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            {canEdit && (
              <button
                onClick={() => setSubmitted(false)}
                className="font-game text-lg text-black bg-yellow-400 hover:bg-yellow-300 px-8 py-3 rounded-xl transition-colors duration-200 cursor-pointer shadow-lg shadow-yellow-400/20"
              >
                ✏️ Edit Pendaftaran
              </button>
            )}
            <Link href="/">
              <button className="font-game text-lg text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-8 py-3 rounded-xl transition-colors duration-200 cursor-pointer">
                ← Kembali ke Beranda
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Dashboard ── */
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/Dashboard/6dc2ad3da1445ed8adca5e83b6dd6f7b.jpg"
          alt="background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

     

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-50 bg-[#0c0e17]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-yellow-400 font-game text-2xl md:text-3xl tracking-wide select-none group-hover:text-yellow-300 transition-colors">
                HIMATIC
              </span>
            </Link>
            <div className="hidden sm:block w-px h-5 bg-white/15" />
            <span className="hidden sm:block text-white/30 text-sm font-medium">
              Dashboard
            </span>
          </div>

          {/* Steps */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">✓</span>
              </div>
              <span className="text-white/30 text-xs font-medium">
                Buat Akun
              </span>
            </div>
            <div className="w-8 h-px bg-white/15" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">2</span>
              </div>
              <span className="text-yellow-400 text-xs font-semibold">
                Daftar Lomba
              </span>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5">
          
              <span className="text-white/60 text-sm font-medium">
                {user.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/30 hover:text-red-400 text-sm font-medium transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-red-400/10"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <form onSubmit={handleSubmit} noValidate className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10">
          {/* Page Title */}
          <div className="mb-8">
            {existingTeam?.status === "VERIFIED" || submitted || (existingTeam && existingTeam.status !== "DRAFT") ? (
              <div className="mb-6 bg-green-400/10 border border-green-400/30 rounded-xl px-5 py-4">
                <p className="text-green-400 text-sm font-game text-center">
                  Selamat kamu sudah mengirim semua pengirimanberkas .. tunggu pengumumannya
                </p>
              </div>
            ) : null}
            <h1 className="font-game text-yellow-400 text-3xl md:text-4xl tracking-wide">
              {"< Pendaftaran Lomba />"}
            </h1>
            <div className="flex items-center gap-1.5 mt-3">
              {[0.15, 0.4, 1, 0.4, 0.15].map((op, i) => (
                <div
                  key={i}
                  className="bg-yellow-400 rounded-full"
                  style={{
                    width: i === 2 ? "20px" : "6px",
                    height: "3px",
                    opacity: op,
                  }}
                />
              ))}
            </div>
            <p className="text-white/30 text-sm mt-2">
              Lengkapi data di bawah untuk mendaftarkan tim kamu.
            </p>
          </div>

          {/* Competition */}
          <div className="mb-8">
            <Card>
              <SectionLabel
                icon="🏆"
                title="Pilih Lomba"
                subtitle="Pilih salah satu kategori kompetisi"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {competitions.map((comp) => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => handleCompetitionChange(comp.id)}
                    className={`border-2 rounded-xl px-5 py-4 text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                      competition === comp.id
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                        : "border-white/10 bg-white/5 text-white/40 hover:border-yellow-400/20 hover:bg-yellow-400/5"
                    }`}
                  >
                    {competition === comp.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-black text-[10px] font-bold">
                          ✓
                        </span>
                      </div>
                    )}
                    <span className="text-2xl mr-2">{comp.icon}</span>
                    <span className="text-sm font-semibold">{comp.label}</span>
                    <span className="block text-xs text-white/25 mt-1 ml-8">
                      Maks. {comp.maxMembers} orang
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Team Name */}
          <div className="mb-8">
            <Card>
              <SectionLabel icon="🏷️" title="Nama Tim" />
              <InputField
                label="Nama Tim"
                value={teamName}
                onChange={setTeamName}
                placeholder="Masukkan nama tim kamu"
              />
            </Card>
          </div>

          {/* ═══ TWO-COLUMN ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Members */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-yellow-400 rounded-full" />
                <h2 className="font-game text-white/80 text-xl">
                  Data Anggota
                </h2>
              </div>

              <MemberForm
                title="👑 Ketua Tim"
                member={leader}
                onChange={setLeader}
              />

              {members.map((member, i) => (
                <MemberForm
                  key={i}
                  title={`👤 Anggota ${i + 1}`}
                  member={member}
                  onChange={(data) => handleMemberChange(i, data)}
                  onRemove={() => handleRemoveMember(i)}
                />
              ))}

              {competition && members.length < maxExtraMembers && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="border-2 border-dashed border-white/10 rounded-xl py-4 text-white/25 text-sm font-medium hover:border-yellow-400/30 hover:text-yellow-400/60 hover:bg-yellow-400/5 transition-all duration-200 cursor-pointer"
                >
                  + Tambah Anggota
                </button>
              )}
            </div>

            {/* RIGHT: Source Code & Others */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-yellow-400 rounded-full" />
                <h2 className="font-game text-white/80 text-xl">
                  Submission & Lainnya
                </h2>
              </div>

              <Card>
                <SectionLabel
                  icon="💻"
                  title="Source Code"
                  subtitle="Link repository GitHub project kamu"
                />
                <InputField
                  label="Link GitHub"
                  type="url"
                  value={githubLink}
                  onChange={setGithubLink}
                  placeholder="https://github.com/username/repo"
                  required={false}
                />
              </Card>

              <Card>
                <SectionLabel
                  icon="🎨"
                  title="Figma Design"
                  subtitle="Link file Figma prototype (untuk UI/UX)"
                />
                <InputField
                  label="Link Figma"
                  type="url"
                  value={figmaLink}
                  onChange={setFigmaLink}
                  placeholder="https://www.figma.com/file/..."
                  required={false}
                />
              </Card>

              <Card>
                <SectionLabel
                  icon="📁"
                  title="Google Drive"
                  subtitle="Link folder berisi dokumen pendukung"
                />
                <InputField
                  label="Link Google Drive"
                  type="url"
                  value={driveLink}
                  onChange={setDriveLink}
                  placeholder="https://drive.google.com/drive/folders/..."
                  required={false}
                />
              </Card>

              <Card>
                <SectionLabel
                  icon="💳"
                  title="Bukti Pembayaran"
                  subtitle="Upload bukti transfer (JPG, PNG, PDF)"
                />
                <FileUploadWithPreview
                  file={paymentProof}
                  fileName={fileName}
                  existingUrl={paymentProofUrl}
                  onFileChange={(f, n) => {
                    setPaymentProof(f);
                    setFileName(n);
                  }}
                  onClearExisting={() => setPaymentProofUrl(null)}
                />
              </Card>
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="mt-6 bg-red-400/10 border border-red-400/30 rounded-xl px-5 py-4">
              <p className="text-red-400 text-sm font-game">{submitError}</p>
            </div>
          )}

          {/* Admin Messages in form view */}
          {adminMessages.length > 0 && !submitted && (
            <div className="mt-6 space-y-3">
              <p className="font-game text-yellow-400 text-sm">📩 Pesan dari Admin:</p>
              {adminMessages.map((msg, i) => (
                <div key={i} className="bg-red-400/5 border border-red-400/20 rounded-lg p-4">
                  <p className="text-white/70 text-sm">{msg.message}</p>
                  <p className="text-white/25 text-xs mt-2">— {msg.admin.username}</p>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={!competition || !teamName || !leader.name || submitting}
              className="w-full font-game text-xl text-black bg-yellow-400 hover:bg-yellow-300 py-4 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-yellow-400/20 hover:shadow-xl hover:shadow-yellow-400/30 active:scale-[0.99]"
            >
              {submitting ? "Mengirim..." : existingTeam ? "▶ Update Pendaftaran" : "▶ Kirim Pendaftaran"}
            </button>
            <p className="text-center text-white/20 text-xs font-sans mt-3">
              Pastikan semua data sudah benar sebelum mengirim.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

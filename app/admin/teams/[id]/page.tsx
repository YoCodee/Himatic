"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type Member = {
  id: number;
  name: string;
  email: string;
  phone: string;
  university: string;
  isLeader: boolean;
};

type Message = {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  admin: { username: string };
};

type TeamDetail = {
  id: number;
  teamName: string;
  competition: string;
  githubLink: string | null;
  figmaLink: string | null;
  driveLink: string | null;
  paymentProofUrl: string | null;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  user: { username: string; email: string };
  members: Member[];
  messages: Message[];
};

export default function AdminTeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const teamId = params.id as string;

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      const data = await res.json();
      setTeam(data.team);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true);
    try {
      await fetch(`/api/admin/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchTeam();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await fetch(`/api/admin/teams/${teamId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      setNewMessage("");
      await fetchTeam();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return <p className="text-white/30 text-center py-20 font-game">Tim tidak ditemukan</p>;
  }

  const statusColor =
    team.status === "VERIFIED" ? "text-green-400 bg-green-400/10 border-green-400/20" :
    team.status === "SUBMITTED" ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
    team.status === "REVISION" ? "text-red-400 bg-red-400/10 border-red-400/20" :
    "text-white/40 bg-white/5 border-white/10";

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => router.push("/admin/teams")}
        className="text-white/30 hover:text-yellow-400 text-sm font-game mb-6 cursor-pointer transition-colors"
      >
        ← Kembali ke daftar tim
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-game text-yellow-400 text-3xl">{team.teamName}</h1>
          <p className="text-white/30 text-sm mt-1">
            {team.competition === "uiux" ? "🎨 UI/UX Design Competition" : "🌐 Web Development Competition"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColor}`}>
            {team.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Team Info */}
        <div className="space-y-5">
          {/* Members */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-game text-yellow-400 text-lg mb-4">👥 Anggota Tim</h3>
            <div className="space-y-3">
              {team.members.map((m) => (
                <div key={m.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{m.isLeader ? "👑" : "👤"}</span>
                    <span className="text-white/80 text-sm font-medium">{m.name}</span>
                    {m.isLeader && <span className="text-yellow-400 text-xs">(Ketua)</span>}
                  </div>
                  <div className="text-white/30 text-xs space-y-0.5 ml-6">
                    <p>📧 {m.email}</p>
                    <p>📱 {m.phone}</p>
                    <p>🏫 {m.university}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-game text-yellow-400 text-lg mb-4">🔗 Submission Links</h3>
            <div className="space-y-3">
              {[
                { label: "GitHub", url: team.githubLink, icon: "💻" },
                { label: "Figma", url: team.figmaLink, icon: "🎨" },
                { label: "Google Drive", url: team.driveLink, icon: "📁" },
              ].map((link) => (
                <div key={link.label} className="flex items-center gap-3">
                  <span>{link.icon}</span>
                  {link.url ? (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 text-sm underline transition-colors truncate">
                      {link.url}
                    </a>
                  ) : (
                    <span className="text-white/20 text-sm italic">Belum diisi</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Proof */}
          {team.paymentProofUrl && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-game text-yellow-400 text-lg mb-4">💳 Bukti Pembayaran</h3>
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={team.paymentProofUrl}
                  alt="Bukti pembayaran"
                  width={600}
                  height={400}
                  className="w-full h-auto max-h-64 object-contain bg-black/20"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions & Messages */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-game text-yellow-400 text-lg mb-4">⚡ Aksi</h3>
            <div className="flex flex-wrap gap-3">
              {team.status !== "VERIFIED" && (
                <button
                  onClick={() => handleStatusChange("VERIFIED")}
                  disabled={actionLoading}
                  className="bg-green-400/10 text-green-400 border border-green-400/20 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-400/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  ✅ Verifikasi
                </button>
              )}
              {team.status !== "REVISION" && (
                <button
                  onClick={() => handleStatusChange("REVISION")}
                  disabled={actionLoading}
                  className="bg-red-400/10 text-red-400 border border-red-400/20 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-400/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  🔄 Minta Revisi
                </button>
              )}
            </div>
          </div>

          {/* Send Message */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-game text-yellow-400 text-lg mb-4">📩 Kirim Pesan</h3>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tulis pesan untuk peserta... (contoh: Bukti pembayaran kurang jelas, mohon upload ulang)"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 resize-none"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="bg-yellow-400 text-black font-game px-6 py-2.5 rounded-lg text-sm hover:bg-yellow-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                {sending ? "Mengirim..." : "Kirim Pesan"}
              </button>
              <p className="text-white/20 text-xs">⚠️ Mengirim pesan akan otomatis mengubah status ke REVISION</p>
            </form>
          </div>

          {/* Message History */}
          {team.messages.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-game text-yellow-400 text-lg mb-4">📜 Riwayat Pesan</h3>
              <div className="space-y-3">
                {team.messages.map((msg) => (
                  <div key={msg.id} className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/70 text-sm">{msg.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-white/25 text-xs">— {msg.admin.username}</p>
                      <p className="text-white/15 text-xs">{new Date(msg.createdAt).toLocaleDateString("id-ID")}</p>
                      {msg.isRead && <span className="text-green-400/50 text-xs">✓ Dibaca</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

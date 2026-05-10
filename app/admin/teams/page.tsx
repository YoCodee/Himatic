"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Team = {
  id: number;
  teamName: string;
  competition: string;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  user: { username: string; email: string };
  members: { name: string; isLeader: boolean }[];
  _count: { messages: number };
};

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ competition: "", status: "" });

  useEffect(() => {
    const fetchTeams = async () => {
      const params = new URLSearchParams();
      if (filter.competition) params.set("competition", filter.competition);
      if (filter.status) params.set("status", filter.status);

      try {
        const res = await fetch(`/api/admin/teams?${params.toString()}`);
        const data = await res.json();
        setTeams(data.teams || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [filter]);

  const statusColor = (status: string) => {
    switch (status) {
      case "VERIFIED": return "text-green-400 bg-green-400/10";
      case "SUBMITTED": return "text-blue-400 bg-blue-400/10";
      case "REVISION": return "text-red-400 bg-red-400/10";
      default: return "text-white/40 bg-white/5";
    }
  };

  return (
    <div>
      <h1 className="font-game text-yellow-400 text-3xl mb-6">👥 Tim Peserta</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filter.competition}
          onChange={(e) => { setLoading(true); setFilter({ ...filter, competition: e.target.value }); }}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50 cursor-pointer"
        >
          <option value="">Semua Lomba</option>
          <option value="uiux">UI/UX Design</option>
          <option value="webdev">Web Development</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => { setLoading(true); setFilter({ ...filter, status: e.target.value }); }}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50 cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="VERIFIED">Verified</option>
          <option value="REVISION">Revision</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/30 text-lg font-game">Belum ada tim terdaftar</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/30 text-xs font-medium uppercase px-5 py-3">Tim</th>
                <th className="text-left text-white/30 text-xs font-medium uppercase px-5 py-3">Lomba</th>
                <th className="text-left text-white/30 text-xs font-medium uppercase px-5 py-3">Ketua</th>
                <th className="text-left text-white/30 text-xs font-medium uppercase px-5 py-3">Status</th>
                <th className="text-left text-white/30 text-xs font-medium uppercase px-5 py-3">Anggota</th>
                <th className="text-left text-white/30 text-xs font-medium uppercase px-5 py-3">Tanggal</th>
                <th className="text-right text-white/30 text-xs font-medium uppercase px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => {
                const leader = team.members.find((m) => m.isLeader);
                return (
                  <tr key={team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white/80 text-sm font-medium">{team.teamName}</p>
                      <p className="text-white/25 text-xs">{team.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white/50 text-sm">
                        {team.competition === "uiux" ? "🎨 UI/UX" : "🌐 WebDev"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/60 text-sm">{leader?.name || "-"}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(team.status)}`}>
                        {team.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/40 text-sm">{team.members.length}</td>
                    <td className="px-5 py-4 text-white/30 text-xs">
                      {team.submittedAt ? new Date(team.submittedAt).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/teams/${team.id}`}
                        className="text-yellow-400 hover:text-yellow-300 text-xs font-medium transition-colors"
                      >
                        Detail →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

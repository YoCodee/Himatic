"use client";

import { useEffect, useState } from "react";

type Stats = {
  total: number;
  submitted: number;
  verified: number;
  revision: number;
  draft: number;
  uiux: number;
  webdev: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/teams");
        const data = await res.json();
        setStats(data.stats);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Tim", value: stats?.total || 0, icon: "👥", color: "yellow" },
    { label: "Submitted", value: stats?.submitted || 0, icon: "📤", color: "blue" },
    { label: "Verified", value: stats?.verified || 0, icon: "✅", color: "green" },
    { label: "Perlu Revisi", value: stats?.revision || 0, icon: "🔄", color: "red" },
    { label: "UI/UX", value: stats?.uiux || 0, icon: "🎨", color: "purple" },
    { label: "Web Dev", value: stats?.webdev || 0, icon: "🌐", color: "cyan" },
  ];

  return (
    <div>
      <h1 className="font-game text-yellow-400 text-3xl mb-8">📊 Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:bg-white/8 transition-colors"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="font-game text-yellow-400 text-2xl">{card.value}</div>
            <div className="text-white/30 text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

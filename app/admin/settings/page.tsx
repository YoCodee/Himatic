"use client";

import { useEffect, useState } from "react";

type Setting = {
  id: number;
  competitionId: string;
  label: string;
  maxMembers: number;
  deadline: string;
  isOpen: boolean;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettings(data.settings || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (competitionId: string, field: string, value: unknown) => {
    setSaving(competitionId);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitionId, [field]: value }),
      });
      // Refresh
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data.settings || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-game text-yellow-400 text-3xl mb-8">⚙️ Pengaturan Lomba</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((s) => (
          <div key={s.competitionId} className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-game text-yellow-400 text-lg">
                  {s.competitionId === "uiux" ? "🎨" : "🌐"} {s.label}
                </h3>
                <p className="text-white/25 text-xs mt-1">Maks. {s.maxMembers} anggota</p>
              </div>
              <button
                onClick={() => handleUpdate(s.competitionId, "isOpen", !s.isOpen)}
                disabled={saving === s.competitionId}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer disabled:opacity-50 ${
                  s.isOpen
                    ? "bg-green-400/10 text-green-400 border-green-400/20 hover:bg-green-400/20"
                    : "bg-red-400/10 text-red-400 border-red-400/20 hover:bg-red-400/20"
                }`}
              >
                {s.isOpen ? "✅ Terbuka" : "🚫 Ditutup"}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-white/40 text-xs uppercase font-medium">Deadline</label>
                <input
                  type="datetime-local"
                  value={s.deadline ? new Date(s.deadline).toISOString().slice(0, 16) : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleUpdate(s.competitionId, "deadline", new Date(e.target.value).toISOString());
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm mt-1 focus:outline-none focus:border-yellow-400/50"
                />
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/25 text-xs">
                  Status: {s.isOpen ? "Pendaftaran terbuka" : "Pendaftaran ditutup"} • 
                  Deadline: {new Date(s.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

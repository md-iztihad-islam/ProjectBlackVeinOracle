import getAllRankApi from "@/services/Rank/getAllRankApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const BASE = "/admin/dashboard/rankdashboard";

const quickLinks = [
  {
    label: "Add Rank",
    to: `${BASE}/add-rank`,
    textColor: "text-cyan-400",
    border: "border-cyan-400/25 hover:border-cyan-400/60 hover:bg-cyan-400/5",
    icon: "＋",
  },
  {
    label: "Rank List",
    to: `${BASE}/rank-list`,
    textColor: "text-lime-400",
    border: "border-lime-400/25 hover:border-lime-400/60 hover:bg-lime-400/5",
    icon: "≡",
  },
  {
    label: "Assign Rank",
    to: `${BASE}/rank-list`,
    textColor: "text-amber-400",
    border: "border-amber-400/25 hover:border-amber-400/60 hover:bg-amber-400/5",
    icon: "⭐",
  },
];

export default function RankAdminDashboard() {
  const navigate = useNavigate();

  const { data: ranksData, isLoading } = useQuery({
    queryKey: ["ranks"],
    queryFn: () => getAllRankApi(),
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const ranks = ranksData?.data || [];

  // ── Derived stats ──
  const totalRanks = ranks.length;
  const maxLevel = ranks.length ? Math.max(...ranks.map((r) => r.level)) : 0;
  const minLevel = ranks.length ? Math.min(...ranks.map((r) => r.level)) : 0;
  const midRanks = ranks.filter((r) => r.level > minLevel && r.level < maxLevel).length;

  const stats = [
    {
      label: "Total Ranks",
      value: isLoading ? "—" : totalRanks,
      delta: isLoading ? "Loading..." : `${totalRanks} rank tiers defined`,
      icon: "🏅",
      topColor: "border-t-cyan-500",
    },
    {
      label: "Highest Level",
      value: isLoading ? "—" : maxLevel,
      delta: isLoading ? "Loading..." : ranks.find((r) => r.level === maxLevel)?.rank_name || "—",
      icon: "⬆️",
      topColor: "border-t-amber-400",
    },
    {
      label: "Lowest Level",
      value: isLoading ? "—" : minLevel,
      delta: isLoading ? "Loading..." : ranks.find((r) => r.level === minLevel)?.rank_name || "—",
      icon: "⬇️",
      topColor: "border-t-violet-400",
    },
    {
      label: "Mid Ranks",
      value: isLoading ? "—" : midRanks,
      delta: isLoading ? "Loading..." : `Between level ${minLevel + 1}–${maxLevel - 1}`,
      icon: "🎖️",
      topColor: "border-t-lime-400",
    },
  ];

  // Sort ranks by level ascending for the hierarchy display
  const sortedRanks = [...ranks].sort((a, b) => a.level - b.level);

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(6,182,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.03) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-[10px] tracking-[0.22em] uppercase text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 inline-block mb-3">
            Control Panel
          </span>
          <h1
            className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Rank <span className="text-cyan-400">Dashboard</span>
          </h1>
          <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
            // Police Rank Management System
          </p>
        </div>
        <button
          onClick={() => navigate(`${BASE}/add-rank`)}
          className="flex items-center gap-2 bg-cyan-400 text-[#080a0e] px-6 py-3 text-sm font-black tracking-widest uppercase hover:bg-cyan-300 hover:-translate-y-0.5 transition-all duration-150"
        >
          + Add Rank
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-cyan-400/30 via-cyan-400/10 to-transparent mb-10" />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`bg-slate-900/60 border border-slate-800 border-t-2 ${s.topColor} p-5 hover:-translate-y-0.5 transition-transform duration-200 cursor-default`}
          >
            <div className="text-2xl mb-4">{s.icon}</div>
            <div
              className={`text-4xl font-black text-white mb-1 leading-none ${isLoading ? "animate-pulse text-slate-700" : ""}`}
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {s.value}
            </div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-slate-600 mb-3">{s.label}</div>
            <div className="border-t border-slate-800 pt-2 text-[11px] text-lime-400 truncate">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* ── Rank Hierarchy ── */}
      {!isLoading && sortedRanks.length > 0 && (
        <>
          <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 mb-3">
            // Rank Hierarchy
          </div>
          <div className="border border-slate-800 mb-12 overflow-hidden">
            {sortedRanks.map((rank, i) => {
              const pct = maxLevel > 0 ? Math.round((rank.level / maxLevel) * 100) : 0;
              return (
                <div
                  key={rank.rank_code}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-900 last:border-0 hover:bg-white/[0.015] transition-colors group"
                >
                  {/* Level badge */}
                  <div
                    className="w-8 h-8 flex items-center justify-center text-[11px] font-black text-slate-500 bg-slate-800 flex-shrink-0"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {rank.level}
                  </div>

                  {/* Rank info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span
                        className="text-white font-bold text-[15px] tracking-wide"
                        style={{ fontFamily: "'Rajdhani', sans-serif" }}
                      >
                        {rank.rank_name}
                      </span>
                      <span className="text-[10px] text-slate-600 bg-slate-800/80 px-2 py-0.5">
                        {rank.rank_code}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Level pct */}
                  <div className="text-[11px] text-slate-600 flex-shrink-0 hidden sm:block">
                    Lvl {rank.level}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => navigate(`${BASE}/rank-list/update-rank/${rank.rank_code}`)}
                      className="border border-slate-700 text-slate-400 px-3 py-1 text-[10px] font-bold tracking-widest uppercase hover:border-cyan-400/40 hover:text-cyan-400 transition-all duration-150"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => navigate(`${BASE}/rank-list/assign-rank/${rank.rank_code}`)}
                      className="border border-slate-700 text-amber-400 px-3 py-1 text-[10px] font-bold tracking-widest uppercase hover:border-amber-400/40 hover:bg-amber-400/5 transition-all duration-150"
                    >
                      ASSIGN
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Quick access ── */}
      <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 mb-3">// Quick Access</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
        {quickLinks.map((link, i) => (
          <button
            key={i}
            onClick={() => navigate(link.to)}
            className={`flex items-center justify-between px-5 py-4 bg-slate-900/60 border ${link.border} transition-all duration-200`}
          >
            <span className={`text-sm font-bold tracking-widest uppercase ${link.textColor}`}>{link.label}</span>
            <span className={`text-lg ${link.textColor}`}>→</span>
          </button>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center gap-3 pt-5 border-t border-slate-800/60">
        <div className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#84cc16] animate-pulse" />
        <span className="text-[11px] text-slate-700 tracking-widest">
          {isLoading ? "LOADING DATA..." : `${totalRanks} RANKS REGISTERED — SYSTEM OPERATIONAL`}
        </span>
      </div>
    </div>
  );
}
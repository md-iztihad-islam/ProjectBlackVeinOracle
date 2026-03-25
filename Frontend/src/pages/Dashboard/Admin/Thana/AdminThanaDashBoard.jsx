import getAllThanaApi from "@/services/Thana/getAllThanaApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const BASE = "/admin/dashboard/thanadashboard";

const quickLinks = [
  {
    label: "Add New Thana",
    to: `${BASE}/add-thana`,
    textColor: "text-cyan-400",
    border: "border-cyan-400/25 hover:border-cyan-400/60 hover:bg-cyan-400/5",
  },
  {
    label: "View All Thanas",
    to: `${BASE}/thana-list`,
    textColor: "text-lime-400",
    border: "border-lime-400/25 hover:border-lime-400/60 hover:bg-lime-400/5",
  }
];

export default function ThanaDashBoard() {
  const navigate = useNavigate();
  const now = new Date();

  const { data: allThanaData, isLoading } = useQuery({
    queryKey: ["allThanas"],
    queryFn: () => getAllThanaApi(),
    staleTime: 5 * 60 * 1000,
  });

  const allThanas = allThanaData?.data || [];

  // ── Derived stats from real data ──
  const totalThanas = allThanas.length;
  const assignedHeads = allThanas.filter((t) => t.head_officer_id).length;
  const unassignedHeads = totalThanas - assignedHeads;
  const uniqueDistricts = [...new Set(allThanas.map((t) => t.district).filter(Boolean))].length;
  const uniqueZones = [...new Set(allThanas.map((t) => t.zone).filter(Boolean))].length;

  const stats = [
    {
      label: "Total Thanas",
      value: isLoading ? "—" : totalThanas,
      delta: isLoading ? "Loading..." : `${uniqueZones} zones registered`,
      icon: "🏛️",
      topColor: "border-t-cyan-500",
    },
    {
      label: "Assigned Heads",
      value: isLoading ? "—" : assignedHeads,
      delta: isLoading ? "Loading..." : `${unassignedHeads} vacancies`,
      icon: "⭐",
      topColor: "border-t-amber-400",
    },
    {
      label: "Unassigned",
      value: isLoading ? "—" : unassignedHeads,
      delta: isLoading ? "Loading..." : `${Math.round((unassignedHeads / (totalThanas || 1)) * 100)}% without a head`,
      icon: "⚠️",
      topColor: "border-t-red-500",
    },
    {
      label: "Districts Covered",
      value: isLoading ? "—" : uniqueDistricts,
      delta: isLoading ? "Loading..." : `Across ${uniqueZones} zones`,
      icon: "📍",
      topColor: "border-t-violet-400",
    },
  ];

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
            Thana <span className="text-cyan-400">Dashboard</span>
          </h1>
          <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
            // Bangladesh Police Administration System
          </p>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 px-4 py-3 text-[11px] text-right leading-relaxed">
          <div className="text-slate-400">
            {now.toLocaleDateString("en-GB", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
          </div>
          <div className="text-slate-600">{now.toLocaleTimeString("en-GB")}</div>
        </div>
      </div>

      {/* ── Accent divider ── */}
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
            <div className="border-t border-slate-800 pt-2 text-[11px] text-lime-400">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* ── District breakdown ── */}
      {!isLoading && allThanas.length > 0 && (
        <>
          <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 mb-3">// District Breakdown</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-12">
            {Object.entries(
              allThanas.reduce((acc, t) => {
                if (t.district) acc[t.district] = (acc[t.district] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .map(([district, count]) => {
                const districtAssigned = allThanas.filter(
                  (t) => t.district === district && t.head_officer_id
                ).length;
                return (
                  <div
                    key={district}
                    className="bg-slate-900/40 border border-slate-800 px-4 py-3 flex items-center justify-between hover:border-slate-700 transition-colors cursor-default"
                  >
                    <div>
                      <div className="text-[12px] text-slate-300 font-medium">{district}</div>
                      <div className="text-[10px] text-slate-700 mt-0.5">
                        {districtAssigned}/{count} headed
                      </div>
                    </div>
                    <div
                      className="text-2xl font-black text-slate-500"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    >
                      {count}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}

      {/* ── Quick access ── */}
      <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 mb-3">// Quick Access</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
        {quickLinks.map((link, i) => (
          <button
            key={i}
            onClick={() => navigate(link.to)}
            className={`flex items-center justify-between px-5 py-4 bg-slate-900/60 border ${link.border} transition-all duration-200 cursor-pointer`}
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
          {isLoading ? "LOADING DATA..." : `${totalThanas} STATIONS REGISTERED — SYSTEM OPERATIONAL`}
        </span>
      </div>
    </div>
  );
}
import getJailOccupancyDetailsApi from "@/services/Analytics/jailOccupancyDetailsApi";
import getJailByIdApi from "@/services/Jail/getJailByIdApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const statusStyle = {
  LOW:      { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", bar: "bg-emerald-400" },
  MODERATE: { cls: "text-amber-400  bg-amber-400/10  border-amber-400/20",     bar: "bg-amber-400"  },
  HIGH:     { cls: "text-orange-400 bg-orange-400/10 border-orange-400/20",    bar: "bg-orange-400" },
  CRITICAL: { cls: "text-red-400    bg-red-400/10    border-red-400/20",       bar: "bg-red-400"    },
};

function OccupancyBar({ pct, status }) {
  const s = statusStyle[status] || statusStyle.LOW;
  return (
    <div className="mt-1.5">
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${s.bar}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}

export default function JailDashboard() {
  const navigate = useNavigate();
  const { user } = userStore();
  const jailId = user?.jail_id;

  const { data: jailData, isLoading: jailDataLoading } = useQuery({
    queryKey: ["jailData", jailId],
    queryFn: () => getJailByIdApi(jailId),
    enabled: !!jailId,
  });

  const jail = jailData?.data || null;

  const { data: jailOccupancyData, isLoading: jailOccupancyLoading } = useQuery({
    queryKey: ["jailOccupancyData", jailId],
    queryFn: () => getJailOccupancyDetailsApi(jailId),
    enabled: !!jailId,
  });

  // API returns array; find this jail's occupancy record
  const occupancyList = Array.isArray(jailOccupancyData?.data)
    ? jailOccupancyData.data
    : jailOccupancyData?.data
    ? [jailOccupancyData.data]
    : [];

  const jailOccupancy = occupancyList.find((o) => o.jail_id === jailId) || occupancyList[0] || null;

  const isLoading = jailDataLoading || jailOccupancyLoading;

  const stats = jail && jailOccupancy
    ? [
        { label: "Total Capacity",   value: jailOccupancy.total_capacity ?? jail.capacity, accent: false },
        { label: "Current Inmates",  value: jailOccupancy.current_inmates ?? "—",          accent: true  },
        { label: "Available",        value: jailOccupancy.available_capacity ?? "—",       accent: false },
        { label: "Total Blocks",     value: jailOccupancy.total_blocks ?? "—",             accent: false },
        { label: "Total Cells",      value: jailOccupancy.total_cells ?? "—",              accent: false },
        { label: "Available Cells",  value: jailOccupancy.available_cells ?? "—",          accent: false },
      ]
    : [];

  const occPct   = jailOccupancy ? parseFloat(jailOccupancy.occupancy_percentage) * (jailOccupancy.occupancy_percentage <= 1 ? 100 : 1) : 0;
  const occStatus = jailOccupancy?.occupancy_status || "LOW";
  const s = statusStyle[occStatus] || statusStyle.LOW;

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(96,165,250,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 inline-block mb-3">
          Facility · <span className="text-white">{jailId}</span>
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Jail <span className="text-blue-400">Dashboard</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Facility overview &amp; occupancy status
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex items-center gap-3 py-16 text-slate-700 text-[11px] tracking-widest">
          <div className="w-4 h-4 border border-slate-700 border-t-blue-400 rounded-full animate-spin" />
          LOADING FACILITY DATA...
        </div>
      )}

      {!isLoading && jail && (
        <>
          {/* ── Facility Info Card ── */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 mb-8 max-w-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-blue-400/40" />
            <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 mb-4">// Facility Info</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Facility Name", value: jail.jail_name },
                { label: "District",      value: jail.district  },
                { label: "Zone",          value: jail.zone      },
                { label: "Address",       value: jail.address   },
                { label: "Email",         value: jail.email     },
                { label: "Jail ID",       value: jail.jail_id   },
              ].map((f) => (
                <div key={f.label}>
                  <div className="text-[10px] tracking-widest uppercase text-slate-700 mb-1">{f.label}</div>
                  <div
                    className={`text-sm ${f.label === "Facility Name" ? "text-white font-bold text-lg" : "text-slate-300"}`}
                    style={f.label === "Facility Name" ? { fontFamily: "'Rajdhani', sans-serif" } : {}}
                  >
                    {f.value || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Occupancy Status Banner ── */}
          {jailOccupancy && (
            <div className={`border px-5 py-4 mb-8 max-w-2xl flex items-center justify-between gap-4 flex-wrap ${s.cls}`}>
              <div>
                <div className="text-[10px] tracking-widest uppercase mb-1 opacity-70">Occupancy Status</div>
                <div className="text-2xl font-black tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  {occStatus}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  {occPct.toFixed(1)}%
                </div>
                <div className="text-[10px] tracking-widest opacity-60">of capacity used</div>
              </div>
              <div className="w-full">
                <OccupancyBar pct={occPct} status={occStatus} />
              </div>
            </div>
          )}

          {/* ── Stats Grid ── */}
          {stats.length > 0 && (
            <>
              <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-5 border-b border-slate-800/80 max-w-2xl">
                // Occupancy Metrics
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-w-2xl">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-slate-900/40 border border-slate-800 px-5 py-5 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-px ${s.accent ? "bg-blue-400/60" : "bg-slate-700"}`} />
                    <div className="text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2">{s.label}</div>
                    <div
                      className={`text-2xl font-black ${s.accent ? "text-blue-400" : "text-white"}`}
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Quick Actions ── */}
          <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-5 border-b border-slate-800/80 max-w-2xl">
            // Quick Actions
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("cell-block-list")}
              className="bg-blue-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 transition-all duration-150"
            >
              View Cell Blocks
            </button>
            <button
              onClick={() => navigate("add-cell-block")}
              className="border border-slate-800 text-slate-400 px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-400 transition-all duration-150"
            >
              + Add Block
            </button>
          </div>
        </>
      )}
    </div>
  );
}
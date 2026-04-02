import getAllJailApi from "@/services/Jail/getAllJailApi";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

export default function JailAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithModal = (to) => {
    const isModal = Boolean(location.state?.modal);
    const backgroundLocation = location.state?.backgroundLocation || location;
    navigate(to, isModal ? { state: { modal: true, backgroundLocation } } : undefined);
  };

  const { data: jailListData, isLoading: jailListLoading } = useQuery({
    queryKey: ["jailList"],
    queryFn: () => getAllJailApi(),
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const jailList = jailListData?.data || [];
  const totalCapacity = jailList.reduce((s, j) => s + (j.capacity || 0), 0);
  const totalDistricts = new Set(jailList.map((j) => j.district)).size;

  const stats = [
    { label: "Total Facilities", value: jailListLoading ? "—" : jailList.length, accent: true },
    { label: "Total Capacity", value: jailListLoading ? "—" : totalCapacity.toLocaleString(), accent: false },
    { label: "Districts Covered", value: jailListLoading ? "—" : totalDistricts, accent: false },
  ];

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
          Admin Panel
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Jail <span className="text-blue-400">Dashboard</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Detention facility management &amp; oversight
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-slate-900/40 border border-slate-800 px-5 py-5 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-px ${s.accent ? "bg-blue-400/60" : "bg-slate-700"}`} />
            <div className="text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2">{s.label}</div>
            <div
              className={`text-3xl font-black ${s.accent ? "text-blue-400" : "text-white"}`}
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Section label ── */}
      <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-6 border-b border-slate-800/80 max-w-2xl">
        // Quick Actions
      </div>

      {/* ── Buttons ── */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigateWithModal("/admin/dashboard/jaildashboard/add-jail")}
          className="bg-blue-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 transition-all duration-150"
        >
          + Add Jail
        </button>
        <button
          onClick={() => navigateWithModal("/admin/dashboard/jaildashboard/jail-list")}
          className="border border-slate-800 text-slate-400 px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-400 transition-all duration-150"
        >
          View Jail List
        </button>
      </div>
    </div>
  );
}
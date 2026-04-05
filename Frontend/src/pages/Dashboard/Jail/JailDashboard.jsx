import getJailOccupancyDetailsApi from "@/services/Analytics/jailOccupancyDetailsApi";
import { getIncarcerationsByJail, releaseIncarceration } from "@/services/Incarceration/incarcerationApi";
import {
  getCriminalCaseHistoryForJail,
  getCriminalFullProfileForJail,
  getCriminalTimelineForJail,
} from "@/services/Jail/jailCriminalApi";
import { getUnreadNotificationCount } from "@/services/Notification/notificationApi";
import getJailByIdApi from "@/services/Jail/getJailByIdApi";
import { jailSignoutApi } from "@/services/authServices/signoutApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const statusStyle = {
  LOW:      { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", bar: "bg-emerald-400" },
  MODERATE: { cls: "text-amber-400  bg-amber-400/10  border-amber-400/20",     bar: "bg-amber-400"  },
  HIGH:     { cls: "text-orange-400 bg-orange-400/10 border-orange-400/20",    bar: "bg-orange-400" },
  CRITICAL: { cls: "text-red-400    bg-red-400/10    border-red-400/20",       bar: "bg-red-400"    },
};

const secondaryBtnCls =
  "rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-4 py-2 text-[11px] font-black tracking-widest uppercase hover:border-blue-400/50 hover:text-blue-300 hover:bg-slate-800/80 transition-all";

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
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, clearUser } = userStore();
  const [selectedIncarceration, setSelectedIncarceration] = useState(null);
  const [selectedCriminalId, setSelectedCriminalId] = useState("");
  const jailId = user?.jail_id;

  const signoutMut = useMutation({
    mutationFn: jailSignoutApi,
    onSuccess: () => {
      clearUser();
      navigate("/", { replace: true });
    },
  });

  const { data: jailData, isLoading: jailDataLoading } = useQuery({
    queryKey: ["jailData", jailId],
    queryFn: () => getJailByIdApi(jailId),
    enabled: !!jailId,
  });

  const jail = jailData?.data || null;

  const { data: jailOccupancyData, isLoading: jailOccupancyLoading } = useQuery({
    queryKey: ["jailOccupancyData", jailId],
    queryFn: () => getJailOccupancyDetailsApi(),
    enabled: !!jailId,
  });

  const { data: incarcerationData, isLoading: incarcerationLoading } = useQuery({
    queryKey: ["jailIncarcerations", jailId],
    queryFn: () => getIncarcerationsByJail(jailId),
    enabled: !!jailId,
  });

  const { data: unreadData } = useQuery({
    queryKey: ["jailUnreadNotificationCount"],
    queryFn: getUnreadNotificationCount,
    enabled: !!jailId,
  });

  const { data: selectedCriminalProfileData, isLoading: isLoadingCriminalProfile } = useQuery({
    queryKey: ["jailDashboardCriminalProfile", selectedCriminalId],
    queryFn: () => getCriminalFullProfileForJail(selectedCriminalId),
    enabled: !!selectedCriminalId,
  });
  const { data: selectedCriminalTimelineData } = useQuery({
    queryKey: ["jailDashboardCriminalTimeline", selectedCriminalId],
    queryFn: () => getCriminalTimelineForJail(selectedCriminalId),
    enabled: !!selectedCriminalId,
  });
  const { data: selectedCriminalCaseHistoryData } = useQuery({
    queryKey: ["jailDashboardCriminalCaseHistory", selectedCriminalId],
    queryFn: () => getCriminalCaseHistoryForJail(selectedCriminalId),
    enabled: !!selectedCriminalId,
  });
  const selectedCriminalProfile = selectedCriminalProfileData?.data || null;
  const selectedCriminalTimeline = selectedCriminalTimelineData?.data || [];
  const selectedCriminalCaseHistory = selectedCriminalCaseHistoryData?.data || [];

  const releaseMut = useMutation({
    mutationFn: (incarcerationId) => releaseIncarceration(incarcerationId, { notes: "Released by jail dashboard" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jailIncarcerations", jailId] });
      queryClient.invalidateQueries({ queryKey: ["jailOccupancyData", jailId] });
      alert("Inmate released successfully.");
    },
  });

  // API returns array; find this jail's occupancy record
  const occupancyList = Array.isArray(jailOccupancyData?.data)
    ? jailOccupancyData.data
    : jailOccupancyData?.data
    ? [jailOccupancyData.data]
    : [];

  const jailOccupancy = occupancyList.find((o) => o.jail_id === jailId) || occupancyList[0] || null;
  const incarcerations = Array.isArray(incarcerationData?.data) ? incarcerationData.data : [];
  const unreadCount = Number(unreadData?.data?.unread_count || 0);
  const recentIncarcerations = incarcerations.slice(0, 12);

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

  if (user && !jailId) {
    return (
      <div className="min-h-screen bg-[#080a0e] text-slate-300 p-8">
        <p className="text-red-400">Access denied. Please login as jail account.</p>
      </div>
    );
  }

  const occPct   = jailOccupancy ? parseFloat(jailOccupancy.occupancy_percentage) * (jailOccupancy.occupancy_percentage <= 1 ? 100 : 1) : 0;
  const occStatus = jailOccupancy?.occupancy_status || "LOW";
  const s = statusStyle[occStatus] || statusStyle.LOW;

  const openJailModal = (path) => {
    navigate(path, {
      state: {
        modal: true,
        backgroundLocation: location,
      },
    });
  };

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
      <div className="max-w-7xl mx-auto">
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
        <p className="text-[11px] text-slate-400 mt-2 tracking-widest">
          // Facility overview &amp; occupancy status
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => openJailModal("/jail/dashboard/notifications")}
            className="relative w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-lg transition-all flex items-center justify-center"
            aria-label="Notifications"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => openJailModal("/jail/dashboard/cell-block-list")}
            className="rounded-xl bg-blue-400 text-[#080a0e] px-4 py-2 text-[11px] font-black tracking-widest uppercase hover:bg-blue-300 transition-all"
          >
            Cell Blocks
          </button>
          <button
            onClick={() => openJailModal("/jail/dashboard/add-cell-block")}
            className={secondaryBtnCls}
          >
            Add Block
          </button>
          <button
            onClick={() => signoutMut.mutate()}
            className="rounded-xl border border-red-500/30 text-red-400 px-4 py-2 text-[11px] font-black tracking-widest uppercase hover:bg-red-500/10 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex items-center gap-3 py-16 text-slate-400 text-[11px] tracking-widest">
          <div className="w-4 h-4 border border-slate-700 border-t-blue-400 rounded-full animate-spin" />
          LOADING FACILITY DATA...
        </div>
      )}

      {!isLoading && jail && (
        <>
          {/* ── Facility Info Card ── */}
          <div className="bg-slate-900/70 border border-slate-700 p-6 mb-8 w-full max-w-5xl rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-blue-400/40" />
            <div className="text-[10px] tracking-[0.22em] uppercase text-slate-400 mb-4">// Facility Info</div>
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
                  <div className="text-[10px] tracking-widest uppercase text-slate-400 mb-1">{f.label}</div>
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
            <div className={`border px-5 py-4 mb-8 w-full max-w-5xl rounded-xl flex items-center justify-between gap-4 flex-wrap ${s.cls}`}>
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
              <div className="text-[10px] tracking-[0.22em] uppercase text-slate-400 pb-3 mb-5 border-b border-slate-700/80 w-full max-w-5xl">
                // Occupancy Metrics
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 w-full max-w-5xl">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-slate-900/70 border border-slate-700 px-5 py-5 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-px ${s.accent ? "bg-blue-400/60" : "bg-slate-700"}`} />
                    <div className="text-[10px] tracking-[0.18em] uppercase text-slate-400 mb-2">{s.label}</div>
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
          <div className="text-[10px] tracking-[0.22em] uppercase text-slate-400 pb-3 mb-5 border-b border-slate-700/80 w-full max-w-5xl">
            // Quick Actions
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => openJailModal("/jail/dashboard/cell-block-list")}
              className="bg-blue-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 transition-all duration-150"
            >
              View Cell Blocks
            </button>
            <button
              onClick={() => openJailModal("/jail/dashboard/add-cell-block")}
              className="border border-slate-600 bg-slate-900/70 text-slate-100 px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:border-blue-400/50 hover:text-blue-300 hover:bg-slate-800/80 transition-all duration-150"
            >
              + Add Block
            </button>
            <button
              onClick={() => openJailModal("/jail/dashboard/cell-block-list")}
              className="border border-slate-600 bg-slate-900/70 text-slate-100 px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:border-blue-400/50 hover:text-blue-300 hover:bg-slate-800/80 transition-all duration-150"
            >
              Manage Cells
            </button>
            <button
              onClick={() => openJailModal("/jail/dashboard/analytics")}
              className="border border-slate-600 bg-slate-900/70 text-slate-100 px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:border-blue-400/50 hover:text-blue-300 hover:bg-slate-800/80 transition-all duration-150"
            >
              View Analytics
            </button>
            <button
              onClick={() => openJailModal("/jail/dashboard/transfer-criminal")}
              className="border border-slate-600 bg-slate-900/70 text-slate-100 px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:border-blue-400/50 hover:text-blue-300 hover:bg-slate-800/80 transition-all duration-150"
            >
              Transfer Criminal
            </button>
            <button
              onClick={() => openJailModal("/jail/dashboard/transfer-history")}
              className="border border-slate-600 bg-slate-900/70 text-slate-100 px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:border-blue-400/50 hover:text-blue-300 hover:bg-slate-800/80 transition-all duration-150"
            >
              Transfer History
            </button>
          </div>

          {/* ── Incarceration History (Current + Past) ── */}
          <div className="text-[10px] tracking-[0.22em] uppercase text-slate-400 pb-3 mt-10 mb-5 border-b border-slate-700/80">
            // Incarcerations (Current + Historical)
          </div>
          {incarcerationLoading ? (
            <p className="text-slate-400 text-sm">Loading incarceration records...</p>
          ) : recentIncarcerations.length === 0 ? (
            <p className="text-slate-400 text-sm">No incarceration records found for this jail.</p>
          ) : (
            <div className="overflow-x-auto border border-slate-800 bg-slate-900/30">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-widest">
                    <th className="text-left px-3 py-3">Incarceration ID</th>
                    <th className="text-left px-3 py-3">Criminal</th>
                    <th className="text-left px-3 py-3">State</th>
                    <th className="text-left px-3 py-3">Arrest ID</th>
                    <th className="text-left px-3 py-3">From Jail</th>
                    <th className="text-left px-3 py-3">Block/Cell</th>
                    <th className="text-left px-3 py-3">Custody</th>
                    <th className="text-left px-3 py-3">Admitted At</th>
                    <th className="text-left px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncarcerations.map((row) => (
                    <tr key={row.incarceration_id} className="border-b border-slate-800/70 hover:bg-slate-900/50">
                      <td className="px-3 py-3 text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedIncarceration(row)}
                          className="text-blue-300 font-mono hover:text-blue-200 underline underline-offset-2"
                        >
                          {row.incarceration_id}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedCriminalId(row.criminal_id || "")}
                          className="text-slate-100 hover:text-blue-300"
                        >
                          {(row.criminal_name || "Criminal") + " "}
                          <span className="text-blue-300 font-mono">({row.criminal_id || "CRM-Unknown"})</span>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-xs">
                        {row.released_at ? (
                          <span className="rounded-full px-2 py-1 text-[10px] border border-amber-500/30 text-amber-300 bg-amber-500/10">Historical</span>
                        ) : (
                          <span className="rounded-full px-2 py-1 text-[10px] border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">Current</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-slate-300 font-mono text-xs">{row.arrest_id || "ARS-Unknown"}</td>
                      <td className="px-3 py-3 text-slate-300 text-xs">
                        {row.from_jail_name || row.from_jail_id || "—"}
                      </td>
                      <td className="px-3 py-3 text-slate-300 text-xs">
                        {(row.block_name || "Block N/A") + " / " + (row.cell_number || row.cell_id || "Unassigned")}
                      </td>
                      <td className="px-3 py-3 text-slate-300 text-xs">{row.custody_status || "in_custody"}</td>
                      <td className="px-3 py-3 text-slate-400 text-xs">
                        {row.admitted_at ? new Date(row.admitted_at).toLocaleString() : "Date unavailable"}
                      </td>
                      <td className="px-3 py-3">
                        {row.released_at ? (
                          <span className="text-xs text-slate-500">Released/Transferred</span>
                        ) : (
                          <button
                            disabled={releaseMut.isPending}
                            onClick={() => {
                              if (confirm(`Release incarceration ${row.incarceration_id}?`)) {
                                releaseMut.mutate(row.incarceration_id);
                              }
                            }}
                            className="rounded-xl text-xs px-3 py-1.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all disabled:opacity-50"
                          >
                            Release
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedIncarceration && (
            <div className="fixed inset-0 bg-[#080a0e]/90 flex items-center justify-center z-50 px-6">
              <div className="bg-[#0c1017] border border-slate-700 p-6 max-w-3xl w-full rounded-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black tracking-widest uppercase text-white">Incarceration Detail</h2>
                  <button
                    onClick={() => setSelectedIncarceration(null)}
                    className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-4 py-2 text-[12px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-300"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DashInfo label="Incarceration ID" value={selectedIncarceration.incarceration_id} />
                  <DashInfo label="Arrest ID" value={selectedIncarceration.arrest_id || "ARS-Unknown"} />
                  <DashInfo label="Jail ID" value={selectedIncarceration.jail_id || jailId || "JAL-Unknown"} />
                  <DashInfo label="From Jail ID" value={selectedIncarceration.from_jail_id || "—"} />
                  <DashInfo label="From Jail Name" value={selectedIncarceration.from_jail_name || "—"} />
                  <DashInfo label="Block" value={selectedIncarceration.block_name || "Block N/A"} />
                  <DashInfo label="Cell" value={selectedIncarceration.cell_number || selectedIncarceration.cell_id || "Unassigned"} />
                  <DashInfo label="Custody Status" value={selectedIncarceration.custody_status || "in_custody"} />
                  <DashInfo
                    label="Admitted At"
                    value={selectedIncarceration.admitted_at ? new Date(selectedIncarceration.admitted_at).toLocaleString() : "Date unavailable"}
                  />
                  <DashInfo
                    label="Released At"
                    value={selectedIncarceration.released_at ? new Date(selectedIncarceration.released_at).toLocaleString() : "Still active"}
                  />
                </div>

                <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">Criminal</p>
                  <button
                    type="button"
                    onClick={() => setSelectedCriminalId(selectedIncarceration.criminal_id || "")}
                    className="mt-1 text-sm text-blue-300 hover:text-blue-200"
                  >
                    {(selectedIncarceration.criminal_name || "Criminal") + " "}
                    <span className="font-mono">({selectedIncarceration.criminal_id || "CRM-Unknown"})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedCriminalId && (
            <div className="fixed inset-0 bg-[#080a0e]/90 flex items-center justify-center z-50 px-6">
              <div className="bg-[#0c1017] border border-slate-700 p-6 max-w-3xl w-full rounded-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black tracking-widest uppercase text-white">Criminal Profile</h2>
                  <button
                    onClick={() => setSelectedCriminalId("")}
                    className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-4 py-2 text-[12px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-300"
                  >
                    Close
                  </button>
                </div>

                {isLoadingCriminalProfile ? (
                  <p className="text-slate-400">Loading profile...</p>
                ) : !selectedCriminalProfile ? (
                  <p className="text-red-300">Could not load criminal details.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DashInfo label="Criminal ID" value={selectedCriminalProfile.criminal_id} />
                      <DashInfo label="Name" value={selectedCriminalProfile.full_name || "Name in record"} />
                      <DashInfo label="Gender" value={selectedCriminalProfile.gender || "male"} />
                      <DashInfo label="Age" value={String(selectedCriminalProfile.age ?? "Adult")} />
                      <DashInfo label="Status" value={selectedCriminalProfile.status || "in_custody"} />
                      <DashInfo label="NID" value={selectedCriminalProfile.nid || "NID in record"} />
                      <DashInfo label="Father Name" value={selectedCriminalProfile.father_name || "Md. Rahman"} />
                      <DashInfo label="Mother Name" value={selectedCriminalProfile.mother_name || "Amena Khatun"} />
                      <DashInfo label="Nationality" value={selectedCriminalProfile.nationality || "Bangladeshi"} />
                      <DashInfo label="Aliases" value={selectedCriminalProfile.aliases || "Not available"} />
                      <DashInfo label="Permanent Address" value={selectedCriminalProfile.permanent_address || "Not available"} />
                      <DashInfo label="Current Address" value={selectedCriminalProfile.current_address || "Not available"} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Legal History Timeline</p>
                      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                        {selectedCriminalTimeline.length === 0 ? (
                          <p className="p-4 text-sm text-slate-400">No legal history found.</p>
                        ) : (
                          <ul className="divide-y divide-slate-800">
                            {selectedCriminalTimeline.map((item, idx) => (
                              <li key={`${item.event_type}-${item.event_date}-${idx}`} className="p-3">
                                <p className="text-xs text-slate-500">{item.event_date ? new Date(item.event_date).toLocaleString() : "—"}</p>
                                <p className="text-sm font-semibold text-slate-200 mt-1">{item.event_type}</p>
                                <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap">{item.description}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Case Files</p>
                      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                        {selectedCriminalCaseHistory.length === 0 ? (
                          <p className="p-4 text-sm text-slate-400">No case history found.</p>
                        ) : (
                          <ul className="divide-y divide-slate-800">
                            {selectedCriminalCaseHistory.map((c) => (
                              <li key={c.case_id} className="p-3">
                                <p className="text-sm text-slate-200 font-semibold">Case #{c.case_id}: {c.case_title || "Untitled Case"}</p>
                                <p className="text-xs text-slate-400 mt-1">{c.case_type} | {c.status} | Registered: {c.filed_at ? new Date(c.filed_at).toLocaleString() : "—"}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}

function DashInfo({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2">
      <p className="text-[10px] uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-sm text-slate-100 mt-1 wrap-break-word">{value || "Not available"}</p>
    </div>
  );
}
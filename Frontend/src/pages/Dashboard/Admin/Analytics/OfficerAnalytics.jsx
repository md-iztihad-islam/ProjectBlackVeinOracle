import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import getOfficerAnalyticsApi from "@/services/Officer/getOfficerAnalyticsApi";
import getAllRankApi from "@/services/Rank/getAllRankApi";
import getThanaByNameApi from "@/services/Thana/getThanaByNameApi";
import { useNavigate } from "react-router-dom";

/* ─── Constants ─────────────────────────────────────────── */
const DISTRICTS = [
  "Bagerhat","Bandarban","Barguna","Barishal","Bhola","Bogura","Brahmanbaria",
  "Chandpur","Chapainawabganj","Chattogram","Chuadanga","Cox's Bazar","Cumilla",
  "Dhaka","Dinajpur","Faridpur","Feni","Gaibandha","Gazipur","Gopalganj",
  "Habiganj","Jamalpur","Jashore","Jhalokati","Jhenaidah","Joypurhat",
  "Khagrachari","Khulna","Kishoreganj","Kurigram","Kushtia","Lakshmipur",
  "Lalmonirhat","Madaripur","Magura","Manikganj","Meherpur","Moulvibazar",
  "Munshiganj","Mymensingh","Naogaon","Narail","Narayanganj","Narsingdi",
  "Natore","Netrokona","Nilphamari","Noakhali","Pabna","Panchagarh",
  "Patuakhali","Pirojpur","Rajbari","Rajshahi","Rangamati","Rangpur",
  "Satkhira","Shariatpur","Sherpur","Sirajganj","Sunamganj","Sylhet",
  "Tangail","Thakurgaon",
];

const GENDER_OPTIONS = [
  { value: "male",   label: "Male"   },
  { value: "female", label: "Female" },
  { value: "other",  label: "Other"  },
];

const PIE_COLORS = ["#2563eb","#0d9488","#d97706","#e11d48","#7c3aed","#16a34a","#0ea5e9","#f59e0b"];

const RANK_COLOR_MAP = {
  oc:        { label: "Officer-in-Charge", color: "#2563eb" },
  inspector: { label: "Inspector",         color: "#7c3aed" },
  si:        { label: "Sub-Inspector",     color: "#0d9488" },
  constable: { label: "Constable",         color: "#d97706" },
};

const CUSTODY_META = {
  in_custody:  { label: "In Custody",  color: "#7c3aed" },
  on_bail:     { label: "On Bail",     color: "#d97706" },
  released:    { label: "Released",    color: "#16a34a" },
  transferred: { label: "Transferred", color: "#2563eb" },
};

const GD_STATUS_META = {
  assigned_pending_gd:   { label: "Pending",   color: "#d97706" },
  assigned_submitted_gd: { label: "Submitted", color: "#2563eb" },
  assigned_approved_gd:  { label: "Approved",  color: "#16a34a" },
  assigned_rejected_gd:  { label: "Rejected",  color: "#e11d48" },
};

/* ─── Helpers ───────────────────────────────────────────── */
const fmt = (n) => (n != null ? Number(n).toLocaleString() : "—");

function deriveAnalytics(officers) {
  if (!officers?.length) return null;

  // Gender
  const genderMap = {};
  officers.forEach((o) => {
    const g = o.gender || "unknown";
    genderMap[g] = (genderMap[g] || 0) + 1;
  });
  const genderData = Object.entries(genderMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Rank
  const rankMap = {};
  officers.forEach((o) => {
    const label = RANK_COLOR_MAP[o.rank_code]?.label || o.rank_name || o.rank_code || "Unknown";
    rankMap[label] = (rankMap[label] || 0) + 1;
  });
  const rankData = Object.entries(rankMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // GD status totals
  let totalAssignedGD = 0, totalApprovedGD = 0;
  const gdSums = { assigned_pending_gd: 0, assigned_submitted_gd: 0, assigned_approved_gd: 0, assigned_rejected_gd: 0 };
  officers.forEach((o) => {
    totalAssignedGD += Number(o.total_assigned_gd || 0);
    totalApprovedGD += Number(o.total_approved_gd || 0);
    Object.keys(gdSums).forEach((k) => { gdSums[k] += Number(o[k] || 0); });
  });
  const gdStatusData = Object.entries(gdSums)
    .map(([key, value]) => ({ name: GD_STATUS_META[key].label, value, fill: GD_STATUS_META[key].color }))
    .filter((d) => d.value > 0);

  // Custody (dedupe by thana to avoid double-counting)
  const custodySums = { in_custody: 0, on_bail: 0, released: 0, transferred: 0 };
  let totalArrests = 0;
  const seenThanas = new Set();
  officers.forEach((o) => {
    if (!seenThanas.has(o.thana_id)) {
      seenThanas.add(o.thana_id);
      custodySums.in_custody  += Number(o.in_custody_count  || 0);
      custodySums.on_bail     += Number(o.on_bail_count     || 0);
      custodySums.released    += Number(o.released_count    || 0);
      custodySums.transferred += Number(o.transferred_count || 0);
      totalArrests            += Number(o.total_arrests_in_officer_thana || 0);
    }
  });
  const custodyData = Object.entries(custodySums)
    .map(([key, value]) => ({ name: CUSTODY_META[key].label, value, fill: CUSTODY_META[key].color }))
    .filter((d) => d.value > 0);

  // Officers by district (top 10)
  const districtMap = {};
  officers.forEach((o) => { const d = o.district || "Unknown"; districtMap[d] = (districtMap[d] || 0) + 1; });
  const districtData = Object.entries(districtMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Officers + GDs by thana (top 8)
  const thanaMap = {};
  officers.forEach((o) => {
    const t = o.thana_name || o.thana_id || "Unknown";
    if (!thanaMap[t]) thanaMap[t] = { name: t, Officers: 0, GDs: 0 };
    thanaMap[t].Officers += 1;
    thanaMap[t].GDs      += Number(o.total_assigned_gd || 0);
  });
  const thanaData = Object.values(thanaMap)
    .sort((a, b) => b.Officers - a.Officers)
    .slice(0, 8);

  // Avg GD performance per rank
  const rankPerf = {};
  officers.forEach((o) => {
    const key = o.rank_name || o.rank_code || "Unknown";
    if (!rankPerf[key]) rankPerf[key] = { rank: key, officers: 0, gds: 0, approved: 0 };
    rankPerf[key].officers += 1;
    rankPerf[key].gds      += Number(o.total_assigned_gd || 0);
    rankPerf[key].approved += Number(o.total_approved_gd || 0);
  });
  const perfData = Object.values(rankPerf)
    .map((r) => ({
      rank: r.rank,
      "Avg GDs":      r.officers ? +(r.gds      / r.officers).toFixed(1) : 0,
      "Avg Approved": r.officers ? +(r.approved / r.officers).toFixed(1) : 0,
    }))
    .sort((a, b) => b["Avg GDs"] - a["Avg GDs"]);

  return {
    total: officers.length,
    totalAssignedGD,
    totalApprovedGD,
    totalArrests,
    genderData,
    rankData,
    gdStatusData,
    custodyData,
    districtData,
    thanaData,
    perfData,
    totalOfficersInFilter: Number(officers[0]?.total_officers_in_filter || officers.length),
  };
}

/* ─── Shared UI components ──────────────────────────────── */
function FilterSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer w-full"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
            {typeof o === "string" ? o : o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ThanaCombobox({ value, onChange }) {
  const [input, setInput] = useState("");
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);

  const { data } = useQuery({
    queryKey: ["thanas", input],
    queryFn: () => getThanaByNameApi(input),
    enabled: input.trim().length >= 2,
    staleTime: 30_000,
  });
  const thanas = data?.data || [];

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className="flex flex-col gap-1 min-w-0" ref={ref}>
      <label className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400">Thana</label>
      <div className="relative">
        <input
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
          placeholder="Search thana…"
          value={value ? value.thana_name : input}
          onChange={(e) => { onChange(null); setInput(e.target.value); setOpen(true); }}
          onFocus={() => input.length >= 2 && setOpen(true)}
        />
        {value && (
          <button onClick={() => { onChange(null); setInput(""); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base">×</button>
        )}
        {open && !value && thanas.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {thanas.map((t) => (
              <div key={t.thana_id}
                onClick={() => { onChange(t); setOpen(false); setInput(""); }}
                className="px-3 py-2.5 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                <span className="font-semibold text-slate-800">{t.thana_name}</span>
                <span className="text-slate-400 text-xs ml-2">{t.district}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({ label, value, colorClass = "text-slate-900", icon, isLoading }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center gap-4">
      {icon && <span className="text-3xl shrink-0">{icon}</span>}
      <div className="min-w-0">
        {isLoading
          ? <div className="h-7 w-16 rounded bg-slate-100 animate-pulse mb-1" />
          : <div className={`text-3xl font-extrabold tabular-nums leading-tight ${colorClass}`}>{value}</div>
        }
        <div className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col ${className}`}>
      <div className="mb-4 shrink-0">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      {label && <div className="font-bold text-slate-700 mb-1">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color || p.fill || p.payload?.fill }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-bold text-slate-800">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  return (
    <text x={cx + r * Math.cos(-midAngle * R)} y={cy + r * Math.sin(-midAngle * R)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function ChartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[180px] gap-2">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
      <span className="text-xs text-slate-400">No data available</span>
    </div>
  );
}

function ChartLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[180px]">
      <div className="w-7 h-7 border-2 border-slate-100 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

/* ─── Officer Table Row ──────────────────────────────────── */
function OfficerRow({ o, index }) {
  const rankCfg = RANK_COLOR_MAP[o.rank_code] || { label: o.rank_name || o.rank_code, color: "#94a3b8" };
  const totalGD   = Number(o.total_assigned_gd || 0);
  const approved  = Number(o.assigned_approved_gd || 0);
  const approvalRate = totalGD > 0 ? Math.round((approved / totalGD) * 100) : null;

  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(`profile/${o.officer_id}`)} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition">
      <td className="px-4 py-3 text-xs text-slate-400 font-mono w-10">{index + 1}</td>
      <td className="px-4 py-3">
        <div className="font-semibold text-sm text-slate-900 leading-tight">{o.full_name}</div>
        <div className="text-[0.7rem] text-slate-400 font-mono mt-0.5">{o.badge_no}</div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.63rem] font-bold uppercase tracking-wide whitespace-nowrap"
          style={{ background: rankCfg.color + "18", color: rankCfg.color }}>
          {rankCfg.label}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{o.thana_name || "—"}</td>
      <td className="px-4 py-3 text-xs text-slate-500">{o.district || "—"}</td>
      <td className="px-4 py-3 text-center font-bold text-sm text-slate-800">{fmt(o.total_assigned_gd)}</td>
      <td className="px-4 py-3 text-center font-bold text-sm text-green-700">{fmt(o.assigned_approved_gd)}</td>
      <td className="px-4 py-3 text-center font-bold text-sm text-red-600">{fmt(o.assigned_rejected_gd)}</td>
      <td className="px-4 py-3">
        {approvalRate != null ? (
          <div className="flex items-center gap-2 justify-center">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${approvalRate}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-600 w-8 text-right">{approvalRate}%</span>
          </div>
        ) : <span className="text-slate-300 text-xs flex justify-center">—</span>}
      </td>
      <td className="px-4 py-3 text-center font-bold text-sm text-violet-700">{fmt(o.total_arrests_in_officer_thana)}</td>
    </tr>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function OfficerAnalytics() {
  const [thana,    setThana]    = useState(null);
  const [district, setDistrict] = useState(null);
  const [rank,     setRank]     = useState(null);
  const [gender,   setGender]   = useState(null);
  const [applied,  setApplied]  = useState({});
  const [search,   setSearch]   = useState("");
  const [sortKey,  setSortKey]  = useState("total_assigned_gd");
  const [sortDir,  setSortDir]  = useState("desc");

  const { data: ranksData } = useQuery({ queryKey: ["ranks"], queryFn: getAllRankApi });
  const ranks = (ranksData?.data || []).map((r) => ({ value: r.rank_code || r.rank_id, label: r.rank_name }));

  const params = useMemo(() => ({
    thanaId: applied.thana?.thana_id || null,
    district: applied.district        || null,
    rank:     applied.rank            || null,
    gender:   applied.gender          || null,
  }), [applied]);

  console.log("Query params:", params);

  const { data: rawData, isLoading, isFetching } = useQuery({
    queryKey: ["officerAnalytics", params],
    queryFn: () => getOfficerAnalyticsApi(params),
    staleTime: 60_000,
  });

  const officers  = rawData?.data || [];
  console.log("Fetched officers:", officers);
  const loading   = isLoading || isFetching;
  const analytics = useMemo(() => deriveAnalytics(officers), [officers]);

  const filteredOfficers = useMemo(() => {
    let list = [...officers];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.full_name?.toLowerCase().includes(q) ||
        o.badge_no?.toLowerCase().includes(q) ||
        o.thana_name?.toLowerCase().includes(q) ||
        o.district?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const av = Number(a[sortKey] || 0);
      const bv = Number(b[sortKey] || 0);
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return list;
  }, [officers, search, sortKey, sortDir]);

  const applyFilters = () => setApplied({ thana, district, rank, gender });
  const clearFilters = () => { setThana(null); setDistrict(null); setRank(null); setGender(null); setApplied({}); };
  const hasFilters   = thana || district || rank || gender;

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortArrow = ({ k }) =>
    sortKey !== k ? null : <span className="ml-0.5 opacity-70">{sortDir === "desc" ? "↓" : "↑"}</span>;

  const activeTags = [
    applied.district && applied.district,
    applied.thana    && applied.thana.thana_name,
    applied.rank     && (ranks.find((r) => r.value === applied.rank)?.label || applied.rank),
    applied.gender   && applied.gender.charAt(0).toUpperCase() + applied.gender.slice(1),
  ].filter(Boolean);

  const COL_HEADERS = [
    { label: "#",       key: null },
    { label: "Officer", key: "full_name" },
    { label: "Rank",    key: "rank_code" },
    { label: "Thana",   key: "thana_name" },
    { label: "District",key: "district" },
    { label: "GDs",     key: "total_assigned_gd" },
    { label: "Approved",key: "assigned_approved_gd" },
    { label: "Rejected",key: "assigned_rejected_gd" },
    { label: "Rate",    key: null },
    { label: "Arrests", key: "total_arrests_in_officer_thana" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Officer Analytics</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {loading
                ? "Loading data…"
                : `${fmt(analytics?.totalOfficersInFilter || 0)} officers${activeTags.length ? " · filtered" : ""}`
              }
            </p>
          </div>
          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {activeTags.map((t, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 font-medium">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {/* ── Filters ── */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400 mb-3">Filters</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
            <FilterSelect label="District" value={district} onChange={setDistrict} options={DISTRICTS} placeholder="All Districts" />
            <ThanaCombobox value={thana} onChange={setThana} />
            <FilterSelect label="Rank"    value={rank}    onChange={setRank}    options={ranks}          placeholder="All Ranks"    />
            <FilterSelect label="Gender"  value={gender}  onChange={setGender}  options={GENDER_OPTIONS} placeholder="All Genders"  />
            <div className="col-span-2 sm:col-span-1 lg:col-span-2 flex gap-2">
              <button onClick={applyFilters}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg px-4 py-2 transition shadow-sm shadow-blue-100">
                Apply Filters
              </button>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg transition">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard label="Total Officers"    value={fmt(analytics?.total)}            colorClass="text-blue-700"   icon="👮" isLoading={loading} />
          <KPICard label="GDs Assigned"      value={fmt(analytics?.totalAssignedGD)}  colorClass="text-amber-600"  icon="📋" isLoading={loading} />
          <KPICard label="GDs Approved"      value={fmt(analytics?.totalApprovedGD)}  colorClass="text-green-700"  icon="✅" isLoading={loading} />
          <KPICard label="Total Arrests"     value={fmt(analytics?.totalArrests)}     colorClass="text-violet-700" icon="🔒" isLoading={loading} />
        </div>

        {/* ── Pie charts row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <ChartCard title="Gender Distribution" subtitle="Officers by gender">
            <div className="h-52">
              {loading ? <ChartLoader /> : !analytics?.genderData?.length ? <ChartEmpty /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.genderData} cx="50%" cy="50%" outerRadius={70} dataKey="value" labelLine={false} label={PieLabel}>
                      {analytics.genderData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.72rem" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>

          <ChartCard title="Rank Distribution" subtitle="Officers by rank">
            <div className="h-52">
              {loading ? <ChartLoader /> : !analytics?.rankData?.length ? <ChartEmpty /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.rankData} cx="50%" cy="50%" innerRadius={26} outerRadius={68} dataKey="value" labelLine={false} label={PieLabel}>
                      {analytics.rankData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.72rem" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>

          <ChartCard title="GD Status Breakdown" subtitle="Across all officers">
            <div className="h-52">
              {loading ? <ChartLoader /> : !analytics?.gdStatusData?.length ? <ChartEmpty /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.gdStatusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" labelLine={false} label={PieLabel}>
                      {analytics.gdStatusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.72rem" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>

          <ChartCard title="Custody Status" subtitle="Arrests by custody type">
            <div className="h-52">
              {loading ? <ChartLoader /> : !analytics?.custodyData?.length ? <ChartEmpty /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.custodyData} cx="50%" cy="50%" innerRadius={26} outerRadius={68} dataKey="value" labelLine={false} label={PieLabel}>
                      {analytics.custodyData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.72rem" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        {/* ── Bar charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <ChartCard title="Officers by District" subtitle="Top 10 districts">
            <div className="h-72">
              {loading ? <ChartLoader /> : !analytics?.districtData?.length ? <ChartEmpty /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.districtData} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="value" name="Officers" fill="#2563eb" radius={[0, 4, 4, 0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>

          <ChartCard title="Officers & GDs by Thana" subtitle="Top 8 thanas">
            <div className="h-72">
              {loading ? <ChartLoader /> : !analytics?.thanaData?.length ? <ChartEmpty /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.thanaData} margin={{ left: 0, right: 16, top: 4, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.72rem" }} />
                    <Bar dataKey="Officers" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="GDs"      fill="#0d9488" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        {/* ── Performance by rank ── */}
        <ChartCard title="Avg GD Performance by Rank" subtitle="Average assigned & approved GDs per officer per rank">
          <div className="h-60">
            {loading ? <ChartLoader /> : !analytics?.perfData?.length ? <ChartEmpty /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.perfData} margin={{ left: 0, right: 24, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="rank" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.72rem" }} />
                  <Bar dataKey="Avg GDs"      fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="Avg Approved" fill="#16a34a" radius={[3, 3, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        {/* ── Officer Detail Table ── */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Officer Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">{filteredOfficers.length} officer{filteredOfficers.length !== 1 ? "s" : ""}</p>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, badge, thana, district…"
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72 transition"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {COL_HEADERS.map(({ label, key }) => (
                    <th key={label}
                      onClick={() => key && toggleSort(key)}
                      className={`px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap ${key ? "cursor-pointer hover:text-slate-600 select-none" : ""}`}>
                      {label}<SortArrow k={key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(6)].map((_, i) => (
                      <tr key={i} className="border-b border-slate-50">
                        {[...Array(10)].map((_, j) => (
                          <td key={j} className="px-4 py-3.5">
                            <div className="h-3 rounded bg-slate-100 animate-pulse" style={{ width: `${35 + (j * 13) % 45}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  : filteredOfficers.length === 0
                    ? <tr><td colSpan={10} className="py-12 text-center text-sm text-slate-400">No officers found.</td></tr>
                    : filteredOfficers.map((o, i) => <OfficerRow key={o.officer_id} o={o} index={i} />)
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
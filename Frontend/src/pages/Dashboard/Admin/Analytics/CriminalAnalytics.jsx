import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  getCriminalOverview,
  getCriminalByDistrict,
  getCrimePeakByYear,
  getCrimeTypeDistribution,
  getCrimeYears,
  getCriminalRanking,
  getWantedByArea,
} from "@/services/Analytics/analyticsApi";
import {
  getCriminalFullProfile,
  getCriminalTimeline,
  getCriminalCaseHistory,
} from "@/services/Admin/adminApi";
import getThanaByNameApi from "@/services/Thana/getThanaByNameApi";
import getCriminalByNameApi from "@/services/Criminal/getCriminalByNameApi";

const DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria",
  "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", "Cox's Bazar", "Cumilla",
  "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj",
  "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat",
  "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur",
  "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi",
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur",
  "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet",
  "Tangail", "Thakurgaon",
];

const PIE_COLORS = ["#2563eb", "#0d9488", "#d97706", "#dc2626", "#7c3aed", "#16a34a", "#0ea5e9", "#f59e0b"];

const fmt = (n) => (n != null ? Number(n).toLocaleString() : "0");

const capitalizeWords = (v = "") =>
  String(v)
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

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
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data } = useQuery({
    queryKey: ["criminal-analytics-thana", input],
    queryFn: () => getThanaByNameApi(input),
    enabled: input.trim().length >= 2,
    staleTime: 30_000,
  });

  const thanas = data?.data || [];

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className="flex flex-col gap-1 min-w-0" ref={ref}>
      <label className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400">Thana</label>
      <div className="relative">
        <input
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
          placeholder="Search thana by name..."
          value={value ? `${value.thana_name} (${value.thana_id})` : input}
          onChange={(e) => {
            onChange(null);
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => input.length >= 2 && setOpen(true)}
        />

        {value && (
          <button
            onClick={() => {
              onChange(null);
              setInput("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base"
          >
            ×
          </button>
        )}

        {open && !value && thanas.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {thanas.map((t) => (
              <div
                key={t.thana_id}
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                  setInput("");
                }}
                className="px-3 py-2.5 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
              >
                <span className="font-semibold text-slate-800">{t.thana_name}</span>
                <span className="text-slate-400 text-xs ml-2">{t.thana_id} · {t.district}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CriminalCombobox({ value, onChange }) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data } = useQuery({
    queryKey: ["criminal-analytics-search", input],
    queryFn: () => getCriminalByNameApi(input),
    enabled: input.trim().length >= 2,
    staleTime: 30_000,
  });

  const criminals = data?.data || [];

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className="flex flex-col gap-1 min-w-0" ref={ref}>
      <label className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400">Criminal Profile</label>
      <div className="relative">
        <input
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
          placeholder="Search criminal by name..."
          value={value ? `${value.full_name} (${value.criminal_id})` : input}
          onChange={(e) => {
            onChange(null);
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => input.length >= 2 && setOpen(true)}
        />

        {value && (
          <button
            onClick={() => {
              onChange(null);
              setInput("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base"
          >
            ×
          </button>
        )}

        {open && !value && criminals.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {criminals.map((c) => (
              <div
                key={c.criminal_id}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                  setInput("");
                }}
                className="px-3 py-2.5 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
              >
                <span className="font-semibold text-slate-800">{c.full_name}</span>
                <span className="text-slate-400 text-xs ml-2">{c.criminal_id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({ label, value, colorClass, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center gap-4">
      <span className="text-3xl shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className={`text-3xl font-extrabold tabular-nums leading-tight ${colorClass}`}>{value}</div>
        <div className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col">
      <div className="mb-4 shrink-0">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="h-[280px]">{children}</div>
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
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color || p.fill }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-bold text-slate-800">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

function Info({ label, value, mono = false }) {
  return (
    <div className="bg-gray-800/70 border border-white/5 rounded-lg p-3">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-sm text-slate-200 ${mono ? "font-mono" : ""}`}>{value ?? "—"}</p>
    </div>
  );
}

export default function CriminalAnalytics() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const handleBack = () => {
    if (location.state?.modal) {
      const bg = location.state?.backgroundLocation;
      if (bg?.pathname) {
        navigate(
          {
            pathname: bg.pathname,
            search: bg.search || "",
            hash: bg.hash || "",
          },
          { replace: true },
        );
        return;
      }
      navigate("/admin/dashboard", { replace: true });
      return;
    }
    navigate("/admin/dashboard");
  };

  const [district, setDistrict] = useState(null);
  const [thana, setThana] = useState(null);
  const [year, setYear] = useState(currentYear);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [selectedCaseFile, setSelectedCaseFile] = useState(null);
  const [applied, setApplied] = useState({ district: null, thana: null, year: currentYear });

  const selectedCriminalId = selectedCriminal?.criminal_id || "";

  const queryParams = useMemo(
    () => ({ district: applied.district || null, thanaId: applied.thana?.thana_id || null }),
    [applied],
  );

  const queryParamsWithYear = useMemo(
    () => ({ ...queryParams, year: applied.year || currentYear }),
    [queryParams, applied.year, currentYear],
  );

  const { data: yearsData } = useQuery({ queryKey: ["crime-years"], queryFn: getCrimeYears });
  const years = (yearsData?.data || []).map((r) => r.year).filter(Boolean);
  const yearOptions = years.length ? years : [currentYear];

  const { data: overviewData } = useQuery({
    queryKey: ["criminal-overview", queryParams],
    queryFn: () => getCriminalOverview(queryParams),
  });

  const { data: districtData, isLoading: isDistrictLoading } = useQuery({
    queryKey: ["criminal-by-district", queryParams],
    queryFn: () => getCriminalByDistrict(queryParams),
  });

  const { data: typeData, isLoading: isTypeLoading } = useQuery({
    queryKey: ["crime-type-distribution", queryParamsWithYear],
    queryFn: () => getCrimeTypeDistribution(queryParamsWithYear),
  });

  const { data: peakData } = useQuery({
    queryKey: ["crime-peak-by-year", queryParamsWithYear],
    queryFn: () => getCrimePeakByYear(queryParamsWithYear),
  });

  const { data: wantedData, isLoading: isWantedLoading } = useQuery({
    queryKey: ["wanted-by-area", queryParams],
    queryFn: () => getWantedByArea(queryParams),
  });

  const { data: rankingData, isLoading: isRankingLoading } = useQuery({
    queryKey: ["criminal-ranking", queryParams],
    queryFn: () => getCriminalRanking(queryParams),
  });

  const { data: selectedCriminalFullProfileData, isLoading: isLoadingCriminalProfile } = useQuery({
    queryKey: ["analytics-criminal-profile", selectedCriminalId],
    queryFn: () => getCriminalFullProfile(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const { data: selectedCriminalTimelineData, isLoading: isLoadingCriminalTimeline } = useQuery({
    queryKey: ["analytics-criminal-timeline", selectedCriminalId],
    queryFn: () => getCriminalTimeline(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const { data: selectedCriminalCaseHistoryData, isLoading: isLoadingCriminalCaseHistory } = useQuery({
    queryKey: ["analytics-criminal-case-history", selectedCriminalId],
    queryFn: () => getCriminalCaseHistory(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const overview = overviewData?.data || {};
  const districtRows = districtData?.data || [];
  const topDistrictRows = districtRows.slice(0, 10);
  const typeRows = (typeData?.data || []).map((r) => ({
    ...r,
    label: capitalizeWords(r.case_type),
    value: Number(r.total_cases || 0),
  }));
  const peakRows = peakData?.data || [];
  const peakCrimes = peakRows.filter((r) => r.is_peak);
  const wantedRows = wantedData?.data || [];
  const rankingRows = rankingData?.data || [];
  const statusRows = [
    { key: "in_custody", label: "In Custody", value: Number(overview.in_custody_criminals || 0), color: "bg-blue-600" },
    { key: "wanted", label: "Wanted", value: Number(overview.wanted_criminals || 0), color: "bg-red-600" },
    { key: "on_bail", label: "On Bail", value: Number(overview.on_bail_criminals || 0), color: "bg-emerald-600" },
    { key: "released", label: "Released", value: Number(overview.released_criminals || 0), color: "bg-violet-600" },
    { key: "escaped", label: "Escaped", value: Number(overview.escaped_criminals || 0), color: "bg-amber-600" },
    { key: "unknown", label: "Unknown", value: Number(overview.unknown_criminals || 0), color: "bg-slate-500" },
  ];
  const totalStatusCount = statusRows.reduce((sum, s) => sum + s.value, 0);

  const selectedCriminalFullProfile = selectedCriminalFullProfileData?.data || null;
  const selectedCriminalTimeline = selectedCriminalTimelineData?.data || [];
  const selectedCriminalCaseHistory = selectedCriminalCaseHistoryData?.data || [];
  const profileCriminal = selectedCriminalFullProfile || selectedCriminal || {};
  const isProfileLoading = Boolean(selectedCriminalId) && (
    isLoadingCriminalProfile || isLoadingCriminalTimeline || isLoadingCriminalCaseHistory
  );

  const applyFilters = () => setApplied({ district, thana, year: Number(year) || currentYear });
  const clearFilters = () => {
    setDistrict(null);
    setThana(null);
    setYear(currentYear);
    setApplied({ district: null, thana: null, year: currentYear });
  };

  const activeTags = [
    applied.district,
    applied.thana ? `${applied.thana.thana_name} (${applied.thana.thana_id})` : null,
    applied.year ? `Year ${applied.year}` : null,
  ].filter(Boolean);

  if (selectedCriminalId) {
    return (
      <div className="space-y-6 bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-blue-300 font-bold">Admin Analytics</p>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">Criminal Profile Viewer</h1>
            <p className="text-sm text-slate-400 mt-1">Detailed legal history view, same as admin/thana criminal profile.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCriminal(null);
                setSelectedCaseFile(null);
              }}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
            >
              ← Back to Analytics
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-end">
            <CriminalCombobox value={selectedCriminal} onChange={setSelectedCriminal} />
            <div className="text-xs text-slate-500">Select another criminal to switch profile instantly.</div>
          </div>
        </div>

        {isProfileLoading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <div className="mx-auto w-10 h-10 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-600 mt-4">Loading full criminal profile and legal history...</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-red-400 via-amber-300 to-red-600">
                      {(profileCriminal?.image_url || selectedCriminal?.image_url) ? (
                      <img
                          src={profileCriminal?.image_url || selectedCriminal?.image_url}
                        alt={profileCriminal.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[11px] text-slate-400">
                        N/A
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Criminal Profile</p>
                    <h3 className="text-xl font-bold text-slate-100 mt-1">
                      {profileCriminal?.full_name || "Unknown Criminal"}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <Info label="Criminal ID" value={profileCriminal?.criminal_id} mono />
                <Info label="NID" value={profileCriminal?.nid} mono />
                <Info label="Gender" value={profileCriminal?.gender} />
                <Info label="Age" value={profileCriminal?.age ?? "—"} />
                <Info
                  label="Birth Date"
                  value={profileCriminal?.birth_date ? new Date(profileCriminal.birth_date).toLocaleDateString() : "—"}
                />
                <Info label="Father's Name" value={profileCriminal?.father_name} />
                <Info label="Mother's Name" value={profileCriminal?.mother_name} />
                <Info label="Aliases" value={profileCriminal?.aliases} />
                <Info label="Nationality" value={profileCriminal?.nationality} />
                <Info label="Status" value={profileCriminal?.status} />
                <Info
                  label="Risk Level"
                  value={profileCriminal?.risk_level != null ? `${profileCriminal.risk_level}/10` : "—"}
                />
                <Info
                  label="Registered Thana"
                  value={profileCriminal?.registered_thana || profileCriminal?.registered_thana_id || "—"}
                />
                <Info label="Open Cases" value={profileCriminal?.open_cases ?? "—"} />
                <Info label="Closed Cases" value={profileCriminal?.closed_cases ?? "—"} />
                <Info label="Total Arrests" value={profileCriminal?.total_arrests ?? "—"} />
                <Info label="Organizations" value={profileCriminal?.organizations || "None"} />
                <Info label="Current Address" value={profileCriminal?.current_address} />
                <Info label="Permanent Address" value={profileCriminal?.permanent_address} />
                <Info label="Identifying Marks" value={profileCriminal?.identifying_marks} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Legal History Timeline</p>
                <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden">
                  {selectedCriminalTimeline.length === 0 ? (
                    <p className="p-4 text-sm text-slate-400">No legal history found.</p>
                  ) : (
                    <ul className="divide-y divide-white/5">
                      {selectedCriminalTimeline.map((item, index) => (
                        <li key={`${item.event_type}-${item.event_date}-${index}`} className="p-3">
                          <p className="text-xs text-slate-500">
                            {item.event_date ? new Date(item.event_date).toLocaleString() : "—"}
                          </p>
                          <p className="text-sm font-semibold text-slate-200 mt-1">{item.event_type}</p>
                          <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap">{item.description}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Case Files & Updates</p>
                <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden">
                  {selectedCriminalCaseHistory.length === 0 ? (
                    <p className="p-4 text-sm text-slate-400">No case files found for this criminal.</p>
                  ) : (
                    <ul className="divide-y divide-white/5">
                      {selectedCriminalCaseHistory.map((caseItem) => (
                        <li
                          key={caseItem.case_id}
                          className="p-3 cursor-pointer hover:bg-white/[0.03]"
                          onClick={() => {
                            setSelectedCaseFile({
                              case_id: caseItem.case_id,
                              case_title: caseItem.case_title,
                              case_type: caseItem.case_type,
                              status: caseItem.status,
                              filed_at: caseItem.filed_at,
                              description: caseItem.description,
                              criminal_id: profileCriminal?.criminal_id,
                              criminal_name: profileCriminal?.full_name,
                              thana_id: caseItem.thana_id,
                              thana_name: caseItem.thana_name,
                            });
                          }}
                        >
                          <p className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                            Case #{caseItem.case_id}: {caseItem.case_title || "Untitled Case"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Type: {caseItem.case_type || "—"} | Status: {caseItem.status || "—"} | Registered: {caseItem.filed_at ? new Date(caseItem.filed_at).toLocaleString() : "—"}
                          </p>
                          {caseItem.last_status_change_at && (
                            <p className="text-xs text-amber-300 mt-1">
                              Last Status Update: {new Date(caseItem.last_status_change_at).toLocaleString()}
                            </p>
                          )}
                          {Array.isArray(caseItem.status_history) && caseItem.status_history.length > 0 && (
                            <ul className="mt-2 pl-4 list-disc text-xs text-slate-300 space-y-1">
                              {caseItem.status_history.map((h, idx) => (
                                <li key={`${caseItem.case_id}-status-${idx}`}>
                                  {h?.from_status || "unknown"} → {h?.to_status || "unknown"}
                                  {h?.changed_at ? ` (${new Date(h.changed_at).toLocaleString()})` : ""}
                                </li>
                              ))}
                            </ul>
                          )}
                          {caseItem.description && (
                            <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{caseItem.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {selectedCaseFile && (
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                onClick={() => setSelectedCaseFile(null)}
              >
                <div
                  className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">Case Details</p>
                      <h3 className="text-xl font-bold text-slate-100 mt-1">
                        {selectedCaseFile.case_title || "Untitled Case"}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedCaseFile(null)}
                      className="text-slate-400 hover:text-slate-200 text-sm"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                    <Info label="Case ID" value={selectedCaseFile.case_id} mono />
                    <Info label="Case Type" value={selectedCaseFile.case_type} />
                    <Info label="Status" value={selectedCaseFile.status} />
                    <Info
                      label="Registered At"
                      value={selectedCaseFile.filed_at ? new Date(selectedCaseFile.filed_at).toLocaleString() : "—"}
                    />
                    <Info label="Criminal" value={selectedCaseFile.criminal_name || "—"} />
                    <Info label="Criminal ID" value={selectedCaseFile.criminal_id} mono />
                    <Info label="Thana" value={selectedCaseFile.thana_name || "—"} />
                    <Info label="Thana ID" value={selectedCaseFile.thana_id || "—"} mono />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Description</p>
                    <div className="bg-gray-800 border border-white/5 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap">
                      {selectedCaseFile.description || "No description provided."}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-blue-300 font-bold">Admin Analytics</p>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Criminal Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Focused views for criminal intelligence and field planning.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Back to Dashboard
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Criminal</button>
          <button
            onClick={() => navigate("/analytics/officer", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Officer
          </button>
          <button
            onClick={() => navigate("/analytics/thana", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Thana
          </button>
          <button
            onClick={() => navigate("/analytics/jail", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Jail
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
        <p className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400 mb-3">Filters</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          <FilterSelect label="District" value={district} onChange={setDistrict} options={DISTRICTS} placeholder="All Districts" />
          <ThanaCombobox value={thana} onChange={setThana} />
          <FilterSelect
            label="Year"
            value={String(year)}
            onChange={(v) => setYear(Number(v || currentYear))}
            options={yearOptions.map((y) => ({ value: String(y), label: String(y) }))}
            placeholder="Select Year"
          />
          <CriminalCombobox value={selectedCriminal} onChange={setSelectedCriminal} />
          <div className="col-span-2 sm:col-span-1 lg:col-span-2 flex gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg px-4 py-2 transition shadow-sm shadow-blue-100"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>

        {activeTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {activeTags.map((t, i) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 font-medium">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="Total Criminals" value={fmt(overview.total_criminals)} colorClass="text-blue-700" icon="🧾" />
        <KPICard label="Wanted" value={fmt(overview.wanted_criminals)} colorClass="text-red-700" icon="🚨" />
        <KPICard label="Escaped" value={fmt(overview.escaped_criminals)} colorClass="text-amber-700" icon="🏃" />
        <KPICard label="High Risk" value={fmt(overview.high_risk_criminals)} colorClass="text-violet-700" icon="⚠️" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h3 className="text-sm font-bold text-slate-800">Criminals by Status</h3>
          <p className="text-xs text-slate-400">Across custody, wanted, bail and release states</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {statusRows.map((row) => {
            const percent = totalStatusCount > 0 ? Math.round((row.value / totalStatusCount) * 100) : 0;
            return (
              <div key={row.key} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700">{row.label}</p>
                  <p className="text-sm font-bold text-slate-900">{fmt(row.value)}</p>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`${row.color} h-full rounded-full`} style={{ width: `${percent}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{percent}% of tracked criminals</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Criminals by District" subtitle="District-wise criminal distribution">
          {isDistrictLoading ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading...</div>
          ) : topDistrictRows.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">No district data found for this filter.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topDistrictRows} margin={{ top: 8, right: 14, left: 14, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="district" width={96} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_criminals" fill="#2563eb" radius={[6, 6, 0, 0]} name="Criminals" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Crime Types (from Case Files)"
          subtitle={`Distribution for year ${applied.year || currentYear}`}
        >
          {isTypeLoading ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeRows} dataKey="value" nameKey="label" outerRadius={96} innerRadius={45} labelLine={false}>
                  {typeRows.map((entry, index) => (
                    <Cell key={`cell-${entry.case_type}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={38} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Wanted Criminals by Area" subtitle="Top 5 locations by wanted count">
          {isWantedLoading ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wantedRows.slice(0, 5)} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="zone"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={58}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="wanted_count" fill="#dc2626" radius={[6, 6, 0, 0]} name="Wanted" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Yearly Peak Crime Type" subtitle={`For selected year: ${applied.year || currentYear}`}>
          {peakRows.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">No case data found for this filter.</div>
          ) : (
            <div className="h-full flex flex-col gap-3">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wider font-bold text-red-700">Peak Type</p>
                <p className="text-lg font-bold text-red-900 mt-1">
                  {peakCrimes.map((p) => capitalizeWords(p.case_type)).join(", ")}
                </p>
                <p className="text-xs text-red-700 mt-1">Cases: {fmt(peakCrimes[0]?.total_cases || 0)}</p>
              </div>

              <div className="flex-1 min-h-0 overflow-auto border border-slate-100 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Crime Type</th>
                      <th className="px-3 py-2 text-right">Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {peakRows.map((r) => (
                      <tr key={r.case_type} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-700">{capitalizeWords(r.case_type)}</td>
                        <td className="px-3 py-2 text-right font-semibold text-slate-900">{fmt(r.total_cases)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Criminal Rankings</h3>
          <p className="text-xs text-slate-400 mt-0.5">Sorted by arrests, case volume and risk level.</p>
        </div>
        <div className="overflow-auto max-h-[360px]">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Criminal</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Thana</th>
                <th className="px-4 py-2 text-center">Arrests</th>
                <th className="px-4 py-2 text-center">Cases</th>
                <th className="px-4 py-2 text-center">Risk</th>
              </tr>
            </thead>
            <tbody>
              {isRankingLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : rankingRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">No ranking data for selected filters.</td>
                </tr>
              ) : (
                rankingRows.slice(0, 25).map((r) => (
                  <tr
                    key={r.criminal_id}
                    className="border-t border-slate-100 hover:bg-slate-50/80 cursor-pointer"
                    onClick={() => setSelectedCriminal(r)}
                  >
                    <td className="px-4 py-2.5 font-bold text-slate-700">#{r.overall_rank}</td>
                    <td className="px-4 py-2.5 text-slate-800">
                      <p className="font-semibold text-blue-700 hover:underline">{r.full_name}</p>
                      <p className="text-xs text-slate-400">{r.criminal_id}</p>
                    </td>
                    <td className="px-4 py-2.5 capitalize text-slate-600">{r.status}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.thana_name || "—"}</td>
                    <td className="px-4 py-2.5 text-center font-semibold text-slate-800">{fmt(r.arrest_count)}</td>
                    <td className="px-4 py-2.5 text-center font-semibold text-slate-800">{fmt(r.case_count)}</td>
                    <td className="px-4 py-2.5 text-center font-semibold text-red-700">{fmt(r.risk_level)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      </div>

    </div>
  );
}

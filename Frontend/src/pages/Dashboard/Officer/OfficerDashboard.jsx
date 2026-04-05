import getArrestRecordByThanaApi from "@/services/ArrestRecord/getArrestRecordByThanaApi";
import addArrestRecordApi from "@/services/ArrestRecord/addArrestRecordApi";
import { officerSignoutApi } from "@/services/authServices/signoutApi";
import getGDReportByAssignedOfficerApi from "@/services/GDReport/getGDReportByAssignedOfficerApi";
import getCriminalByNameApi from "@/services/Criminal/getCriminalByNameApi";
import { getUnreadNotificationCount } from "@/services/Notification/notificationApi";
import { acknowledgeSosAlert, getOfficerSosAlerts } from "@/services/SOS/sosApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ─── Config ─────────────────────────────────────────────── */
const gdStatusConfig = {
  submitted: { label: "Submitted",  color: "text-blue-700",  bg: "bg-blue-50",  dot: "bg-blue-700"  },
  assigned:  { label: "Assigned",   color: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-700" },
  approved:  { label: "Approved",   color: "text-green-700", bg: "bg-green-50", dot: "bg-green-700" },
  rejected:  { label: "Rejected",   color: "text-red-700",   bg: "bg-red-50",   dot: "bg-red-700"   },
};

const arrestStatusConfig = {
  in_custody:  { label: "In Custody",  color: "text-violet-700", bg: "bg-violet-50", dot: "bg-violet-700" },
  on_bail:     { label: "On Bail",     color: "text-amber-700",  bg: "bg-amber-50",  dot: "bg-amber-700"  },
  released:    { label: "Released",    color: "text-green-700",  bg: "bg-green-50",  dot: "bg-green-700"  },
  transferred: { label: "Transferred", color: "text-blue-700",   bg: "bg-blue-50",   dot: "bg-blue-700"   },
};

const custodyOptions = [
  { value: "in_custody",  label: "In Custody"  },
  { value: "on_bail",     label: "On Bail"     },
  { value: "released",    label: "Released"    },
  { value: "transferred", label: "Transferred" },
];

const gdTypeLabels = {
  theft: "Theft", lost_document: "Lost Document", missing_person: "Missing Person",
  accident: "Accident", assault: "Assault", robbery: "Robbery",
  fraud: "Fraud", domestic_violence: "Domestic Violence", property_dispute: "Property Dispute",
  suspicious_activity: "Suspicious Activity", threat: "Threat",
  noise_disturbance: "Noise Disturbance", other: "Other",
};

const gdBarColors = {
  submitted: "bg-blue-600",
  assigned:  "bg-amber-500",
  approved:  "bg-green-600",
  rejected:  "bg-red-500",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Badge ──────────────────────────────────────────────── */
function Badge({ status, config }) {
  const cfg = config[status] || { label: status, color: "text-slate-500", bg: "bg-slate-100", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[0.65rem] font-bold tracking-wide uppercase whitespace-nowrap ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─── StatCard ───────────────────────────────────────────── */
function StatCard({ value, label, colorClass = "text-slate-900", sub, isLoading }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
      {isLoading
        ? <div className="h-8 rounded-md bg-slate-100 w-1/2 mb-2 animate-pulse" />
        : <div className={`text-4xl font-extrabold leading-none tabular-nums ${colorClass}`}>{value}</div>
      }
      <div className="text-[0.68rem] text-slate-400 mt-1.5 uppercase tracking-widest font-semibold">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

/* ─── SkeletonRow ────────────────────────────────────────── */
function SkeletonRow({ cols }) {
  return (
    <tr>
      {[...Array(cols)].map((_, j) => (
        <td key={j} className="px-4 py-3.5">
          <div className="h-3 rounded bg-slate-100 animate-pulse" style={{ width: `${40 + (j * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

/* ─── Table Header Cell ──────────────────────────────────── */
function TH({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[0.65rem] font-bold tracking-widest uppercase text-slate-400">
      {children}
    </th>
  );
}

/* ─── Add Arrest Modal ───────────────────────────────────── */
function AddArrestModal({ thanaId, onClose, onSuccess }) {
  const queryClient = useQueryClient();
  const [nameQuery, setNameQuery] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [arrestDate, setArrestDate] = useState("");
  const [bailDueDate, setBailDueDate] = useState("");
  const [custodyStatus, setCustodyStatus] = useState("in_custody");
  const [caseReference, setCaseReference] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(nameQuery), 350);
    return () => clearTimeout(t);
  }, [nameQuery]);

  const { data: criminalData, isFetching: searching } = useQuery({
    queryKey: ["criminalByName", debouncedName],
    queryFn: () => getCriminalByNameApi(debouncedName),
    enabled: debouncedName.trim().length >= 2,
    staleTime: 60_000,
  });

  const criminals = criminalData?.data || [];

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { mutate: addRecord, isPending, isError } = useMutation({
    mutationFn: addArrestRecordApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["arrestRecords", thanaId]);
      onSuccess?.();
      onClose();
    },
  });

  const isValid = selectedCriminal && arrestDate;

  const handleSubmit = () => {
    if (!isValid) return;
    addRecord({
      criminal_id: selectedCriminal.criminal_id,
      arrest_date: arrestDate,
      bail_due_date: bailDueDate || null,
      custody_status: custodyStatus,
      thana_id: thanaId,
      case_reference: caseReference.trim() || null,
    });
  };

  const inputCls = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[inherit] transition";
  const labelCls = "block text-[0.67rem] font-bold tracking-widest uppercase text-slate-500 mb-1.5";

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">New Record</p>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Add Arrest Record</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition flex items-center justify-center text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 max-h-[70vh] overflow-y-auto space-y-5">

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800 text-sm">
              Failed to add record. Please try again.
            </div>
          )}

          {/* Criminal search */}
          <div ref={dropdownRef}>
            <label className={labelCls}>
              Criminal Name <span className="text-red-500 normal-case tracking-normal font-normal">*</span>
            </label>
            <div className="relative">
              <input
                className={inputCls}
                value={selectedCriminal ? selectedCriminal.full_name : nameQuery}
                onChange={(e) => {
                  setSelectedCriminal(null);
                  setNameQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => nameQuery.length >= 2 && setDropdownOpen(true)}
                placeholder="Type name to search criminals…"
                autoComplete="off"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
              )}
              {selectedCriminal && (
                <button
                  onClick={() => { setSelectedCriminal(null); setNameQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base leading-none"
                >×</button>
              )}
            </div>

            {/* Dropdown */}
            {dropdownOpen && !selectedCriminal && criminals.length > 0 && (
              <div className="absolute z-50 w-full max-w-[468px] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                {criminals.map((c) => (
                  <div
                    key={c.criminal_id}
                    onClick={() => { setSelectedCriminal(c); setNameQuery(c.full_name); setDropdownOpen(false); }}
                    className="px-4 py-3 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center hover:bg-slate-50 transition"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{c.full_name}</div>
                      <div className="font-mono text-[0.7rem] text-slate-400 mt-0.5">{c.criminal_id}</div>
                    </div>
                    {c.status && (
                      <span className="text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                        {c.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {dropdownOpen && !selectedCriminal && debouncedName.length >= 2 && !searching && criminals.length === 0 && (
              <div className="absolute z-50 w-full max-w-[468px] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-4 text-sm text-center text-slate-400">
                No criminals found for "{debouncedName}"
              </div>
            )}
          </div>

          {/* Selected criminal info */}
          {selectedCriminal && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex justify-between items-center">
              <div>
                <p className="text-[0.68rem] text-blue-600 font-bold uppercase tracking-wide">Selected Criminal</p>
                <p className="font-bold text-blue-900 text-sm mt-0.5">{selectedCriminal.full_name}</p>
                <p className="font-mono text-[0.68rem] text-blue-500">{selectedCriminal.criminal_id}</p>
              </div>
              {selectedCriminal.risk_level != null && (
                <div className="text-center">
                  <div className={`text-2xl font-extrabold ${
                    selectedCriminal.risk_level >= 7 ? "text-red-600" :
                    selectedCriminal.risk_level >= 4 ? "text-amber-600" : "text-green-600"
                  }`}>{selectedCriminal.risk_level}</div>
                  <div className="text-[0.62rem] text-slate-500 uppercase tracking-wide">Risk</div>
                </div>
              )}
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Arrest Date <span className="text-red-500 normal-case tracking-normal font-normal">*</span>
              </label>
              <input className={inputCls} type="date" value={arrestDate} onChange={e => setArrestDate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>
                Bail Due Date <span className="text-slate-400 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <input className={inputCls} type="date" value={bailDueDate} onChange={e => setBailDueDate(e.target.value)} min={arrestDate || undefined} />
            </div>
          </div>

          {/* Custody Status */}
          <div>
            <label className={labelCls}>Custody Status</label>
            <select className={`${inputCls} cursor-pointer`} value={custodyStatus} onChange={e => setCustodyStatus(e.target.value)}>
              {custodyOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Case Reference */}
          <div>
            <label className={labelCls}>
              Case Reference <span className="text-slate-400 normal-case tracking-normal font-normal">(optional)</span>
            </label>
            <input className={inputCls} value={caseReference} onChange={e => setCaseReference(e.target.value)} placeholder="e.g. CF-2024-DHK-001" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm font-semibold hover:bg-slate-100 transition"
          >Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !isValid}
            className={`flex-[2] py-2.5 rounded-lg text-sm font-bold transition ${
              isValid && !isPending
                ? "bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isPending ? "Saving…" : "Add Arrest Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */
export default function OfficerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
    const openOfficerModal = (path) => {
      navigate(path, {
        state: {
          modal: true,
          backgroundLocation: location,
        },
      });
    };
  const { user } = userStore();
  const officerId = user?.officer_id || "";
  const thanaId   = user?.thana_id   || "";
  const seenSosIdsRef = useRef(new Set());
  const audioUnlockedRef = useRef(false);
  const pendingAlarmRef = useRef(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("gd");

  const { data: gdReportsData, isLoading: gdLoading } = useQuery({
    queryKey: ["gdReportsByOfficer", officerId],
    queryFn: () => getGDReportByAssignedOfficerApi(officerId),
    enabled: !!officerId,
  });

  const { data: arrestRecordsData, isLoading: arrestLoading } = useQuery({
    queryKey: ["arrestRecords", thanaId],
    queryFn: () => getArrestRecordByThanaApi(thanaId),
    enabled: !!thanaId,
  });

  const { mutate: signOut } = useMutation({
    mutationFn: officerSignoutApi,
    onSuccess: () => navigate("/"),
    onError: () => alert("Error signing out. Please try again."),
  });

  const gdReports     = gdReportsData?.data     || [];
  const arrestRecords = arrestRecordsData?.data || [];
  const { data: unreadNotificationData } = useQuery({
    queryKey: ["officerNotificationUnreadCount"],
    queryFn: getUnreadNotificationCount,
  });
  const { data: sosAlertsData } = useQuery({
    queryKey: ["officerSosAlerts"],
    queryFn: getOfficerSosAlerts,
    enabled: !!officerId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
  const { mutate: acknowledgeSos, isPending: isAcknowledgingSos } = useMutation({
    mutationFn: acknowledgeSosAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officerSosAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["officerNotificationUnreadCount"] });
    },
  });
  const unreadNotificationCount = Number(unreadNotificationData?.data?.unread_count || 0);
  const sosAlerts = (sosAlertsData?.data || []).filter(
    (alert) => !thanaId || String(alert?.thana_id || "") === String(thanaId)
  );
  const pendingGDs    = gdReports.filter(r => r.status === "submitted" || r.status === "assigned");
  const inCustody     = arrestRecords.filter(r => r.custody_status === "in_custody");
  const gdCounts      = gdReports.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});

  const playUrgentAlarm = () => {
    if (!audioUnlockedRef.current) {
      pendingAlarmRef.current = true;
      return;
    }

    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const now = audioContext.currentTime;
    const duration = 5;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "square";
    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    // Siren sweep between low/high tones for the full 5s window.
    const sampleCount = 400;
    const curve = new Float32Array(sampleCount);
    for (let i = 0; i < sampleCount; i += 1) {
      const t = i / (sampleCount - 1);
      curve[i] = 720 + 430 * Math.sin(2 * Math.PI * 4 * t);
    }
    oscillator.frequency.setValueCurveAtTime(curve, now, duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    oscillator.start(now);
    oscillator.stop(now + duration);

    setTimeout(() => {
      audioContext.close().catch(() => {});
    }, 5400);
  };

  const buildMapEmbedUrl = (latitude, longitude) => {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

    // Use explicit high zoom to avoid broad-area fallback and keep dispatch focus tight.
    return `https://maps.google.com/maps?q=${lat},${lon}&z=20&output=embed`;
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const unlockAudio = () => {
      audioUnlockedRef.current = true;
      if (pendingAlarmRef.current) {
        pendingAlarmRef.current = false;
        playUrgentAlarm();
      }
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  useEffect(() => {
    if (!sosAlerts.length) return;

    let hasNewAssignedAlert = false;

    sosAlerts.forEach((alert) => {
      if (!seenSosIdsRef.current.has(alert.sos_id)) {
        seenSosIdsRef.current.add(alert.sos_id);
        if (alert.status === "assigned") {
          hasNewAssignedAlert = true;
        }
      }
    });

    if (hasNewAssignedAlert) {
      playUrgentAlarm();
    }
  }, [sosAlerts]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* ── Top nav ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">Black Vein Oracle</div>
              <div className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-widest">Officer Portal</div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="text-right mr-1">
              <div className="text-sm font-bold text-slate-900 leading-none">{user?.full_name || "Officer"}</div>
              <div className="text-[0.65rem] text-slate-400 font-mono mt-0.5">{officerId}</div>
            </div>

            {/* Profile button */}
            <button
              onClick={() => navigate(`/officer/dashboard/profile`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-100 hover:border-slate-300 transition"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Profile
            </button>

            {/* Notifications */}
            <button
              onClick={() => openOfficerModal("/officer/dashboard/notifications")}
              className="relative w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition flex items-center justify-center"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Sign out */}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-red-600 text-xs font-semibold hover:bg-red-50 hover:border-red-300 transition"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Thana: <span className="font-mono text-slate-600">{thanaId || "—"}</span>
          </p>
        </div>

        <section className="mb-8 bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[0.65rem] font-bold tracking-widest uppercase text-red-700">Emergency Dispatch</p>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                Assigned SOS Alerts
              </h2>
            </div>
            <span className="text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
              Active: {sosAlerts.length}
            </span>
          </div>

          {sosAlerts.length === 0 ? (
            <p className="text-sm text-slate-600">No active SOS assignment right now.</p>
          ) : (
            <div className="space-y-3">
              {sosAlerts.map((alert) => (
                <div key={alert.sos_id} className="bg-white border border-red-100 rounded-lg p-3 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      SOS #{alert.sos_id} • {alert.user_name} ({alert.user_id})
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{alert.user_phone || "No phone"} • {alert.user_address || "No address"}</p>
                    <p className="text-xs text-slate-600 mt-1">{alert.description || "No description provided."}</p>
                    {Number.isFinite(Number(alert.latitude)) && Number.isFinite(Number(alert.longitude)) && (
                      <p className="text-xs text-slate-600 mt-1">
                        Coordinates: {Number(alert.latitude).toFixed(6)}, {Number(alert.longitude).toFixed(6)}
                      </p>
                    )}
                    {alert.detected_address && (
                      <p className="text-xs text-slate-600 mt-1">Location: {alert.detected_address}</p>
                    )}
                    {buildMapEmbedUrl(alert.latitude, alert.longitude) && (
                      <div className="mt-2 overflow-hidden rounded-md border border-slate-200">
                        <iframe
                          title={`officer-sos-map-${alert.sos_id}`}
                          src={buildMapEmbedUrl(alert.latitude, alert.longitude)}
                          className="w-full h-40"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1">
                      {alert.thana_name} • {new Date(alert.created_at).toLocaleString()} • {alert.status}
                    </p>
                  </div>

                  {alert.status === "assigned" && (
                    <button
                      onClick={() => acknowledgeSos(alert.sos_id)}
                      disabled={isAcknowledgingSos}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 disabled:opacity-60"
                    >
                      {isAcknowledgingSos ? "Updating..." : "Acknowledge"}
                    </button>
                  )}

                  {alert.status === "acknowledged" && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 h-fit">
                      Acknowledged
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard value={gdReports.length}     label="Total GDs"      isLoading={gdLoading} />
          <StatCard value={pendingGDs.length}    label="Pending GDs"    colorClass="text-amber-600" isLoading={gdLoading} />
          <StatCard value={arrestRecords.length} label="Arrest Records" isLoading={arrestLoading} />
          <StatCard value={inCustody.length}     label="In Custody"     colorClass="text-violet-600" isLoading={arrestLoading} />
        </div>

        {/* GD breakdown bar */}
        {!gdLoading && gdReports.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 mb-8 shadow-sm">
            <p className="text-[0.65rem] font-bold tracking-widest uppercase text-slate-400 mb-4">GD Status Breakdown</p>
            <div className="flex gap-6 flex-wrap">
              {Object.entries(gdStatusConfig).map(([key, cfg]) => (
                <div key={key} className="flex-1 min-w-[90px]">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-slate-500 font-medium">{cfg.label}</span>
                    <span className={`text-xs font-extrabold ${cfg.color}`}>{gdCounts[key] || 0}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${gdBarColors[key]}`}
                      style={{ width: `${((gdCounts[key] || 0) / gdReports.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab switcher + action */}
        <div className="flex justify-between items-center mb-5">
          <div className="bg-slate-100 rounded-lg p-1 inline-flex gap-1">
            {[
              { id: "gd",      label: `GD Reports (${gdReports.length})`       },
              { id: "arrests", label: `Arrest Records (${arrestRecords.length})` },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === id
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >{label}</button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-200 transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Arrest Record
          </button>
        </div>

        {/* ── GD Reports Table ── */}
        {activeTab === "gd" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["GD ID", "Type", "Location", "Date", "Status", ""].map(h => <TH key={h}>{h}</TH>)}
                </tr>
              </thead>
              <tbody>
                {gdLoading
                  ? [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={6} />)
                  : gdReports.length === 0
                    ? <tr><td colSpan={6} className="py-12 text-center text-sm text-slate-400">No GD reports assigned.</td></tr>
                    : gdReports.map((r, i) => (
                        <tr
                          key={r.gd_id}
                          className={`hover:bg-slate-50 transition ${i < gdReports.length - 1 ? "border-b border-slate-50" : ""}`}
                        >
                          <td className="px-4 py-3.5 font-mono text-xs text-blue-700 font-semibold">#{r.gd_id}</td>
                          <td className="px-4 py-3.5 text-slate-600">{gdTypeLabels[r.gd_type] || r.gd_type}</td>
                          <td className="px-4 py-3.5 text-slate-500 max-w-[200px] truncate">{r.incident_location || "—"}</td>
                          <td className="px-4 py-3.5 text-slate-400 text-xs">{formatDate(r.submitted_at)}</td>
                          <td className="px-4 py-3.5"><Badge status={r.status} config={gdStatusConfig} /></td>
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => navigate(`/officer/dashboard/gd-list/${r.gd_id}`)}
                              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[0.7rem] font-semibold text-slate-500 hover:bg-slate-100 transition"
                            >View →</button>
                          </td>
                        </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        )}

        {/* ── Arrest Records Table ── */}
        {activeTab === "arrests" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Arrest ID", "Criminal", "Arrest Date", "Bail Due", "Status", ""].map(h => <TH key={h}>{h}</TH>)}
                </tr>
              </thead>
              <tbody>
                {arrestLoading
                  ? [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={6} />)
                  : arrestRecords.length === 0
                    ? <tr><td colSpan={6} className="py-12 text-center text-sm text-slate-400">No arrest records found.</td></tr>
                    : arrestRecords.map((r, i) => (
                        <tr
                          key={r.arrest_id}
                          className={`hover:bg-slate-50 transition ${i < arrestRecords.length - 1 ? "border-b border-slate-50" : ""}`}
                        >
                          <td className="px-4 py-3.5 font-mono text-xs text-blue-700 font-semibold">{r.arrest_id}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-900">{r.criminal_name || "—"}</td>
                          <td className="px-4 py-3.5 text-slate-500 text-xs">{formatDate(r.arrest_date)}</td>
                          <td className="px-4 py-3.5 text-slate-400 text-xs">{formatDate(r.bail_due_date)}</td>
                          <td className="px-4 py-3.5"><Badge status={r.custody_status} config={arrestStatusConfig} /></td>
                          <td className="px-4 py-3.5">
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => navigate(`/officer/dashboard/arrest-record-details/${r.arrest_id}`)}
                                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[0.7rem] font-semibold text-slate-500 hover:bg-slate-100 transition"
                              >View →</button>
                              {r.criminal_id && (
                                <button
                                  onClick={() => navigate(`/officer/dashboard/criminal-profile/${r.criminal_id}`)}
                                  className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-[0.7rem] font-semibold text-blue-700 hover:bg-blue-100 transition"
                                >Profile</button>
                              )}
                            </div>
                          </td>
                        </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Arrest Modal */}
      {showAddModal && (
        <AddArrestModal
          thanaId={thanaId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setActiveTab("arrests")}
        />
      )}
    </div>
  );
}
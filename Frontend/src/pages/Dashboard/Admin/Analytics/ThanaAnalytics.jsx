import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import getThanaAnalyticsApi from "@/services/Thana/getThanaAnalyticsApi";
import getThanaByNameApi from "@/services/Thana/getThanaByNameApi";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
} from "recharts";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  blue:   "#2563EB",
  indigo: "#4F46E5",
  violet: "#7C3AED",
  teal:   "#0D9488",
  green:  "#16A34A",
  amber:  "#D97706",
  red:    "#DC2626",
  rose:   "#E11D48",
  slate:  "#475569",
  sky:    "#0284C7",
};

const PIE_COLORS    = [C.blue, C.teal, C.green, C.amber, C.red, C.violet, C.sky, C.rose, C.indigo, C.slate];
const RISK_COLORS   = { low: C.green, medium: C.amber, high: C.red, critical: "#7F1D1D" };
const STATUS_COLORS = { open: C.amber, closed: C.green, under_investigation: C.blue };

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n ?? 0).toLocaleString();
const pct = (n) => `${Number(n ?? 0).toFixed(1)}%`;
const cap = (s) => (s ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const toTypeData = (breakdown) =>
  Object.entries(breakdown ?? {})
    .map(([name, value]) => ({ name: cap(name), value: Number(value) }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

// ─── Shared field style ───────────────────────────────────────────────────────
const fieldStyle = {
  padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1",
  fontSize: 13, color: "#334155", outline: "none", width: "100%",
  boxSizing: "border-box", background: "#fff",
};

// ─── Spinners ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <>
      <style>{`
        @keyframes _spin { to { transform: rotate(360deg); } }
        ._sp { width:14px; height:14px; border:2px solid #fff;
               border-top-color:transparent; border-radius:50%;
               display:inline-block; animation:_spin .7s linear infinite; }
      `}</style>
      <span className="_sp" />
    </>
  );
}

function MiniSpinner() {
  return (
    <>
      <style>{`
        @keyframes _mspin { to { transform: rotate(360deg); } }
        ._msp { width:12px; height:12px; border:2px solid #CBD5E1;
                border-top-color:#2563EB; border-radius:50%;
                display:inline-block; animation:_mspin .6s linear infinite; flex-shrink:0; }
      `}</style>
      <span className="_msp" />
    </>
  );
}

// ─── ThanaSearchInput ─────────────────────────────────────────────────────────
function ThanaSearchInput({ value, onChange, placeholder = "Search thana…" }) {
  const [query,     setQuery]   = useState("");
  const [results,   setResults] = useState([]);
  const [loading,   setLoading] = useState(false);
  const [open,      setOpen]    = useState(false);
  const [focused,   setFocused] = useState(false);
  const debounceRef             = useRef(null);
  const containerRef            = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res  = await getThanaByNameApi(q.trim());
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : res?.success === false
            ? []
            : [];
      setResults(list);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (!q) { onChange(null); setResults([]); setOpen(false); }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 300);
  };

  const handleSelect = (thana) => {
    onChange(thana);
    setQuery(thana.thana_name);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery(""); setResults([]); setOpen(false); onChange(null);
  };

  const displayValue = value && !focused ? value.thana_name : query;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
          fontSize: 14, pointerEvents: "none", color: "#94A3B8",
        }}>🔎</span>

        <input
          type="text"
          placeholder={value ? value.thana_name : placeholder}
          value={displayValue}
          onChange={handleInput}
          onFocus={() => { setFocused(true); if (results.length) setOpen(true); }}
          onBlur={() => setFocused(false)}
          style={{
            ...fieldStyle,
            paddingLeft: 30,
            paddingRight: value ? 30 : 12,
            borderColor: open ? C.blue : focused ? "#93C5FD" : "#CBD5E1",
            boxShadow: open ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
        />

        {value && (
          <button
            onMouseDown={handleClear}
            style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "#94A3B8", fontSize: 14, lineHeight: 1, padding: 2,
            }}
            title="Clear selection"
          >✕</button>
        )}
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #CBD5E1", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
          zIndex: 1000, maxHeight: 260, overflowY: "auto",
        }}>
          {loading && (
            <div style={{ padding: "12px 14px", fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 8 }}>
              <MiniSpinner /> Searching…
            </div>
          )}

          {!loading && results.length > 0 && results.map((thana, i) => (
            <ThanaOption
              key={thana.thana_id ?? thana.id ?? i}
              thana={thana}
              isSelected={value?.thana_id === thana.thana_id || value?.id === thana.id}
              onSelect={handleSelect}
            />
          ))}

          {!loading && results.length === 0 && query.trim() && (
            <div style={{ padding: "14px", fontSize: 13, color: "#94A3B8", textAlign: "center" }}>
              No thanas found for "<strong>{query}</strong>"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ThanaOption({ thana, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseDown={() => onSelect(thana)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 14px", cursor: "pointer", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        background: isSelected ? "#EFF6FF" : hovered ? "#F8FAFC" : "#fff",
        borderBottom: "1px solid #F1F5F9",
        transition: "background 0.1s",
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#1D4ED8" : "#0F172A" }}>
          {thana.thana_name}
        </div>
        {thana.district && (
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{thana.district}</div>
        )}
      </div>
      {isSelected && <span style={{ fontSize: 14, color: C.blue }}>✓</span>}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function StatCard({ label, value, color = C.blue, icon }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
      padding: "20px 24px", display: "flex", alignItems: "center", gap: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{title}</h2>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
      padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", ...style,
    }}>
      {children}
    </div>
  );
}

function DonutChart({ title, data }) {
  if (!data?.length) return (
    <Card style={{ textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
      <SectionTitle title={title} />No data
    </Card>
  );
  return (
    <Card>
      <SectionTitle title={title} />
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
            dataKey="value" paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => fmt(v)} />
          <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

function HorizBarChart({ title, data, color = C.blue }) {
  if (!data?.length) return (
    <Card style={{ textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
      <SectionTitle title={title} />No data
    </Card>
  );
  const top = data.slice(0, 10);
  return (
    <Card>
      <SectionTitle title={title} />
      <ResponsiveContainer width="100%" height={top.length * 38 + 40}>
        <BarChart data={top} layout="vertical" margin={{ left: 12, right: 24, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={fmt} />
          <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => fmt(v)} />
          <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function RiskRadial({ data }) {
  const radialData = [
    { name: "Low",      value: data.low,      fill: RISK_COLORS.low      },
    { name: "Medium",   value: data.medium,   fill: RISK_COLORS.medium   },
    { name: "High",     value: data.high,     fill: RISK_COLORS.high     },
    { name: "Critical", value: data.critical, fill: RISK_COLORS.critical },
  ].filter(d => d.value > 0);

  if (!radialData.length) return (
    <Card style={{ textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
      <SectionTitle title="Criminal Risk Levels" />No data
    </Card>
  );
  return (
    <Card>
      <SectionTitle title="Criminal Risk Distribution" />
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={90}
          barSize={16} data={radialData} startAngle={180} endAngle={0}>
          <RadialBar dataKey="value" cornerRadius={4} label={{ position: "insideStart", fill: "#fff", fontSize: 11 }} />
          <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => fmt(v)} />
        </RadialBarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function StatusBar({ label, counts, colorMap }) {
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
        <span style={{ fontWeight: 600, color: "#334155" }}>{label}</span>
        <span style={{ color: "#64748B" }}>{fmt(total)} total</span>
      </div>
      <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 10 }}>
        {Object.entries(counts).filter(([, v]) => v > 0).map(([key, val]) => (
          <div key={key} title={`${cap(key)}: ${fmt(val)}`}
            style={{ width: `${(val / total) * 100}%`, background: colorMap[key] ?? C.slate }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
        {Object.entries(counts).filter(([, v]) => v > 0).map(([key, val]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748B" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colorMap[key] ?? C.slate }} />
            {cap(key)}: <strong>{fmt(val)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThanaCard({ item }) {
  const { thana, officers, gd_reports, cases, arrests, criminals } = item;
  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
      padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{thana.thana_name}</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{thana.district}</div>
        </div>
        {thana.head_officer && (
          <div style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 20, flexShrink: 0, marginLeft: 8,
            background: "#DCFCE7",
            color: "#166534", fontWeight: 600,
          }}>
            {thana.head_officer.full_name}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Officers",   value: officers.total,   color: C.blue   },
          { label: "Cases",      value: cases.total,      color: C.violet },
          { label: "GD Reports", value: gd_reports.total, color: C.teal   },
          { label: "Arrests",    value: arrests.total,    color: C.amber  },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: "center", padding: "8px 4px", background: color + "08", borderRadius: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{fmt(value)}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{label}</div>
          </div>
        ))}
      </div>

      <StatusBar label="Cases"
        counts={{ open: cases.open, under_investigation: cases.under_investigation, closed: cases.closed }}
        colorMap={STATUS_COLORS} />
      <StatusBar label="GD Reports"
        counts={{ submitted: gd_reports.submitted, assigned: gd_reports.assigned, approved: gd_reports.approved, rejected: gd_reports.rejected }}
        colorMap={{ submitted: C.sky, assigned: C.indigo, approved: C.green, rejected: C.red }} />

      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: "#64748B" }}>
          Case closure: <strong style={{ color: C.green }}>{pct(cases.closure_rate)}</strong>
        </div>
        <div style={{ fontSize: 12, color: "#64748B" }}>
          GD approval: <strong style={{ color: C.teal }}>{pct(gd_reports.approval_rate)}</strong>
        </div>
        <div style={{ fontSize: 12, color: "#64748B" }}>
          Wanted: <strong style={{ color: C.red }}>{fmt(criminals.wanted)}</strong>
        </div>
      </div>
    </div>
  );
}

// ─── Filters Panel ────────────────────────────────────────────────────────────
function FiltersPanel({ filters, onChange, onReset, onApply, isBusy, selectedThana, onThanaChange }) {
  const input = (key, placeholder, type = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      value={filters[key] ?? ""}
      onChange={(e) => onChange(key, e.target.value || undefined)}
      style={fieldStyle}
    />
  );

  const select = (key, placeholder, options) => (
    <select
      value={filters[key] ?? ""}
      onChange={(e) => onChange(key, e.target.value || undefined)}
      style={{ ...fieldStyle, cursor: "pointer" }}
    >
      <option value="">{placeholder}</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );

  return (
    <Card style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>🔍 Filters</h3>
        <button
          onClick={() => { onReset(); onThanaChange(null); }}
          style={{
            fontSize: 12, padding: "5px 14px", borderRadius: 8,
            border: "1px solid #CBD5E1", background: "#fff", color: "#64748B",
            cursor: "pointer", fontWeight: 600,
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
        {input("search", "Search thana, email, phone…")}

        {/* Thana live search */}
        <ThanaSearchInput
          value={selectedThana}
          onChange={onThanaChange}
          placeholder="Search by thana name…"
        />

        {/* District dropdown */}
        <select
          value={filters.district ?? ""}
          onChange={(e) => onChange("district", e.target.value || undefined)}
          style={{ ...fieldStyle, cursor: "pointer" }}
        >
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        {select("caseStatus", "Case Status", [
          ["open", "Open"], ["closed", "Closed"], ["under_investigation", "Under Investigation"],
        ])}
        {select("gdStatus", "GD Status", [
          ["submitted", "Submitted"], ["assigned", "Assigned"],
          ["approved", "Approved"],  ["rejected", "Rejected"],
        ])}
        {select("criminalStatus", "Criminal Status", [
          ["in_custody", "In Custody"], ["on_bail", "On Bail"],
          ["wanted", "Wanted"],         ["escaped", "Escaped"],
        ])}
        {input("caseFrom", "Cases from", "date")}
        {input("caseTo",   "Cases to",   "date")}
      </div>

      {/* Active filter badges */}
      {(selectedThana || filters.district) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {selectedThana && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#EFF6FF", border: "1px solid #BFDBFE",
              borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#1D4ED8",
            }}>
              <span>🏛️</span>
              <strong>{selectedThana.thana_name}</strong>
              {selectedThana.district && <span style={{ color: "#93C5FD" }}>· {selectedThana.district}</span>}
              <button
                onClick={() => onThanaChange(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#93C5FD", fontSize: 13, padding: 0, lineHeight: 1 }}
              >✕</button>
            </div>
          )}
          {filters.district && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#F0FDF4", border: "1px solid #BBF7D0",
              borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#166534",
            }}>
              <span>📍</span>
              <strong>{filters.district}</strong>
              <button
                onClick={() => onChange("district", undefined)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#86EFAC", fontSize: 13, padding: 0, lineHeight: 1 }}
              >✕</button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onApply}
          disabled={isBusy}
          style={{
            padding: "10px 32px", borderRadius: 8, border: "none",
            background: isBusy ? "#93C5FD" : C.blue,
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: isBusy ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 8,
            transition: "background 0.15s",
          }}
        >
          {isBusy ? <><Spinner /> Loading…</> : <>📊 Get Analytics</>}
        </button>
      </div>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ThanaAnalytics() {
  const navigate = useNavigate();
  const location = useLocation();
  const [draftFilters,     setDraftFilters]     = useState({});
  const [committedFilters, setCommittedFilters] = useState({});
  const [selectedThana,    setSelectedThana]    = useState(null);
  const [activeTab,        setActiveTab]        = useState("overview");

  const handleFilterChange = (key, val) =>
    setDraftFilters((prev) => ({ ...prev, [key]: val }));

  const handleThanaChange = (thana) => {
    setSelectedThana(thana);
    setDraftFilters((prev) => ({
      ...prev,
      thanaId:  thana?.thana_id ?? undefined,
      district: thana?.district ?? undefined,
    }));
  };

  const handleReset = () => {
    setDraftFilters({});
    setSelectedThana(null);
    setCommittedFilters(null);
  };

  const handleApply = () => setCommittedFilters({ ...draftFilters });

  const { data: response, isLoading, isFetching, isError } = useQuery({
    queryKey: ["thanaAnalytics", committedFilters],
    queryFn:  () => getThanaAnalyticsApi(committedFilters ?? {}),
    enabled:  true,
    staleTime: 60_000,
  });

  const isBusy    = isLoading || isFetching;
  const analytics = response?.data ?? {};
  const summary   = analytics.summary ?? {};
  const rows      = analytics.data    ?? [];
  const hasData   = committedFilters !== null && !isBusy && !isError;

  const agg = useMemo(() => {
    const gdType = {}, caseType = {}, officerRank = {};
    const riskBreakdown = { low: 0, medium: 0, high: 0, critical: 0 };
    const caseCounts    = { open: 0, closed: 0, under_investigation: 0 };
    const arrestCounts  = { in_custody: 0, on_bail: 0, released: 0, transferred: 0 };

    rows.forEach(({ gd_reports, cases, officers, criminals, arrests }) => {
      Object.entries(gd_reports?.type_breakdown ?? {}).forEach(([k, v]) => { gdType[k] = (gdType[k] ?? 0) + Number(v); });
      Object.entries(cases?.type_breakdown ?? {}).forEach(([k, v]) => { caseType[k] = (caseType[k] ?? 0) + Number(v); });

      officerRank.constables         = (officerRank.constables         ?? 0) + officers.constables;
      officerRank.sub_inspectors     = (officerRank.sub_inspectors     ?? 0) + officers.sub_inspectors;
      officerRank.inspectors         = (officerRank.inspectors         ?? 0) + officers.inspectors;
      officerRank.officers_in_charge = (officerRank.officers_in_charge ?? 0) + officers.officers_in_charge;

      riskBreakdown.low      += criminals.risk_breakdown.low;
      riskBreakdown.medium   += criminals.risk_breakdown.medium;
      riskBreakdown.high     += criminals.risk_breakdown.high;
      riskBreakdown.critical += criminals.risk_breakdown.critical;

      caseCounts.open                += cases.open;
      caseCounts.closed              += cases.closed;
      caseCounts.under_investigation += cases.under_investigation;

      arrestCounts.in_custody  += arrests.in_custody;
      arrestCounts.on_bail     += arrests.on_bail;
      arrestCounts.released    += arrests.released;
      arrestCounts.transferred += arrests.transferred;
    });

    return { gdType, caseType, officerRank, riskBreakdown, caseCounts, arrestCounts };
  }, [rows]);

  const tabs = [
    { key: "overview",  label: "Overview"   },
    { key: "cases",     label: "Cases"      },
    { key: "gd",        label: "GD Reports" },
    { key: "criminals", label: "Criminals"  },
    { key: "thanas",    label: "Thanas"     },
  ];

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

  return (
    <div className="space-y-6 bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl shadow-slate-950/20">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-blue-300 font-bold">Admin Analytics</p>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Thana Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Station-level operations, risk and performance analytics.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/analytics", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Criminal
          </button>
          <button
            onClick={() => navigate("/analytics/officer", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Officer
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Thana</button>
          <button
            onClick={() => navigate("/analytics/jail", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Jail
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {hasData && rows.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                <p className="text-slate-500 text-xs">Avg. Case Closure</p>
                <p className="font-bold text-green-700 mt-0.5">{pct(summary.average_case_closure_rate)}</p>
              </div>
              <div className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2">
                <p className="text-slate-500 text-xs">Avg. GD Approval</p>
                <p className="font-bold text-teal-700 mt-0.5">{pct(summary.average_gd_approval_rate)}</p>
              </div>
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                <p className="text-slate-500 text-xs">Avg. Risk Level</p>
                <p className="font-bold text-red-700 mt-0.5">{Number(summary.average_criminal_risk_level ?? 0).toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Filters ── */}
        <FiltersPanel
          filters={draftFilters}
          onChange={handleFilterChange}
          onReset={handleReset}
          onApply={handleApply}
          isBusy={isBusy}
          selectedThana={selectedThana}
          onThanaChange={handleThanaChange}
        />

        {/* ── Loading ── */}
        {isBusy && committedFilters !== null && (
          <div style={{ textAlign: "center", padding: 64, color: "#64748B", fontSize: 15 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            Fetching analytics…
          </div>
        )}

        {/* ── Error ── */}
        {isError && !isBusy && (
          <div style={{ textAlign: "center", padding: 64, color: C.red, fontSize: 15 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            Failed to load analytics. Please try again.
          </div>
        )}

        {/* ── Empty result ── */}
        {hasData && rows.length === 0 && (
          <div style={{ textAlign: "center", padding: 64, color: "#94A3B8", fontSize: 15 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            No thanas match the selected filters.
          </div>
        )}

        {/* ── Main content ── */}
        {hasData && rows.length > 0 && (
          <>
            {/* Summary stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
              <StatCard label="Total Thanas"    value={fmt(summary.total_thanas)}        icon="🏛️" color={C.blue}   />
              <StatCard label="Total Officers"  value={fmt(summary.total_officers)}       icon="👮" color={C.indigo} />
              <StatCard label="Total Cases"     value={fmt(summary.total_cases)}          icon="📁" color={C.violet} />
              <StatCard label="GD Reports"      value={fmt(summary.total_gd_reports)}     icon="📋" color={C.teal}   />
              <StatCard label="Total Arrests"   value={fmt(summary.total_arrests)}        icon="⚖️" color={C.amber}  />
              <StatCard label="Total Criminals" value={fmt(summary.total_criminals)}      icon="🔍" color={C.red}    />
              <StatCard label="Bail Records"    value={fmt(summary.total_bail_records)}   icon="🪪" color={C.sky}    />
              <StatCard label="Incarcerations"  value={fmt(summary.total_incarcerations)} icon="🏢" color={C.slate}  />
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #E2E8F0", flexWrap: "wrap" }}>
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                  padding: "10px 18px", fontSize: 13, fontWeight: 600,
                  border: "none", background: "none", cursor: "pointer",
                  color: activeTab === t.key ? C.blue : "#64748B",
                  borderBottom: activeTab === t.key ? `2px solid ${C.blue}` : "2px solid transparent",
                  marginBottom: -1,
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
                <DonutChart title="Officer Ranks" data={[
                  { name: "Constables",     value: agg.officerRank.constables },
                  { name: "Sub Inspectors", value: agg.officerRank.sub_inspectors },
                  { name: "Inspectors",     value: agg.officerRank.inspectors },
                  { name: "OCs",            value: agg.officerRank.officers_in_charge },
                ].filter(d => d.value > 0)} />
                <DonutChart title="Case Status" data={[
                  { name: "Open",               value: agg.caseCounts.open },
                  { name: "Under Investigation", value: agg.caseCounts.under_investigation },
                  { name: "Closed",             value: agg.caseCounts.closed },
                ].filter(d => d.value > 0)} />
                <DonutChart title="Arrest Custody Status" data={[
                  { name: "In Custody",  value: agg.arrestCounts.in_custody  },
                  { name: "On Bail",     value: agg.arrestCounts.on_bail     },
                  { name: "Released",    value: agg.arrestCounts.released    },
                  { name: "Transferred", value: agg.arrestCounts.transferred },
                ].filter(d => d.value > 0)} />
                <RiskRadial data={agg.riskBreakdown} />
              </div>
            )}

            {/* ── Cases ── */}
            {activeTab === "cases" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20 }}>
                <HorizBarChart title="Cases by Type" data={toTypeData(agg.caseType)} color={C.violet} />
                <DonutChart title="Case Status Distribution" data={[
                  { name: "Open",               value: agg.caseCounts.open },
                  { name: "Under Investigation", value: agg.caseCounts.under_investigation },
                  { name: "Closed",             value: agg.caseCounts.closed },
                ].filter(d => d.value > 0)} />
                <Card style={{ gridColumn: "1 / -1" }}>
                  <SectionTitle title="Cases by Thana" subtitle="Top 15 thanas by total cases" />
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart
                      data={[...rows]
                        .sort((a, b) => b.cases.total - a.cases.total)
                        .slice(0, 15)
                        .map(r => ({
                          name: r.thana.thana_name,
                          Open: r.cases.open,
                          Investigation: r.cases.under_investigation,
                          Closed: r.cases.closed,
                        }))}
                      margin={{ left: 8, right: 8, top: 8, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Open"          stackId="a" fill={C.amber} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Investigation" stackId="a" fill={C.blue}  radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Closed"        stackId="a" fill={C.green} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}

            {/* ── GD Reports ── */}
            {activeTab === "gd" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20 }}>
                <HorizBarChart title="GD Reports by Type" data={toTypeData(agg.gdType)} color={C.teal} />
                <DonutChart title="GD Status Breakdown" data={[
                  { name: "Submitted", value: rows.reduce((s, r) => s + r.gd_reports.submitted, 0) },
                  { name: "Assigned",  value: rows.reduce((s, r) => s + r.gd_reports.assigned,  0) },
                  { name: "Approved",  value: rows.reduce((s, r) => s + r.gd_reports.approved,  0) },
                  { name: "Rejected",  value: rows.reduce((s, r) => s + r.gd_reports.rejected,  0) },
                ].filter(d => d.value > 0)} />
              </div>
            )}

            {/* ── Criminals ── */}
            {activeTab === "criminals" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
                <RiskRadial data={agg.riskBreakdown} />
                <DonutChart title="Criminal Status" data={[
                  { name: "In Custody", value: rows.reduce((s, r) => s + r.criminals.in_custody, 0) },
                  { name: "On Bail",    value: rows.reduce((s, r) => s + r.criminals.on_bail,    0) },
                  { name: "Released",   value: rows.reduce((s, r) => s + r.criminals.released,   0) },
                  { name: "Escaped",    value: rows.reduce((s, r) => s + r.criminals.escaped,    0) },
                  { name: "Wanted",     value: rows.reduce((s, r) => s + r.criminals.wanted,     0) },
                ].filter(d => d.value > 0)} />
                <Card style={{ gridColumn: "1 / -1" }}>
                  <SectionTitle title="Average Risk Level by Thana" subtitle="Higher is more dangerous (scale 1–10)" />
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={[...rows]
                        .filter(r => r.criminals.average_risk_level > 0)
                        .sort((a, b) => b.criminals.average_risk_level - a.criminals.average_risk_level)
                        .slice(0, 15)
                        .map(r => ({ name: r.thana.thana_name, Risk: r.criminals.average_risk_level }))}
                      margin={{ left: 8, right: 8, top: 8, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="Risk" fill={C.red} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}

            {/* ── Thanas ── */}
            {activeTab === "thanas" && (
              <>
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748B" }}>
                  Showing {rows.length} thana{rows.length !== 1 ? "s" : ""}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
                  {rows.map((item) => (
                    <ThanaCard key={item.thana.thana_id} item={item} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
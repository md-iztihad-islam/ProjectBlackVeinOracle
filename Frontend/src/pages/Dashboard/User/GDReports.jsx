import getGDReportByUserApi from "@/services/GDReport/getGDReportByUserApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const STATUS_CONFIG = {
    submitted: { cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",       dot: "bg-blue-400",    label: "Submitted" },
    pending:   { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",     dot: "bg-amber-400",   label: "Pending"   },
    resolved:  { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400", label: "Resolved"  },
    rejected:  { cls: "bg-red-500/10 text-red-400 border-red-500/20",           dot: "bg-red-400",     label: "Rejected"  },
};

const getStatus = (s) => STATUS_CONFIG[s?.toLowerCase()] ?? { cls: "bg-slate-500/10 text-slate-400 border-slate-500/20", dot: "bg-slate-400", label: s ?? "Unknown" };

const formatDate = (iso) => {
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
};

const FILTERS = ["All", "Submitted", "Pending", "Resolved", "Rejected"];

// ── Skeleton row ──
const SkeletonRow = () => (
    <div className="px-5 sm:px-6 py-5 flex items-start gap-4 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
                <div className="w-20 h-3 rounded-full bg-white/[0.05]" />
                <div className="w-14 h-3 rounded-full bg-white/[0.04]" />
            </div>
            <div className="w-3/4 h-4 rounded-full bg-white/[0.05]" />
            <div className="w-1/2 h-3 rounded-full bg-white/[0.04]" />
        </div>
        <div className="w-20 h-6 rounded-full bg-white/[0.05] flex-shrink-0" />
    </div>
);

// ── Stats bar ──
const StatPill = ({ label, value, color, bg }) => (
    <div className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border ${bg} min-w-[80px]`}>
        <span className={`text-xl font-bold ${color}`}>{value}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">{label}</span>
    </div>
);

function GDReport() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState(null);

    const { data: gdReports, isLoading } = useQuery({
        queryKey: ["gdReports"],
        queryFn: () => getGDReportByUserApi(),
    });

    const gdData = gdReports?.data || [];

    const filtered = gdData.filter((r) => {
        const matchFilter = activeFilter === "All" || r.status?.toLowerCase() === activeFilter.toLowerCase();
        const matchSearch = search === "" ||
            r.gd_id?.toString().includes(search) ||
            r.description?.toLowerCase().includes(search.toLowerCase()) ||
            r.thana_id?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const stats = [
        { label: "Total",    value: gdData.length,                                                              color: "text-slate-200",   bg: "bg-white/[0.03] border-white/[0.07]"      },
        { label: "Submitted",value: gdData.filter(r => r.status?.toLowerCase() === "submitted").length,         color: "text-blue-400",    bg: "bg-blue-500/[0.07] border-blue-500/20"    },
        { label: "Pending",  value: gdData.filter(r => r.status?.toLowerCase() === "pending").length,           color: "text-amber-400",   bg: "bg-amber-500/[0.07] border-amber-500/20"  },
        { label: "Resolved", value: gdData.filter(r => r.status?.toLowerCase() === "resolved").length,          color: "text-emerald-400", bg: "bg-emerald-500/[0.07] border-emerald-500/20"},
        { label: "Rejected", value: gdData.filter(r => r.status?.toLowerCase() === "rejected").length,          color: "text-red-400",     bg: "bg-red-500/[0.07] border-red-500/20"      },
    ];

    return (
        <div className="min-h-screen w-full bg-[#080c14] flex flex-col">

            {/* Ambient bg */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-blue-600/[0.04] rounded-full blur-[130px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-emerald-600/[0.03] rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            </div>

            <div className="relative flex flex-col flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">

                {/* ── Top bar ── */}
                <header className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate("/user/dashboard")}
                        className="group flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.07] group-hover:bg-white/[0.08] transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Dashboard</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-blue-400/70">Bangladesh Police</p>
                            <p className="text-xs text-slate-500">GD Portal</p>
                        </div>
                    </div>
                </header>

                {/* ── Page title + CTA ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-blue-400/70 font-medium mb-1">Records</p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">My GD Reports</h1>
                        <p className="text-sm text-slate-500 mt-1.5">Track and manage all your filed reports.</p>
                    </div>
                    <button
                        onClick={() => navigate("/user/dashboard/add-gd-report")}
                        className="self-start sm:self-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl px-4 py-2.5 transition-all duration-200 hover:-translate-y-px shadow-lg shadow-blue-900/30"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        File New Report
                    </button>
                </div>

                {/* ── Stats row ── */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                    {stats.map(s => (
                        <StatPill key={s.label} {...s} />
                    ))}
                </div>

                {/* ── Main card ── */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col flex-1">

                    {/* Toolbar */}
                    <div className="px-5 sm:px-6 py-4 border-b border-white/[0.05] flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by ID, description, thana…"
                                className="w-full bg-white/[0.03] border border-white/[0.07] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none placeholder:text-slate-600 transition-all"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                            {FILTERS.map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                                        activeFilter === f
                                            ? "bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-900/30"
                                            : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table header — desktop */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-5 sm:px-6 py-3 border-b border-white/[0.04] bg-white/[0.01]">
                        <span className="col-span-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-600">GD ID</span>
                        <span className="col-span-5 text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-600">Description</span>
                        <span className="col-span-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-600">Thana</span>
                        <span className="col-span-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-600">Date</span>
                        <span className="col-span-1 text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-600">Status</span>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="divide-y divide-white/[0.04]">
                            {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
                                <svg className="w-7 h-7 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-400">
                                    {search || activeFilter !== "All" ? "No reports match your filter" : "No reports filed yet"}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">
                                    {search || activeFilter !== "All" ? "Try adjusting your search or filter" : "Your filed GD reports will appear here"}
                                </p>
                            </div>
                            {!search && activeFilter === "All" && (
                                <button
                                    onClick={() => navigate("/user/dashboard/add-gd-report")}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg px-4 py-2 transition-colors"
                                >
                                    File your first report →
                                </button>
                            )}
                        </div>
                    )}

                    {/* Report rows */}
                    {!isLoading && filtered.length > 0 && (
                        <ul className="divide-y divide-white/[0.04]">
                            {filtered.map((report) => {
                                const sc = getStatus(report.status);
                                const { date, time } = formatDate(report.submitted_at);
                                const isExpanded = expandedId === report.gd_id;

                                return (
                                    <li key={report.gd_id}>
                                        {/* Desktop row */}
                                        <div
                                            className="hidden sm:grid grid-cols-12 gap-4 items-center px-5 sm:px-6 py-4 hover:bg-white/[0.025] transition-colors cursor-pointer group"
                                            onClick={() => setExpandedId(isExpanded ? null : report.gd_id)}
                                        >
                                            {/* ID */}
                                            <div className="col-span-2 flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                                                <span className="text-xs font-mono font-semibold text-slate-400 tracking-wider">GD-{report.gd_id}</span>
                                            </div>
                                            {/* Description */}
                                            <div className="col-span-5">
                                                <p className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors line-clamp-1">
                                                    {report.description}
                                                </p>
                                            </div>
                                            {/* Thana */}
                                            <div className="col-span-2">
                                                <span className="text-xs font-mono text-slate-500">{report.thana_id}</span>
                                            </div>
                                            {/* Date */}
                                            <div className="col-span-2 flex flex-col">
                                                <span className="text-xs text-slate-400">{date}</span>
                                                <span className="text-[10px] text-slate-600">{time}</span>
                                            </div>
                                            {/* Status */}
                                            <div className="col-span-1 flex items-center justify-between">
                                                <span className={`inline-flex items-center gap-1.5 border text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide capitalize ${sc.cls}`}>
                                                    {sc.label}
                                                </span>
                                                <svg className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Mobile row */}
                                        <div
                                            className="sm:hidden flex items-start gap-3 px-4 py-4 hover:bg-white/[0.025] transition-colors cursor-pointer"
                                            onClick={() => setExpandedId(isExpanded ? null : report.gd_id)}
                                        >
                                            <div className={`flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider">GD-{report.gd_id}</span>
                                                    <span className="text-[10px] text-slate-600">{date}</span>
                                                </div>
                                                <p className="text-sm text-slate-300 line-clamp-1">{report.description}</p>
                                                <span className="text-[10px] font-mono text-slate-600">{report.thana_id}</span>
                                            </div>
                                            <span className={`flex-shrink-0 inline-flex items-center border text-[10px] font-bold px-2 py-1 rounded-full tracking-wide ${sc.cls}`}>
                                                {sc.label}
                                            </span>
                                        </div>

                                        {/* Expanded detail panel */}
                                        {isExpanded && (
                                            <div className="px-5 sm:px-6 pb-5 pt-1 bg-white/[0.015] border-t border-white/[0.04]">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                                    {[
                                                        { label: "GD ID",        value: `GD-${report.gd_id}`,         mono: true  },
                                                        { label: "Thana ID",     value: report.thana_id,              mono: true  },
                                                        { label: "User ID",      value: report.user_id,               mono: true  },
                                                        { label: "Submitted At", value: `${date} at ${time}`,                     },
                                                        { label: "Assigned Officer", value: report.assigned_officer_id ?? "Unassigned" },
                                                        { label: "Approved By",  value: report.approved_by_officer_id ?? "Pending approval" },
                                                    ].map(f => (
                                                        <div key={f.label} className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                            <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-600">{f.label}</span>
                                                            <span className={`text-xs text-slate-300 ${f.mono ? "font-mono text-emerald-400/90" : ""}`}>{f.value}</span>
                                                        </div>
                                                    ))}
                                                    <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-600">Full Description</span>
                                                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{report.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* Footer */}
                    {!isLoading && filtered.length > 0 && (
                        <div className="px-5 sm:px-6 py-3 border-t border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                            <span className="text-xs text-slate-600">
                                Showing <span className="text-slate-400 font-medium">{filtered.length}</span> of <span className="text-slate-400 font-medium">{gdData.length}</span> reports
                            </span>
                            <span className="text-xs text-slate-600 hidden sm:block">Click a row to expand details</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GDReport;
import getGDReportByUserApi from "@/services/GDReport/getGDReportByUserApi";
import { userSignoutApi } from "@/services/authServices/signoutApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState as useSignoutState } from "react";

const statusConfig = (s) => {
    switch (s?.toLowerCase()) {
        case "submitted": return { cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",    dot: "bg-blue-400"    };
        case "resolved":  return { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" };
        case "rejected":  return { cls: "bg-red-500/10 text-red-400 border-red-500/20",       dot: "bg-red-400"     };
        default:          return { cls: "bg-slate-500/10 text-slate-400 border-slate-500/20", dot: "bg-slate-400"   };
    }
};

const StatCard = ({ label, value, color, bg, icon, isLoading }) => (
    <div className={`relative border rounded-2xl p-5 flex flex-col justify-between gap-4 overflow-hidden ${bg}`}>
        <div className="flex items-start justify-between">
            <span className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">{label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center opacity-60 ${bg}`}>
                {icon}
            </div>
        </div>
        <span className={`text-4xl font-bold tracking-tight ${color}`}>
            {isLoading ? <span className="inline-block w-8 h-8 rounded-lg bg-white/[0.05] animate-pulse" /> : value}
        </span>
    </div>
);

function UserDashboard() {
    const navigate = useNavigate();
    const { user, clearUser } = userStore();
    const [signingOut, setSigningOut] = useSignoutState(false);

    const handleSignout = async () => {
        setSigningOut(true);
        await userSignoutApi();
        clearUser();
        navigate("/");
    };

    const userId = user?.user_id;
    const { data: gdReportsData, isLoading } = useQuery({
        queryKey: ["gdReports", userId],
        queryFn: () => getGDReportByUserApi(userId),
        enabled: !!userId,
    });

    const gdReports = gdReportsData?.data || [];
    const recentReports = gdReports.slice(0, 5);

    const initials = user?.full_name
        ? user.full_name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
        : "U";

    const stats = [
        {
            label: "Total Reports",
            value: gdReports.length,
            color: "text-blue-400",
            bg: "bg-blue-500/[0.07] border-blue-500/20",
            icon: <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
        },
        {
            label: "Submitted",
            value: gdReports.filter(r => r.status?.toLowerCase() === "submitted").length,
            color: "text-sky-400",
            bg: "bg-sky-500/[0.07] border-sky-500/20",
            icon: <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
        },
        {
            label: "Resolved",
            value: gdReports.filter(r => r.status?.toLowerCase() === "resolved").length,
            color: "text-emerald-400",
            bg: "bg-emerald-500/[0.07] border-emerald-500/20",
            icon: <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
        },
    ];

    const quickActions = [
        {
            label: "File New Report",
            description: "Submit a GD report to your nearest thana",
            icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
            accent: "blue",
            primary: true,
            onClick: () => navigate("/user/dashboard/add-gd-report"),
        },
        {
            label: "My Reports",
            description: "Track all your filed GD reports",
            icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
            accent: "slate",
            onClick: () => navigate("/user/dashboard/gd-reports"),
        },
        {
            label: "My Profile",
            description: "View and update personal information",
            icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
            accent: "slate",
            onClick: () => navigate("/user/dashboard/profile"),
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#080c14] flex flex-col">
            {/* Ambient bg */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-blue-600/[0.04] rounded-full blur-[130px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-emerald-600/[0.03] rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.35]" style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px"}} />
            </div>

            <div className="relative flex flex-col flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-7">

                {/* ── Top bar ── */}
                <header className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Logo / brand */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-blue-400/70">PROJECT BLACK VEIN ORACLE</p>
                            <p className="text-xs text-slate-500">GD Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* User chip */}
                        <button
                            onClick={() => navigate("/user/dashboard/profile")}
                            className="hidden sm:flex items-center gap-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] rounded-xl px-3 py-2 transition-colors"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {initials}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-medium text-slate-200 leading-none">{user?.full_name ?? "User"}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 leading-none">{user?.email ?? ""}</p>
                            </div>
                        </button>

                        <button
                            onClick={handleSignout}
                            disabled={signingOut}
                            className="flex items-center gap-2 bg-red-500/[0.07] hover:bg-red-500/[0.14] border border-red-500/20 hover:border-red-500/35 text-red-400 text-xs font-semibold rounded-xl px-3 py-2 transition-all duration-200"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            {signingOut ? "Signing out…" : "Sign Out"}
                        </button>
                    </div>
                </header>

                {/* ── Welcome ── */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-slate-500">Live Dashboard</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">{user?.full_name?.split(" ")[0] ?? "User"}</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Here's an overview of your GD portal activity.</p>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {stats.map(s => (
                        <StatCard key={s.label} {...s} isLoading={isLoading} />
                    ))}
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1">

                    {/* Left — quick actions */}
                    <div className="lg:col-span-1 flex flex-col gap-5">
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-px bg-slate-700" />
                                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">Quick Actions</span>
                            </div>
                            <div className="flex flex-col gap-2.5">
                                {quickActions.map(action => (
                                    <button
                                        key={action.label}
                                        onClick={action.onClick}
                                        className={`group flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-px ${
                                            action.primary
                                                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30"
                                                : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] text-slate-200"
                                        }`}
                                    >
                                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${action.primary ? "bg-white/15" : "bg-white/[0.05]"}`}>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{action.label}</p>
                                            <p className={`text-xs mt-0.5 leading-snug ${action.primary ? "text-blue-200/70" : "text-slate-500"}`}>{action.description}</p>
                                        </div>
                                        <svg className={`w-4 h-4 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${action.primary ? "text-blue-200" : "text-slate-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="9 18 15 12 9 6"/>
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notice */}
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                For emergencies, call <span className="text-blue-400 font-semibold">999</span>. GD reports are for non-emergency documentation only.
                            </p>
                        </div>
                    </div>

                    {/* Right — recent reports */}
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col flex-1">
                            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-px bg-slate-700" />
                                    <span className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">Recent Reports</span>
                                </div>
                                <button
                                    onClick={() => navigate("/user/dashboard/gd-reports")}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                >
                                    View all →
                                </button>
                            </div>

                            {/* Loading */}
                            {isLoading && (
                                <div className="flex-1 flex items-center justify-center py-16 gap-3 text-slate-500 text-sm">
                                    <span className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    Loading reports…
                                </div>
                            )}

                            {/* Empty */}
                            {!isLoading && recentReports.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
                                        <svg className="w-7 h-7 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-slate-400">No reports yet</p>
                                        <p className="text-xs text-slate-600 mt-1">Your filed GD reports will appear here</p>
                                    </div>
                                    <button
                                        onClick={() => navigate("/user/dashboard/add-gd-report")}
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg px-4 py-2 transition-colors"
                                    >
                                        File your first report →
                                    </button>
                                </div>
                            )}

                            {/* List */}
                            {!isLoading && recentReports.length > 0 && (
                                <ul className="divide-y divide-white/[0.04] flex-1">
                                    {recentReports.map((report) => {
                                        const sc = statusConfig(report.status);
                                        return (
                                            <li
                                                key={report.gd_id}
                                                onClick={() => navigate("/user/dashboard/gd-reports")}
                                                className="group px-5 sm:px-6 py-4 flex items-start justify-between gap-4 hover:bg-white/[0.025] transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-start gap-3 min-w-0">
                                                    <div className={`flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                    <div className="flex flex-col gap-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider">
                                                                GD-{report.gd_id}
                                                            </span>
                                                            <span className="text-[10px] text-slate-600">
                                                                {new Date(report.submitted_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-300 line-clamp-1 group-hover:text-slate-100 transition-colors">
                                                            {report.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 border text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 tracking-wide ${sc.cls}`}>
                                                    {report.status}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {/* Footer */}
                            {!isLoading && recentReports.length > 0 && (
                                <div className="px-5 sm:px-6 py-3 border-t border-white/[0.05] flex items-center justify-between">
                                    <span className="text-xs text-slate-600">{gdReports.length} total report{gdReports.length !== 1 ? "s" : ""}</span>
                                    <button
                                        onClick={() => navigate("/user/dashboard/add-gd-report")}
                                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                        </svg>
                                        File new report
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserDashboard;
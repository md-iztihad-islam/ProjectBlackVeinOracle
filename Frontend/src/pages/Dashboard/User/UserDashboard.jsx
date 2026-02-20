import getGDReportByUserApi from "@/services/GDReport/getGDReportByUserApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
    const navigate = useNavigate();
    const { user } = userStore();
    const userId = user?.user_id;

    const { data: gdReportsData, isLoading } = useQuery({
        queryKey: ["gdReports", userId],
        queryFn: () => getGDReportByUserApi(userId),
        enabled: !!userId,
    });

    const gdReports = gdReportsData?.data || [];

    const stats = [
        { label: "Total Reports",  value: gdReports.length,                                                             color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20"    },
        { label: "Submitted",      value: gdReports.filter((r) => r.status?.toLowerCase() === "submitted").length,      color: "text-sky-400",     bg: "bg-sky-500/10 border-sky-500/20"      },
        { label: "Pending",        value: gdReports.filter((r) => r.status?.toLowerCase() === "pending").length,        color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20"  },
        { label: "Resolved",       value: gdReports.filter((r) => r.status?.toLowerCase() === "resolved").length,       color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    ];

    const quickActions = [
        {
            label: "File New Report",
            description: "Submit a new GD report to your nearest thana",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            ),
            color: "bg-blue-600 hover:bg-blue-500 text-white",
            onClick: () => navigate("/user/dashboard/add-gd-report"),
        },
        {
            label: "My Reports",
            description: "View and track all your filed GD reports",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
            color: "bg-gray-800 hover:bg-gray-700 border border-white/[0.07] text-slate-200",
            onClick: () => navigate("/user/dashboard/gd-reports"),
        },
        {
            label: "My Profile",
            description: "View and update your personal information",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
            ),
            color: "bg-gray-800 hover:bg-gray-700 border border-white/[0.07] text-slate-200",
            onClick: () => navigate("/user/dashboard/profile"),
        },
    ];

    const recentReports = gdReports.slice(0, 3);

    const statusBadge = (s) => {
        switch (s?.toLowerCase()) {
            case "submitted": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "pending":   return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "resolved":  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "rejected":  return "bg-red-500/10 text-red-400 border-red-500/20";
            default:          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600 opacity-5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto flex flex-col gap-6">

                {/* Header */}
                <div>
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-widest uppercase rounded-full px-3 py-1 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Bangladesh Police
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                        Welcome back, <span className="text-blue-400">{user?.full_name?.split(" ")[0] ?? "User"}</span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Here's an overview of your GD portal activity.
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`border rounded-xl px-4 py-4 flex flex-col gap-1 ${stat.bg}`}>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{stat.label}</span>
                            <span className={`text-2xl font-bold ${stat.color}`}>
                                {isLoading ? "—" : stat.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <div>
                    <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                onClick={action.onClick}
                                className={`flex items-start gap-3 rounded-xl px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${action.color}`}
                            >
                                <div className="mt-0.5 flex-shrink-0">{action.icon}</div>
                                <div>
                                    <p className="text-sm font-semibold">{action.label}</p>
                                    <p className="text-xs opacity-60 mt-0.5 leading-snug">{action.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent reports */}
                <div className="bg-gray-900 border border-white/[0.07] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.05]">
                        <h2 className="text-sm font-semibold text-slate-200 tracking-tight">Recent Reports</h2>
                        <button
                            onClick={() => navigate("/user/gd-reports")}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                            View all →
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center gap-3 py-10 text-slate-500 text-sm">
                            <span className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            Loading…
                        </div>
                    )}

                    {!isLoading && recentReports.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <p className="text-sm text-slate-500">No reports filed yet.</p>
                            <button
                                onClick={() => navigate("/user/add-gd-report")}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                            >
                                File your first report →
                            </button>
                        </div>
                    )}

                    {!isLoading && recentReports.length > 0 && (
                        <ul className="divide-y divide-white/[0.04]">
                            {recentReports.map((report) => (
                                <li
                                    key={report.gd_id}
                                    className="px-5 sm:px-6 py-4 flex items-start justify-between gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    onClick={() => navigate("/user/gd-reports")}
                                >
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-xs font-mono text-slate-500">GD-{report.gd_id}</span>
                                        <p className="text-sm text-slate-200 line-clamp-1">{report.description}</p>
                                        <span className="text-xs text-slate-600">
                                            {new Date(report.submitted_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                    <span className={`inline-flex items-center border text-xs font-medium px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${statusBadge(report.status)}`}>
                                        {report.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}

export default UserDashboard;
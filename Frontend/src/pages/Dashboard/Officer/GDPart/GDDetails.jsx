import getGDReportByGDIdApi from "@/services/GDReport/getDGReportByGDIdApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const statusConfig = {
    submitted: { label: "Submitted", classes: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    assigned:  { label: "Assigned",  classes: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
    approved:  { label: "Approved",  classes: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
    rejected:  { label: "Rejected",  classes: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

const gdTypeLabels = {
    theft: "Theft", lost_document: "Lost Document", missing_person: "Missing Person",
    accident: "Accident", assault: "Assault", robbery: "Robbery",
    fraud: "Fraud", domestic_violence: "Domestic Violence", property_dispute: "Property Dispute",
    suspicious_activity: "Suspicious Activity", threat: "Threat",
    noise_disturbance: "Noise Disturbance", other: "Other",
};

function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function InfoBlock({ title, value, mono }) {
    return (
        <div>
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            <p className={`text-sm text-gray-900 font-medium ${mono ? 'font-mono text-gray-700' : ''}`}>
                {value || "—"}
            </p>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-4 shadow-sm animate-pulse">
            <div className="h-6 w-2/5 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 rounded" />
                <div className="h-24 w-full bg-gray-50 rounded mt-6" />
            </div>
        </div>
    );
}

export default function GDDetails() {
    const navigate = useNavigate();
    const { dairyId } = useParams();

    const { data: gdReportData, isLoading, error } = useQuery({
        queryKey: ["gdReportDetails", dairyId],
        queryFn: () => getGDReportByGDIdApi(dairyId),
        enabled: !!dairyId,
    });

    const r = gdReportData?.data || null;
    const cfg = statusConfig[r?.status] || statusConfig.submitted;

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans flex justify-center">
            <div className="w-full max-w-4xl">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <button onClick={() => navigate("/officer/dashboard")} className="hover:text-gray-900 transition-colors">Dashboard</button>
                    <span className="text-gray-300">/</span>
                    <button onClick={() => navigate("/officer/dashboard/gd-list")} className="hover:text-gray-900 transition-colors">GD List</button>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-mono">#{dairyId}</span>
                </nav>

                {isLoading ? <SkeletonCard /> : error ? (
                    <div className="bg-red-50 text-red-600 p-8 text-center rounded-xl border border-red-100">
                        Failed to load GD report. Please try again.
                    </div>
                ) : r && (
                    <>
                        {/* Main Layout Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            
                            {/* Left Column: Core Incident Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                    <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">General Diary</p>
                                            <h1 className="text-2xl font-bold text-gray-900 font-mono">#{r.gd_id}</h1>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cfg.classes}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                {cfg.label}
                                            </span>
                                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                                                {gdTypeLabels[r.gd_type] || r.gd_type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-8">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Incident Overview</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <InfoBlock title="Incident Date" value={formatDate(r.incident_date)} />
                                            <InfoBlock title="Location" value={r.incident_location} />
                                            <InfoBlock title="Submitted At" value={formatDateTime(r.submitted_at)} />
                                        </div>

                                        {r.description && (
                                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description provided by Complainant</p>
                                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{r.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Entities (Complainant, Thana, Officer) */}
                            <div className="space-y-6">
                                {/* Complainant Card */}
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Complainant Details</h3>
                                    {r.complainant ? (
                                        <div className="space-y-4">
                                            <InfoBlock title="Full Name" value={r.complainant.full_name} />
                                            <InfoBlock title="Phone" value={r.complainant.phone} mono />
                                            <InfoBlock title="NID Number" value={r.complainant.nid_number} mono />
                                            <InfoBlock title="Address" value={r.complainant.address} />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No complainant data available.</p>
                                    )}
                                </div>

                                {/* Jurisdiction / Thana Card */}
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Jurisdiction</h3>
                                    {r.thana ? (
                                        <div className="space-y-4">
                                            <InfoBlock title="Thana Name" value={r.thana.thana_name} />
                                            <InfoBlock title="District / Zone" value={`${r.thana.district} — ${r.thana.zone}`} />
                                            <InfoBlock title="Contact" value={r.thana.phone} mono />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No jurisdiction data available.</p>
                                    )}
                                </div>

                                {/* Assigned Officer Card */}
                                {r.assigned_officer && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl shadow-sm p-6">
                                        <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Assigned Officer</h3>
                                        <div className="space-y-4">
                                            <InfoBlock title="Officer Name" value={r.assigned_officer.full_name} />
                                            <InfoBlock title="Badge / Rank" value={`${r.assigned_officer.badge_no} (${r.assigned_officer.rank_code?.toUpperCase()})`} mono />
                                            <InfoBlock title="Contact" value={r.assigned_officer.phone} mono />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => navigate("/officer/dashboard/gd-list")}
                                className="py-2.5 px-6 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Back to List
                            </button>
                            {(r.status === "submitted" || r.status === "assigned") && (
                                <button
                                    onClick={() => navigate(`/officer/respond-gd/${r.gd_id}`)}
                                    className="py-2.5 px-8 bg-blue-600 border border-transparent text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Respond to GD
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
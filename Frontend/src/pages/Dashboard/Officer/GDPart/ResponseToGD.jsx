import getGDReportByGDIdApi from "@/services/GDReport/getDGReportByGDIdApi";
import responseToGDReportApi from "@/services/GDReport/responseToGDReportApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

function SkeletonCard() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm animate-pulse">
            <div className="h-5 w-1/2 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-5/6 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

export default function ResponseToGD() {
    const navigate = useNavigate();
    const { gdId } = useParams();
    const queryClient = useQueryClient();

    const [decision, setDecision] = useState("approved");

    const { data: gdReportData, isLoading, error: fetchError } = useQuery({
        queryKey: ["gdReportDetails", gdId],
        queryFn: () => getGDReportByGDIdApi(gdId),
        enabled: !!gdId,
    });

    const r = gdReportData?.data || null;

    const { mutate: respondToGD, isPending, isSuccess, isError } = useMutation({
        mutationFn: async (responseData) => {
            const res = await responseToGDReportApi({ gdId: gdId, responseData });
            if (!res?.success) {
                throw new Error(res?.message || "Failed to submit decision.");
            }
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gdReportDetails", gdId] });
            queryClient.invalidateQueries({ queryKey: ["gdReportsByOfficer"] });
            queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
            queryClient.invalidateQueries({ queryKey: ["myNotificationUnreadCount"] });
            setTimeout(() => {
                navigate("/officer/dashboard");
            }, 350);
        },
    });

    const alreadyResolved = r && (r.status === "approved" || r.status === "rejected");

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans flex justify-center">
            <div className="w-full max-w-2xl">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <button onClick={() => navigate("/officer/dashboard/gd-list")} className="hover:text-gray-900 transition-colors">GD List</button>
                    <span className="text-gray-300">/</span>
                    <button onClick={() => navigate(`/officer/dashboard/gd-list/${gdId}`)} className="hover:text-gray-900 font-mono transition-colors">#{gdId}</button>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900">Respond</span>
                </nav>

                {/* GD Context Card */}
                {isLoading ? <SkeletonCard /> : fetchError ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 mb-6 text-center text-sm">
                        Failed to load GD report details.
                    </div>
                ) : r && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4 gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Context Summary</p>
                                <h2 className="text-lg font-bold text-gray-900 font-mono">#{r.gd_id}</h2>
                            </div>
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                                {gdTypeLabels[r.gd_type] || r.gd_type}
                            </span>
                        </div>

                        {r.description && (
                            <p className="text-sm text-gray-600 mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                                {r.description.length > 150 ? r.description.slice(0, 150) + "…" : r.description}
                            </p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 col-span-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Complainant</p>
                                <p className="text-sm text-gray-900 font-medium">{r.complainant?.full_name || "Unknown"}</p>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">{r.complainant?.phone || "No phone"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 col-span-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jurisdiction & Date</p>
                                <p className="text-sm text-gray-900 font-medium">{r.thana?.thana_name || r.thana_id}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{formatDate(r.incident_date)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Response Action Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-900">Submit Decision</h1>
                        <p className="text-sm text-gray-500 mt-1">Select an outcome to officially record your review.</p>
                    </div>

                    {/* Alerts */}
                    {alreadyResolved && (
                        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-lg mb-6 flex gap-3 text-sm">
                            <span className="font-bold">ⓘ</span>
                            <p>This GD is currently marked as <strong className="capitalize">{r.status}</strong>. Submitting will overwrite this.</p>
                        </div>
                    )}
                    {isSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex gap-3 text-sm font-medium">
                            <span>✓</span> Decision recorded successfully.
                        </div>
                    )}
                    {isError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex gap-3 text-sm font-medium">
                            <span>✕</span> Failed to save decision. Please try again.
                        </div>
                    )}

                    {/* Radio Selectors */}
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Outcome</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setDecision("approved")}
                            className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                                decision === "approved" 
                                    ? "border-green-500 bg-green-50" 
                                    : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-1.5">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${decision === "approved" ? "border-green-600" : "border-gray-300"}`}>
                                    {decision === "approved" && <div className="w-2 h-2 rounded-full bg-green-600" />}
                                </div>
                                <span className={`font-semibold ${decision === "approved" ? "text-green-800" : "text-gray-700"}`}>Approve</span>
                            </div>
                            <p className="text-xs text-gray-500 pl-7">Authorize and validate this report.</p>
                        </button>

                        <button
                            onClick={() => setDecision("rejected")}
                            className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                                decision === "rejected" 
                                    ? "border-red-500 bg-red-50" 
                                    : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-1.5">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${decision === "rejected" ? "border-red-600" : "border-gray-300"}`}>
                                    {decision === "rejected" && <div className="w-2 h-2 rounded-full bg-red-600" />}
                                </div>
                                <span className={`font-semibold ${decision === "rejected" ? "text-red-800" : "text-gray-700"}`}>Reject</span>
                            </div>
                            <p className="text-xs text-gray-500 pl-7">Decline and close this report.</p>
                        </button>
                    </div>

                    <div className="border-t border-gray-100 mb-6" />

                    {/* Form Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(`/officer/dashboard/gd-list/${gdId}`)}
                            className="flex-1 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => respondToGD({ status: decision })}
                            disabled={isPending || isLoading}
                            className={`flex-[2] py-2.5 px-4 border border-transparent text-white rounded-lg text-sm font-medium shadow-sm transition-all ${
                                isPending ? "opacity-60 cursor-not-allowed bg-gray-500" : 
                                decision === "approved" ? "bg-green-500 hover:bg-green-500/90" : "bg-red-500 hover:bg-red-500/90"
                            }`}
                        >
                            {isPending ? "Submitting..." : `Submit ${decision === "approved" ? "Approval" : "Rejection"}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
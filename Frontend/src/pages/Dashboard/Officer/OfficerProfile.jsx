import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import getOfficerByIdApi from "@/services/Officer/getOfficerByIdApi";
import changePasswordApi from "@/services/Officer/changePasswordApi";
import userStore from "@/state/userStore";

// --- Utility & UI Components ---

const gdStatusConfig = {
    submitted: { label: "Submitted", classes: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    assigned:  { label: "Assigned",  classes: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
    approved:  { label: "Approved",  classes: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
    rejected:  { label: "Rejected",  classes: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

function StatusBadge({ status }) {
    const cfg = gdStatusConfig[status] || gdStatusConfig.submitted;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${cfg.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function formatDateShort(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function InfoBlock({ title, value, mono }) {
    return (
        <div className="py-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
            <p className={`text-sm text-gray-900 ${mono ? 'font-mono' : ''}`}>
                {value || "—"}
            </p>
        </div>
    );
}

function StatCard({ label, value, highlight }) {
    return (
        <div className={`p-4 rounded-xl border ${highlight ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-blue-600' : 'text-gray-500'}`}>
                {label}
            </p>
            <p className={`text-2xl font-bold ${highlight ? 'text-blue-900' : 'text-gray-900'}`}>
                {value || "0"}
            </p>
        </div>
    );
}

function SkeletonProfile() {
    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-pulse">
            <div className="h-32 bg-white rounded-xl border border-gray-200" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-64 bg-white rounded-xl border border-gray-200 lg:col-span-1" />
                <div className="h-64 bg-white rounded-xl border border-gray-200 lg:col-span-2" />
            </div>
        </div>
    );
}

// --- Modal Component ---

function ChangePasswordModal({ isOpen, onClose }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const { user } = userStore();
    const officerId = user?.officer_id;

    const { mutate: changePassword, isPending, isSuccess, isError } = useMutation({
        mutationFn: () => changePasswordApi(oldPassword, newPassword, officerId),
        onSuccess: () => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setLocalError("");
            setTimeout(onClose, 1500); // Close automatically after success
        },
    });

    const handleSubmit = () => {
        setLocalError("");
        if (!oldPassword || !newPassword || !confirmPassword) {
            setLocalError("All fields are required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setLocalError("New password and confirm password do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setLocalError("Password must be at least 6 characters.");
            return;
        }
        changePassword();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {localError && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
                            {localError}
                        </div>
                    )}
                    {isError && !localError && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
                            Failed to change password. Please check your old password.
                        </div>
                    )}
                    {isSuccess && (
                        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                            Password changed successfully!
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
                        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className={inputClasses} disabled={isPending || isSuccess} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClasses} disabled={isPending || isSuccess} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClasses} disabled={isPending || isSuccess} />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                    <button onClick={onClose} disabled={isPending || isSuccess} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={isPending || isSuccess} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                        {isPending ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main Page Component ---

export default function OfficerProfile() {
    const { user } = userStore();
    const officerId = user?.officer_id;

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const { data: officerData, isLoading, isError } = useQuery({
        queryKey: ["officerProfile", officerId],
        queryFn: () => getOfficerByIdApi(officerId),
        enabled: !!officerId,
    });

    const o = officerData?.data || {};

    if (isLoading) return <div className="min-h-screen bg-gray-50 p-6"><SkeletonProfile /></div>;
    if (isError) return <div className="min-h-screen bg-gray-50 p-6 text-center text-red-600">Failed to load profile.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* ── Top Header Card ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-600"></div>
                    <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                            {o.image_url ? (
                                <img src={o.image_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-3xl">
                                    {o.full_name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "??"}
                                </div>
                            )}
                        </div>
                        {/* Title Info */}
                        <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
                            <h1 className="text-2xl font-bold text-gray-900">{o.full_name}</h1>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1 text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{o.rank_name}</span>
                                <span className="hidden md:inline text-gray-300">•</span>
                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 text-xs">Badge: {o.badge_no}</span>
                                <span className="hidden md:inline text-gray-300">•</span>
                                <span className="font-mono text-gray-500">ID: {o.officer_id}</span>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex-shrink-0">
                            <button 
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-sm transition-colors"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Main Content Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Personal & Jurisdiction */}
                    <div className="space-y-6">
                        
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Contact Details</h2>
                            <div className="space-y-1">
                                <InfoBlock title="Email Address" value={o.email} />
                                <InfoBlock title="Phone Number" value={o.phone} mono />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Jurisdiction Mapping</h2>
                            <div className="space-y-1">
                                <InfoBlock title="Assigned Thana" value={o.thana?.thana_name} />
                                <InfoBlock title="Thana ID" value={o.thana?.thana_id} mono />
                                <InfoBlock title="District & Zone" value={`${o.thana?.district} — ${o.thana?.zone}`} />
                                {o.is_head_officer && (
                                    <div className="mt-4 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-2 rounded-md text-xs font-bold text-center uppercase tracking-wider">
                                        Head Officer of Thana
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Performance & Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Metrics Grid */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Operational Statistics</h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <StatCard label="Assigned GDs" value={o.total_assigned_gd} highlight />
                                <StatCard label="Pending GDs" value={o.assigned_pending_gd} />
                                <StatCard label="Approved GDs" value={o.assigned_approved_gd} />
                                <StatCard label="Rejected GDs" value={o.assigned_rejected_gd} />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard label="Thana Arrests" value={o.total_arrests_in_officer_thana} highlight />
                                <StatCard label="In Custody" value={o.in_custody_count} />
                                <StatCard label="On Bail" value={o.on_bail_count} />
                                <StatCard label="Released" value={o.released_count} />
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Assigned GDs</h2>
                            </div>
                            
                            {o.recent_assigned_gd?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-600">
                                        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-3">GD ID</th>
                                                <th className="px-6 py-3">Type</th>
                                                <th className="px-6 py-3">Date</th>
                                                <th className="px-6 py-3 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {o.recent_assigned_gd.map((gd) => (
                                                <tr key={gd.gd_id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-3 font-mono text-gray-900">#{gd.gd_id}</td>
                                                    <td className="px-6 py-3 capitalize">{gd.gd_type?.replace("_", " ")}</td>
                                                    <td className="px-6 py-3">{formatDateShort(gd.submitted_at)}</td>
                                                    <td className="px-6 py-3 text-right">
                                                        <StatusBadge status={gd.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    No recent GD assignments found.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Change Password Modal Overlay */}
            <ChangePasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
            />
        </div>
    );
}
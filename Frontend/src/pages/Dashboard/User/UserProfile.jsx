import userStore from "@/state/userStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    autoTriggerSosAlert,
    getMySosAlerts,
} from "@/services/SOS/sosApi";

const InfoField = ({ label, value, mono, locked }) => (
    <div className="group relative flex flex-col gap-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] hover:bg-white/[0.04] transition-all duration-300">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-500">
                {label}
            </span>
            {locked && (
                <span className="flex items-center gap-1 text-[9px] text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded-full border border-white/[0.04]">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Locked
                </span>
            )}
        </div>
        <span className={`text-sm text-slate-200 break-all leading-relaxed ${mono ? "font-mono text-xs tracking-wide text-emerald-400/90" : ""}`}>
            {value ?? <span className="text-slate-600 italic text-xs">Not provided</span>}
        </span>
    </div>
);

function UserProfile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = userStore();
    const [isLocating, setIsLocating] = useState(false);
    const [sosNotice, setSosNotice] = useState("");

    const { data: mySosAlertsData } = useQuery({
        queryKey: ["userSosAlerts"],
        queryFn: getMySosAlerts,
        enabled: Boolean(user?.user_id),
        refetchInterval: 5000,
    });

    const mySosAlerts = mySosAlertsData?.data || [];

    const latestSos = mySosAlerts[0] || null;

    const { mutate: triggerSos, isPending: isTriggeringSos } = useMutation({
        mutationFn: autoTriggerSosAlert,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSosAlerts"] });
            setSosNotice("SOS alert sent. Stay safe, support is being coordinated.");
        },
        onError: () => {
            setSosNotice("SOS failed to send. Please retry immediately.");
        },
    });

    const extractDistrict = (addressObj = {}) => {
        return (
            addressObj.state_district ||
            addressObj.county ||
            addressObj.city_district ||
            addressObj.city ||
            addressObj.state ||
            ""
        );
    };

    const handleOneTapSos = () => {
        if (isLocating || isTriggeringSos) return;
        if (!navigator.geolocation) {
            setSosNotice("GPS is not supported in this browser.");
            return;
        }

        setIsLocating(true);
        setSosNotice("Detecting your location and sending SOS...");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = Number(position.coords.latitude);
                const longitude = Number(position.coords.longitude);

                try {
                    let district = "";
                    let detectedAddress = "";

                    const reverseRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
                    );

                    if (reverseRes.ok) {
                        const reverseData = await reverseRes.json();
                        district = extractDistrict(reverseData?.address || {});
                        detectedAddress = reverseData?.display_name || "";
                    }

                    triggerSos({
                        district,
                        detected_address: detectedAddress,
                        latitude,
                        longitude,
                    });
                } catch {
                    // Send with raw GPS even if reverse geocoding fails.
                    triggerSos({
                        district: "",
                        detected_address: "",
                        latitude,
                        longitude,
                    });
                } finally {
                    setIsLocating(false);
                }
            },
            () => {
                setIsLocating(false);
                setSosNotice("Location permission denied. Allow GPS access and tap SOS again.");
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    const sosStatusLabel = {
        triggered: "Alert Triggered",
        assigned: "Officer Assigned",
        acknowledged: "Officer Acknowledged",
        resolved: "Resolved",
        cancelled: "Cancelled",
    };

    const lockedFields = [
        { label: "User ID",    value: user?.user_id,    mono: true, locked: true },
        { label: "NID Number", value: user?.nid_number, mono: true, locked: true },
        { label: "Email",      value: user?.email,                  locked: true },
    ];

    const editableFields = [
        { label: "Full Name", value: user?.full_name },
        { label: "Phone",     value: user?.phone     },
        { label: "Address",   value: user?.address   },
        { label: "Birth Date", value: user?.birth_date ? new Date(user.birth_date).toLocaleDateString() : null },
        { label: "Gender", value: user?.gender ? String(user.gender).charAt(0).toUpperCase() + String(user.gender).slice(1) : null },
    ];

    const initials = user?.full_name
        ? user.full_name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
        : "U";

    return (
        <div className="min-h-screen w-full bg-[#080c14] flex flex-col">
            {/* Ambient background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/[0.03] rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')] opacity-40" />
            </div>

            <div className="relative flex flex-col flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">

                {/* Top nav */}
                <nav className="flex items-center justify-between">
                    <button
                        onClick={() => navigate("/user/dashboard")}
                        className="group flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors duration-200"
                    >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.07] group-hover:bg-white/[0.08] group-hover:border-white/[0.12] transition-all duration-200">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Dashboard</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleOneTapSos}
                            disabled={isLocating || isTriggeringSos}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-400/40 text-red-300 hover:bg-red-500/25 transition-all"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400" />
                            </span>
                            <span className="text-xs font-semibold tracking-wide">
                                {isLocating ? "Locating..." : isTriggeringSos ? "Sending..." : "SOS"}
                            </span>
                        </button>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-slate-500">Active</span>
                        </div>
                    </div>
                </nav>

                {/* Page title */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-blue-400/70 font-medium mb-1">Account</p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">My Profile</h1>
                    </div>
                    <button
                        onClick={() => navigate("/user/dashboard/profile/edit")}
                        className="self-start sm:self-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Profile
                    </button>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1">

                    {/* Identity card — left column */}
                    <div className="lg:col-span-1 flex flex-col gap-5">
                        <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
                            {/* Banner */}
                            <div className="relative h-28 bg-gradient-to-br from-blue-600/25 via-blue-800/10 to-emerald-700/15">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.15),_transparent_60%)]" />
                                {/* Decorative grid */}
                                <div className="absolute inset-0 opacity-20" style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px"}} />
                            </div>

                            {/* Avatar */}
                            <div className="px-6 pb-6">
                                <div className="relative -mt-8 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-900/40 ring-4 ring-[#080c14]">
                                        <span className="text-xl font-bold text-white">{initials}</span>
                                    </div>
                                </div>
                                <h2 className="text-lg font-bold text-slate-100 leading-tight">{user?.full_name ?? "—"}</h2>
                                <p className="text-sm text-slate-500 mt-0.5 truncate">{user?.email ?? "No email"}</p>

                                <div className="mt-4 pt-4 border-t border-white/[0.05] flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <svg className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 11.72 19.79 19.79 0 0 1 1.97 3.1 2 2 0 0 1 3.95 .92h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                        {user?.phone ?? <span className="italic text-slate-600">No phone</span>}
                                    </div>
                                    <div className="flex items-start gap-2 text-xs text-slate-500">
                                        <svg className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        <span className="line-clamp-2">{user?.address ?? <span className="italic text-slate-600">No address</span>}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notice card */}
                        <div className="bg-amber-500/[0.04] border border-amber-500/[0.12] rounded-2xl p-4 flex gap-3">
                            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <span className="text-amber-400/90 font-medium">User ID, NID & Email</span> are locked and cannot be changed. Contact support if needed.
                            </p>
                        </div>
                    </div>

                    {/* Fields — right columns */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        {/* Locked fields */}
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-px bg-slate-700" />
                                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">System Information</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {lockedFields.map(f => (
                                    <InfoField key={f.label} {...f} />
                                ))}
                            </div>
                            <button
                                onClick={() => navigate("/user/dashboard/profile/edit")} 
                                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-white/[0.07] text-slate-200 text-sm font-medium rounded-lg px-3 py-2 transition-all duration-200 flex-shrink-0"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Edit
                            </button>
                        </div>

                        {/* Editable fields */}
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-px bg-slate-700" />
                                    <span className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">Personal Details</span>
                                </div>
                                <button
                                    onClick={() => navigate("/user/dashboard/profile/edit")}
                                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    Edit →
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {editableFields.map(f => (
                                    <InfoField key={f.label} {...f} />
                                ))}
                            </div>
                        </div>

                        {/* Activity strip */}
                        <div className="bg-red-500/[0.05] border border-red-500/[0.2] rounded-2xl p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-xs tracking-[0.12em] uppercase text-red-300/90">Emergency Support</p>
                                    <p className="text-sm text-slate-300 mt-1">Use SOS for immediate danger and monitor officer assignment here.</p>
                                </div>
                                <button
                                    onClick={handleOneTapSos}
                                    disabled={isLocating || isTriggeringSos}
                                    className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-400 transition"
                                >
                                    {isLocating ? "Locating..." : isTriggeringSos ? "Sending..." : "One-Tap SOS"}
                                </button>
                            </div>

                            {sosNotice && (
                                <p className="text-xs text-red-200">{sosNotice}</p>
                            )}

                            {latestSos ? (
                                <div className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200">
                                    <p className="font-semibold text-red-200">
                                        {sosStatusLabel[latestSos.status] || latestSos.status}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Alert #{latestSos.sos_id} • {latestSos.thana_name} • {new Date(latestSos.created_at).toLocaleString()}
                                    </p>
                                    {latestSos.detected_address && (
                                        <p className="text-xs text-slate-400 mt-1">Location: {latestSos.detected_address}</p>
                                    )}
                                    {latestSos.assigned_officer_id && (
                                        <p className="text-xs text-emerald-300 mt-2">
                                            Assigned Officer: {latestSos.assigned_officer_name || latestSos.assigned_officer_id}
                                            {latestSos.assigned_officer_phone ? ` (${latestSos.assigned_officer_phone})` : ""}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400">No recent SOS activity.</p>
                            )}
                        </div>

                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">Account Verified</p>
                                    <p className="text-xs text-slate-500">Your identity has been confirmed</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
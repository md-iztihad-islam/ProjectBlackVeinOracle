import userStore from "@/state/userStore";
import { useNavigate } from "react-router-dom";

function UserProfile() {
    const navigate = useNavigate();
    const { user } = userStore();

    const infoFields = [
        { label: "User ID",     value: user?.user_id,     mono: true  },
        { label: "NID Number",  value: user?.nid_number,  mono: true  },
        { label: "Email",       value: user?.email                    },
        { label: "Phone",       value: user?.phone                    },
        { label: "Full Name",   value: user?.full_name                },
        { label: "Address",     value: user?.address                  },
    ];

    return (
        <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600 opacity-5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-2xl mx-auto flex flex-col gap-6">

                {/* Back + header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/user/dashboard")}
                        className="p-2 rounded-lg bg-gray-800 border border-white/[0.07] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">My Profile</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Your personal information</p>
                    </div>
                </div>

                {/* Profile card */}
                <div className="bg-gray-900 border border-white/[0.07] rounded-2xl overflow-hidden">

                    {/* Avatar banner */}
                    <div className="h-24 bg-gradient-to-r from-blue-600/20 to-emerald-600/10 border-b border-white/[0.05] relative">
                        <div className="absolute -bottom-8 left-6">
                            <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-gray-900 ring-2 ring-blue-500/30 flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-400">
                                    {user?.full_name?.charAt(0) ?? "U"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="px-5 sm:px-6 pt-12 pb-6 flex flex-col gap-6">
                        {/* Name + edit button */}
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-100">{user?.full_name}</h2>
                                <p className="text-sm text-slate-500">{user?.email}</p>
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

                        <div className="h-px bg-white/[0.04]" />

                        {/* Info grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {infoFields.map((f) => (
                                <div key={f.label} className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{f.label}</span>
                                    <span className={`text-sm text-slate-300 break-all ${f.mono ? "font-mono" : ""}`}>
                                        {f.value ?? <span className="text-slate-600 italic">Not provided</span>}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-white/[0.04]" />

                        {/* Read-only note */}
                        <p className="text-xs text-slate-600">
                            User ID, NID Number and Email cannot be changed. Contact support if you need to update these.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
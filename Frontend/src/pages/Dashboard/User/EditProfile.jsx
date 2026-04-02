import updateUserApi from "@/services/User/updateUserApi";
import userStore from "@/state/userStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
    const navigate = useNavigate();
    const { user, setUser } = userStore();

    const [fullName, setFullName] = useState(user?.full_name ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [address, setAddress] = useState(user?.address ?? "");
    const [birthDate, setBirthDate] = useState(user?.birth_date ? String(user.birth_date).slice(0, 10) : "");
    const [gender, setGender] = useState(user?.gender ?? "");
    const userId = user?.user_id;

    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: ({ userId, updatedData }) => updateUserApi({ userId, updatedData }),
        onSuccess: (data) => {
            setUser(data?.data ?? { ...user, full_name: fullName, phone, address, birth_date: birthDate, gender });
            navigate("/user/dashboard/profile");
        },
        onError: () => alert("Failed to update profile. Please try again."),
    });

    console.log("EditProfile render: ", { fullName, phone, address });

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            full_name: fullName,
            phone,
            address,
            birth_date: birthDate,
            gender,
        }
        updateUser({ userId, updatedData });
    };

    const inputClass =
        "w-full bg-gray-800 border border-white/[0.07] text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 hover:border-white/[0.12] transition-all duration-200";

    const labelClass = "text-xs font-medium text-slate-400 uppercase tracking-wider";

    const readOnlyFields = [
        { label: "User ID",    value: user?.user_id    },
        { label: "NID Number", value: user?.nid_number },
        { label: "Email",      value: user?.email      },
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
                        onClick={() => navigate("/user/dashboard/profile")}
                        className="p-2 rounded-lg bg-gray-800 border border-white/[0.07] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">Edit Profile</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Update your personal information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Read-only section */}
                    <div className="bg-gray-900 border border-white/[0.07] rounded-2xl overflow-hidden">
                        <div className="px-5 sm:px-6 py-4 border-b border-white/[0.05]">
                            <h2 className="text-sm font-semibold text-slate-200">Non-editable Information</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Contact support to update these fields</p>
                        </div>
                        <div className="px-5 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {readOnlyFields.map((f) => (
                                <div key={f.label} className="flex flex-col gap-1.5">
                                    <label className={`${labelClass} opacity-50`}>{f.label}</label>
                                    <div className="w-full bg-gray-800/50 border border-white/[0.04] text-slate-500 text-sm rounded-lg px-3 py-2.5 font-mono cursor-not-allowed select-none truncate">
                                        {f.value ?? "—"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Editable section */}
                    <div className="bg-gray-900 border border-white/[0.07] rounded-2xl overflow-hidden">
                        <div className="px-5 sm:px-6 py-4 border-b border-white/[0.05]">
                            <h2 className="text-sm font-semibold text-slate-200">Editable Information</h2>
                        </div>
                        <div className="px-5 sm:px-6 py-5 flex flex-col gap-4">

                            {/* Full Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your full name"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Phone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="House, Road, Area, District"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className={labelClass}>Birth Date</label>
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className={labelClass}>Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                        className={inputClass}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0"
                        >
                            {isPending ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/user/dashboard/profile")}
                            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-white/[0.07] text-slate-400 hover:text-slate-200 text-sm font-medium rounded-lg px-4 py-2.5 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
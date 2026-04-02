import registerUserApi from "@/services/User/registerUserApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterUser() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [nidNumber, setNidNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { mutate: registerUser, isPending } = useMutation({
        mutationFn: (userData) => registerUserApi(userData),
        onSuccess: () => {
            alert("Registration successful! You can now sign in with your credentials.");
            navigate("/user-signin");
        },
        onError: () => {
            alert("Failed to register user. Please try again.");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            full_name: fullName,
            nid_number: nidNumber,
            phone,
            email,
            address,
            birth_date: birthDate,
            gender,
            password,
        };
        registerUser(userData);
    };

    const inputClass =
        "w-full bg-gray-800 border border-white/[0.07] text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 hover:border-white/[0.12] transition-all duration-200";

    const labelClass = "text-xs font-medium text-slate-400 uppercase tracking-wider";

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-6">
            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600 opacity-5 rounded-full blur-3xl" />
            </div>

            {/* Card */}
            <div className="relative w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-white/[0.05]">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-widest uppercase rounded-full px-3 py-1 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Bangladesh Police
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                        Create Account
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                        Register to access the General Diary portal and submit reports online.
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 sm:px-8 py-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* NID + Phone row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>NID Number</label>
                                <input
                                    type="text"
                                    value={nidNumber}
                                    onChange={(e) => setNidNumber(e.target.value)}
                                    placeholder="National ID number"
                                    required
                                    className={inputClass}
                                />
                            </div>
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
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
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

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    required
                                    className={`${inputClass} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/[0.04]" />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            {isPending ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Registering…
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <line x1="20" y1="8" x2="20" y2="14" />
                                        <line x1="23" y1="11" x2="17" y2="11" />
                                    </svg>
                                    Create Account
                                </>
                            )}
                        </button>

                        {/* Sign in link */}
                        <p className="text-center text-xs text-slate-500">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/user-signin")}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterUser;
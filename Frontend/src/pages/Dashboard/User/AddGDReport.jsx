import getThanaByDistrictApi from "@/services/Thana/getThanaByDistrictApi";
import addGDReportApi from "@/services/User/addGDReportApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DISTRICTS = [
    "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola",
    "Bogura", "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram",
    "Chuadanga", "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur",
    "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj",
    "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah",
    "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram",
    "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura",
    "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh",
    "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
    "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
    "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati",
    "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj",
    "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
];

const StepIndicator = ({ step, current }) => {
    const done = current > step;
    const active = current === step;
    return (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
            done    ? "bg-emerald-500 border-emerald-500 text-white"
            : active ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40"
            :          "bg-transparent border-white/10 text-slate-600"
        }`}>
            {done ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            ) : step}
        </div>
    );
};

function AddGDReport() {
    const navigate = useNavigate();
    const [thana, setThana]           = useState("");
    const [description, setDescription] = useState("");
    const [district, setDistrict]     = useState("");
    const [submitted, setSubmitted]   = useState(false);

    const { data: thanaData, isLoading: thanaLoading } = useQuery({
        queryKey: ["thanaData", district],
        queryFn: () => getThanaByDistrictApi(district),
        enabled: !!district,
    });

    const thanas = thanaData?.data || [];

    const { mutate: addGDReport, isPending } = useMutation({
        mutationFn: (gdData) => addGDReportApi(gdData),
        onSuccess: () => {
            setSubmitted(true);
            setThana("");
            setDescription("");
            setDistrict("");
            setTimeout(() => setSubmitted(false), 5000);
        },
        onError: () => {
            alert("Failed to submit GD report. Please try again.");
        },
    });

    const handleDistrictChange = (e) => {
        setDistrict(e.target.value);
        setThana("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addGDReport({ thana_id: thana, description, status: "pending" });
    };

    const currentStep = !district ? 1 : !thana ? 2 : 3;
    const isFormValid = district && thana && description.trim().length > 0;

    const steps = [
        { n: 1, label: "Select District" },
        { n: 2, label: "Select Thana"    },
        { n: 3, label: "Describe Incident" },
    ];

    return (
        <div className="min-h-screen w-full bg-[#080c14] flex flex-col">

            {/* Ambient bg */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-blue-600/[0.04] rounded-full blur-[130px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-emerald-600/[0.03] rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.3]" style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px"}} />
            </div>

            <div className="relative flex flex-col flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">

                {/* ── Top bar ── */}
                <header className="flex items-center justify-between">
                    <button
                        onClick={() => navigate("/user/dashboard")}
                        className="group flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.07] group-hover:bg-white/[0.08] transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                            </svg>
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Dashboard</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-blue-400/70">Bangladesh Police</p>
                            <p className="text-xs text-slate-500">GD Portal</p>
                        </div>
                    </div>
                </header>

                {/* ── Page title ── */}
                <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-blue-400/70 font-medium mb-1">New Submission</p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">File GD Report</h1>
                    <p className="text-sm text-slate-500 mt-1.5">Submit your complaint or incident report to the nearest thana.</p>
                </div>

                {/* ── Main layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1">

                    {/* Left sidebar — steps + info */}
                    <div className="lg:col-span-1 flex flex-col gap-4">

                        {/* Steps */}
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-5">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-px bg-slate-700" />
                                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">Steps</span>
                            </div>
                            <div className="flex flex-col gap-0">
                                {steps.map((s, i) => (
                                    <div key={s.n} className="flex items-start gap-3">
                                        <div className="flex flex-col items-center">
                                            <StepIndicator step={s.n} current={currentStep} />
                                            {i < steps.length - 1 && (
                                                <div className={`w-px flex-1 min-h-[2rem] mt-1 mb-1 transition-colors duration-300 ${currentStep > s.n ? "bg-emerald-500/30" : "bg-white/[0.06]"}`} />
                                            )}
                                        </div>
                                        <div className="pt-1 pb-4">
                                            <p className={`text-sm font-medium transition-colors ${currentStep === s.n ? "text-slate-100" : currentStep > s.n ? "text-emerald-400" : "text-slate-600"}`}>
                                                {s.label}
                                            </p>
                                            {currentStep === s.n && (
                                                <p className="text-xs text-slate-500 mt-0.5">In progress</p>
                                            )}
                                            {currentStep > s.n && (
                                                <p className="text-xs text-emerald-500/70 mt-0.5">Complete</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info cards */}
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Reports are reviewed within <span className="text-blue-400 font-semibold">24 hours</span>. All submissions are filed as <span className="text-amber-400 font-semibold">Pending</span> initially.
                            </p>
                        </div>

                        <div className="bg-red-500/[0.04] border border-red-500/[0.12] rounded-2xl p-4 flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                For emergencies, call <span className="text-red-400 font-bold text-sm">999</span>. This form is for non-emergency documentation only.
                            </p>
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full">
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 sm:p-6 flex flex-col gap-6 flex-1">

                                {/* Location section */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-px bg-slate-700" />
                                        <span className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">Location</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* District */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase flex items-center gap-1.5">
                                                District
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={district}
                                                    onChange={handleDistrictChange}
                                                    className="w-full bg-[#0d1420] border border-white/[0.08] hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 text-slate-200 text-sm rounded-xl px-4 py-3 appearance-none cursor-pointer outline-none transition-all duration-200"
                                                >
                                                    <option value="" disabled className="bg-[#0d1420] text-slate-500">Select district…</option>
                                                    {DISTRICTS.map((d) => (
                                                        <option key={d} value={d} className="bg-[#0d1420] text-slate-200">{d}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                                    <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="6 9 12 15 18 9"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thana */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase flex items-center gap-1.5">
                                                Thana / Upazila
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={thana}
                                                    onChange={(e) => setThana(e.target.value)}
                                                    disabled={!district || thanaLoading}
                                                    className="w-full bg-[#0d1420] border border-white/[0.08] hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 text-slate-200 text-sm rounded-xl px-4 py-3 appearance-none cursor-pointer outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    <option value="" disabled className="bg-[#0d1420] text-slate-500">
                                                        {!district ? "Select district first" : thanaLoading ? "Loading…" : thanas.length === 0 ? "No thanas found" : "Select thana…"}
                                                    </option>
                                                    {thanas.map((t) => (
                                                        <option key={t.thana_id ?? t} value={t.thana_id ?? t} className="bg-[#0d1420] text-slate-200">
                                                            {t.thana_name ?? t}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                                    {thanaLoading ? (
                                                        <span className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin block" />
                                                    ) : (
                                                        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="6 9 12 15 18 9"/>
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected location chip */}
                                    {district && thana && (
                                        <div className="flex items-center gap-2 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl px-4 py-2.5">
                                            <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                            </svg>
                                            <span className="text-xs text-emerald-400 font-medium">
                                                {thanas.find(t => (t.thana_id ?? t) == thana)?.thana_name ?? thana}, {district}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-white/[0.04]" />

                                {/* Description section */}
                                <div className="flex flex-col gap-4 flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-px bg-slate-700" />
                                        <span className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">Incident Details</span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase flex items-center gap-1.5">
                                            Description
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe the incident in detail — include the date, time, location, parties involved, and any other relevant information…"
                                            maxLength={1000}
                                            rows={6}
                                            className="w-full bg-[#0d1420] border border-white/[0.08] hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 text-slate-200 text-sm rounded-xl px-4 py-3 resize-y outline-none placeholder:text-slate-600 transition-all duration-200 leading-relaxed"
                                        />
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                {description.length > 0 && description.length < 30 && (
                                                    <span className="text-xs text-amber-400/80">Please provide more detail</span>
                                                )}
                                                {description.length >= 30 && (
                                                    <span className="flex items-center gap-1 text-xs text-emerald-400/80">
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                                        Good detail
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-xs font-mono transition-colors ${description.length > 850 ? "text-red-400" : description.length > 700 ? "text-amber-400" : "text-slate-600"}`}>
                                                {description.length} / 1000
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/[0.04]" />

                                {/* Submit row */}
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 bg-amber-500/[0.08] border border-amber-500/20 rounded-full px-3 py-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                            <span className="text-xs text-amber-400 font-semibold">Pending</span>
                                        </div>
                                        <span className="text-xs text-slate-600">Initial status on submission</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!isFormValid || isPending}
                                        className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl px-6 py-3 transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-900/40 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
                                    >
                                        {isPending ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                                                Submitting…
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
                                                </svg>
                                                Submit Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── Success toast ── */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#071a10] border border-emerald-500/30 text-emerald-400 text-sm font-medium rounded-2xl px-5 py-3.5 shadow-2xl shadow-emerald-900/20 z-50 whitespace-nowrap transition-all duration-500 ${
                submitted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
            }`}>
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                GD Report submitted successfully!
                <button onClick={() => setSubmitted(false)} className="ml-1 text-emerald-600 hover:text-emerald-400 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default AddGDReport;
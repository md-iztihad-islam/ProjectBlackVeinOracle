import getThanaByDistrictApi from "@/services/Thana/getThanaByDistrictApi";
import addGDReportApi from "@/services/User/addGDReportApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

const GD_TYPES = [
    { value: "theft", label: "Theft" },
    { value: "lost_document", label: "Lost Document" },
    { value: "missing_person", label: "Missing Person" },
    { value: "accident", label: "Accident" },
    { value: "assault", label: "Assault / Violence" },
    { value: "robbery", label: "Robbery / Dacoity" },
    { value: "fraud", label: "Fraud / Cheating" },
    { value: "domestic_violence", label: "Domestic Violence" },
    { value: "property_dispute", label: "Property Dispute" },
    { value: "suspicious_activity", label: "Suspicious Activity" },
    { value: "threat", label: "Threat / Intimidation" },
    { value: "noise_disturbance", label: "Noise / Disturbance" },
    { value: "other", label: "Other" },
];

function AddGDReport() {
    const [thana, setThana] = useState("");
    const [description, setDescription] = useState("");
    const [district, setDistrict] = useState("");
    const [gdType, setGdType] = useState("");
    const [incidentDate, setIncidentDate] = useState("");
    const [incidentLocation, setIncidentLocation] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const { data: thanaData, isLoading: thanaLoading } = useQuery({
        queryKey: ["thanaData", district],
        queryFn: () => getThanaByDistrictApi(district),
        enabled: !!district,
    });

    const thanas = thanaData?.data || [];

    console.log("Thana data for district", district, ":", thanas);

    const { mutate: addGDReport, isPending } = useMutation({
        mutationFn: (gdData) => addGDReportApi(gdData),
            onSuccess: () => {
            setSubmitted(true);
            setThana("");
            setDescription("");
            setDistrict("");
            setGdType("");
            setIncidentDate("");
            setIncidentLocation("");
            setTimeout(() => setSubmitted(false), 4000);
        },
        onError: () => {
            alert("Failed to add GD report. Please try again.");
        },
    });

    const handleDistrictChange = (e) => {
        setDistrict(e.target.value);
        setThana("");
    };

    const handleSubmitGDReport = (e) => {
        e.preventDefault();
        const gdData = {
            thana_id: thana,
            gd_type: gdType,
            description,
            incident_date: incidentDate || null,
            incident_location: incidentLocation || null,
        };
        console.log("Submitting GD report with data:", gdData);
        addGDReport(gdData);
    };

    const isFormValid = district && thana && gdType && description.trim().length > 0;

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-6">
            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600 opacity-5 rounded-full blur-3xl" />
            </div>

            {/* Card */}
            <div className="relative w-full max-w-xl bg-gray-900 border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-white/[0.05]">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-widest uppercase rounded-full px-3 py-1 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Bangladesh Police
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                        General Diary Report
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                        Submit your complaint or incident report to the nearest thana. All reports are reviewed within 24 hours.
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 sm:px-8 py-6">
                    <form onSubmit={handleSubmitGDReport} className="flex flex-col gap-5">

                        {/* District + Thana row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* District */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    District
                                </label>
                                <select
                                    value={district}
                                    onChange={handleDistrictChange}
                                    className="w-full bg-gray-800 border border-white/[0.07] text-slate-200 text-sm rounded-lg px-3 py-2.5 appearance-none cursor-pointer outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 hover:border-white/[0.12] transition-all duration-200"
                                >
                                    <option value="" disabled className="text-slate-500 bg-gray-800">Select district</option>
                                    {DISTRICTS.map((d) => (
                                        <option key={d} value={d} className="bg-gray-800 text-slate-200">{d}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Thana */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Thana / Upazila
                                </label>
                                <div className="relative">
                                    <select
                                        value={thana}
                                        onChange={(e) => setThana(e.target.value)}
                                        disabled={!district || thanaLoading}
                                        className="w-full bg-gray-800 border border-white/[0.07] text-slate-200 text-sm rounded-lg px-3 py-2.5 appearance-none cursor-pointer outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 hover:border-white/[0.12] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled className="bg-gray-800">
                                            {!district
                                                ? "Select district first"
                                                : thanaLoading
                                                ? "Loading…"
                                                : thanas.length === 0
                                                ? "No thana found"
                                                : "Select thana"
                                            }
                                        </option>
                                        {thanas.map((t) => (
                                            <option key={t.thana_id ?? t} value={t.thana_id ?? t} className="bg-gray-800 text-slate-200">
                                                {t.thana_name ?? t}
                                            </option>
                                        ))}
                                    </select>
                                    {thanaLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin pointer-events-none" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* GD Type */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Report Type
                            </label>
                            <select
                                value={gdType}
                                onChange={(e) => setGdType(e.target.value)}
                                className="w-full bg-gray-800 border border-white/[0.07] text-slate-200 text-sm rounded-lg px-3 py-2.5 appearance-none cursor-pointer outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 hover:border-white/[0.12] transition-all duration-200"
                            >
                                <option value="" disabled className="text-slate-500 bg-gray-800">Select report type</option>
                                {GD_TYPES.map((t) => (
                                    <option key={t.value} value={t.value} className="bg-gray-800 text-slate-200">{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Incident Date + Location row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Incident Date
                                </label>
                                <input
                                    type="date"
                                    value={incidentDate}
                                    onChange={(e) => setIncidentDate(e.target.value)}
                                    className="w-full bg-gray-800 border border-white/[0.07] text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 hover:border-white/[0.12] transition-all duration-200"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Incident Location
                                </label>
                                <input
                                    type="text"
                                    value={incidentLocation}
                                    onChange={(e) => setIncidentLocation(e.target.value)}
                                    placeholder="e.g. Dhanmondi 27, Road 5"
                                    className="w-full bg-gray-800 border border-white/[0.07] text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 hover:border-white/[0.12] transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Incident Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the incident in detail — include date, time, location, and involved parties…"
                            maxLength={1000}
                            rows={5}
                            className="w-full bg-gray-800 border border-white/[0.07] text-slate-200 text-sm rounded-lg px-3 py-2.5 resize-y outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 hover:border-white/[0.12] transition-all duration-200 leading-relaxed"
                        />
                        <span className={`text-xs text-right transition-colors ${description.length > 800 ? "text-amber-400" : "text-slate-600"}`}>
                            {description.length} / 1000
                        </span>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/[0.04]" />

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                            Filed as{" "}
                            <span className="text-slate-400 font-medium">Submitted</span>
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid || isPending}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            {isPending ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Submitting…
                            </>
                            ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 2L11 13" />
                                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                                </svg>
                                Submit Report
                            </>
                            )}
                        </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Toast */}
            <div
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-sm font-medium rounded-xl px-5 py-3 shadow-2xl z-50 whitespace-nowrap transition-all duration-500 ${
                submitted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6 pointer-events-none"
                }`}
            >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">✓</span>
                GD Report submitted successfully!
            </div>
        </div>
    );
}

export default AddGDReport;
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import getArrestRecordByIdApi from "@/services/ArrestRecord/getArrestRecordByIdApi";
import getBailRecordByArrestIdApi from "@/services/Bail/getBailRecordByArrestIdApi";
import AddBailRecord from "../Bail/AddBailRecord";

// --- Configurations ---
const arrestStatusConfig = {
    in_custody:  { label: "In Custody",  classes: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    on_bail:     { label: "On Bail",     classes: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
    released:    { label: "Released",    classes: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
    transferred: { label: "Transferred", classes: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
};

const bailStatusConfig = {
    pending:  { label: "Pending",  classes: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
    granted:  { label: "Granted",  classes: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
    rejected: { label: "Rejected", classes: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

// --- Helper Functions ---
function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateShort(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(amount) {
    if (amount == null || amount === "") return null;
    return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 2 }).format(amount);
}

// --- Sub-components ---
function StatusBadge({ status, config }) {
    const cfg = config[status] || Object.values(config)[0];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${cfg.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function InfoBlock({ title, value, mono, highlight }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
            <p className={`text-sm ${highlight ? 'text-blue-700 font-semibold' : 'text-gray-900'} ${mono ? 'font-mono' : ''}`}>
                {value || "—"}
            </p>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 mb-4 shadow-sm animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-2 gap-6">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

// --- Main Component ---
export default function ArrestRecordDetails() {
    const navigate = useNavigate();
    const { arrestId } = useParams();
    
    // State to manage the Add Bail Modal visibility
    const [isAddBailModalOpen, setIsAddBailModalOpen] = useState(false);

    // Fetch Arrest Data
    const { data: arrestRecordData, isLoading: arrestLoading, error: arrestError } = useQuery({
        queryKey: ["arrestRecord", arrestId],
        queryFn: () => getArrestRecordByIdApi(arrestId),
        cacheTime: 2 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
    });

    // Fetch Bail Data linked to this Arrest
    const { data: bailData, isLoading: bailLoading } = useQuery({
        queryKey: ["bailRecord", arrestId],
        queryFn: () => getBailRecordByArrestIdApi(arrestId),
        cacheTime: 2 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
        enabled: !!arrestId,
    });

    const r = arrestRecordData?.data || {};

    const bailRecords = Array.isArray(bailData?.data)
        ? bailData.data
        : bailData?.data
        ? [bailData.data]
        : [];

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans flex justify-center">
            <div className="w-full max-w-5xl">

                {/* Back Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
                >
                    <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Arrest Records
                </button>

                {arrestLoading ? (
                    <SkeletonCard />
                ) : arrestError ? (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-8 text-center rounded-xl">
                        Failed to load arrest record details. Please try again.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* ── Left Column: Arrest Core & Bail Records ── */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Arrest Core Details Card */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-start gap-4 flex-wrap">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Arrest Record</p>
                                        <h1 className="text-2xl font-bold text-gray-900 font-mono">{r.arrest_id}</h1>
                                    </div>
                                    <StatusBadge status={r.custody_status} config={arrestStatusConfig} />
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <InfoBlock title="Arrest Date" value={formatDate(r.arrest_date)} />
                                        <InfoBlock title="Case Reference" value={r.case_reference} mono />
                                        <InfoBlock title="Bail Due Date" value={formatDate(r.bail_due_date)} highlight={!!r.bail_due_date} />
                                    </div>

                                    {/* Active Incarceration Block */}
                                    {r.active_incarceration && (
                                        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-5">
                                            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Current Placement</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <InfoBlock title="Facility" value={r.active_incarceration.jail_name} />
                                                <InfoBlock title="Location" value={`${r.active_incarceration.block_name} — Cell ${r.active_incarceration.cell_number}`} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bail Records Card */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Bail Applications</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {bailLoading ? "Loading..." : `${bailRecords.length} record${bailRecords.length !== 1 ? "s" : ""} found`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddBailModalOpen(true)}
                                        className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                        + Add Bail
                                    </button>
                                </div>

                                {bailLoading ? (
                                    <div className="p-6 flex justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                                    </div>
                                ) : bailRecords.length === 0 ? (
                                    <div className="p-8 text-center bg-gray-50">
                                        <p className="text-sm text-gray-500">No bail records attached to this arrest.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {bailRecords.map((bail) => (
                                            <div
                                                key={bail.bail_id}
                                                onClick={() => navigate(`/officer/dashboard/arrest-records/${arrestId}/bail-record-details/${bail.bail_id}`)}
                                                className="p-5 hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center gap-4 group"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-mono text-sm text-gray-500">#{bail.bail_id}</span>
                                                        <StatusBadge status={bail.status} config={bailStatusConfig} />
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-900">{bail.court_name}</p>
                                                    {bail.surety_name && <p className="text-xs text-gray-500 mt-1">Surety: {bail.surety_name}</p>}
                                                </div>
                                                <div className="text-right">
                                                    {bail.bail_amount && (
                                                        <p className="font-mono text-sm font-bold text-green-600 mb-1">
                                                            {formatCurrency(bail.bail_amount)}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-500">{bail.granted_at ? formatDateShort(bail.granted_at) : "Pending Review"}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* ── Right Column: Entities (Subject & Thana) ── */}
                        <div className="space-y-6">
                            
                            {/* Subject Profile Card */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Subject Profile</h3>
                                
                                <div className="flex items-center gap-4 mb-5">
                                    {r.criminal?.image_url ? (
                                        <img src={r.criminal.image_url} alt="Profile" className="w-12 h-12 rounded-full border border-gray-200" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                                            {r.criminal?.full_name ? r.criminal.full_name.split(" ").map(n => n[0]).slice(0, 2).join("") : "??"}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-gray-900">{r.criminal?.full_name || r.criminal_name || "Unknown"}</p>
                                        <p className="text-xs font-mono text-gray-500 mt-0.5">{r.criminal?.criminal_id || r.criminal_id}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <InfoBlock title="NID Number" value={r.criminal?.nid} mono />
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Risk Level</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            r.criminal?.risk_level >= 4 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            Level {r.criminal?.risk_level || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Jurisdiction Card */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Jurisdiction</h3>
                                <div className="space-y-4">
                                    <InfoBlock title="Processing Thana" value={r.thana?.thana_name || r.thana_name} />
                                    <InfoBlock title="Thana ID" value={r.thana?.thana_id || r.thana_id} mono />
                                    {r.thana?.district && (
                                        <InfoBlock title="District / Zone" value={`${r.thana.district} — ${r.thana.zone}`} />
                                    )}
                                </div>
                            </div>

                            {/* Actions List */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                                <button
                                    onClick={() => navigate(`/officer/dashboard/update-arrest-record/${arrestId}`)}
                                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit Arrest Details
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {/* Modal Overlay */}
            <AddBailRecord 
                isOpen={isAddBailModalOpen} 
                onClose={() => setIsAddBailModalOpen(false)} 
                arrestId={arrestId} 
            />
        </div>
    );
}
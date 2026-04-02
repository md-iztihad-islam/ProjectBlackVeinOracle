import getBailRecordByIdApi from "@/services/Bail/getBailRecordByIdApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

// Updated for Light Theme Tailwind classes
const statusConfig = {
    pending:  { label: "Pending",  classes: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
    granted:  { label: "Granted",  classes: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
    rejected: { label: "Rejected", classes: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function formatCurrency(amount) {
    if (amount == null || amount === "") return "—";
    return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 2 }).format(amount);
}

function StatusBadge({ status, config }) {
    const cfg = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${cfg.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function InfoBlock({ title, value, mono }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
            <p className={`text-sm text-gray-900 ${mono ? 'font-mono' : ''}`}>
                {value || "—"}
            </p>
        </div>
    );
}

function SkeletonDetails() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 mb-4 shadow-sm animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-8" />
            <div className="h-20 w-full bg-gray-50 border border-gray-100 rounded-lg mb-8" />
            <div className="grid grid-cols-2 gap-6">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

export default function BailRecordDetails() {
    const navigate = useNavigate();
    const { bailId } = useParams();

    const { data: bailRecordData, isLoading, error } = useQuery({
        queryKey: ["bailRecord", bailId],
        queryFn: () => getBailRecordByIdApi(bailId),
        cacheTime: 2 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
    });

    const r = bailRecordData?.data || {};

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans flex justify-center">
            <div className="w-full max-w-5xl">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <button onClick={() => navigate("/arrest-records")} className="hover:text-gray-900 transition-colors">Arrest Records</button>
                    <span className="text-gray-300">/</span>
                    <button 
                        onClick={() => r.arrest_id && navigate(`/arrest-records/${r.arrest_id}`)} 
                        className="hover:text-gray-900 transition-colors font-mono"
                    >
                        {r.arrest_id || "..."}
                    </button>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-medium">Bail #{bailId}</span>
                </nav>

                {isLoading ? <SkeletonDetails /> : error ? (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-8 text-center rounded-xl">
                        Failed to load bail record details.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* ── Left Column: Primary Bail Data ── */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                
                                {/* Header */}
                                <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-start flex-wrap gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bail Application</p>
                                        <h1 className="text-2xl font-bold text-gray-900 font-mono">#{r.bail_id}</h1>
                                    </div>
                                    <StatusBadge status={r.status} config={statusConfig} />
                                </div>

                                <div className="p-6 md:p-8">
                                    {/* Prominent Amount Display */}
                                    {r.bail_amount && (
                                        <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-8 flex justify-between items-center">
                                            <span className="text-sm font-bold text-green-800 uppercase tracking-wider">Set Amount</span>
                                            <span className="text-2xl font-black text-green-700 font-mono tracking-tight">
                                                {formatCurrency(r.bail_amount)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Application Details */}
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Application Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                        <InfoBlock title="Hearing Court" value={r.court_name} />
                                        <InfoBlock title="Surety Provider" value={r.surety_name} />
                                        <InfoBlock title="Decision Date" value={formatDate(r.granted_at)} />
                                        <InfoBlock title="Associated Arrest ID" value={r.arrest_id} mono />
                                    </div>
                                </div>
                            </div>

                            {/* Actions Container */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => r.arrest_id && navigate(`/arrest-records/${r.arrest_id}/bail`)}
                                    className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    View All Arrest Bails
                                </button>
                                <button
                                    onClick={() => navigate(`/bail-records/${bailId}/edit`)}
                                    className="flex-[2] py-3 px-4 bg-blue-600 border border-transparent text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Edit Record
                                </button>
                            </div>
                        </div>

                        {/* ── Right Column: Related Context ── */}
                        <div className="space-y-6">
                            
                            {/* Linked Criminal Profile */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Subject Profile</h3>
                                
                                {r.criminal ? (
                                    <>
                                        <div className="flex items-center gap-4 mb-5">
                                            {r.criminal.image_url ? (
                                                <img src={r.criminal.image_url} alt="Profile" className="w-12 h-12 rounded-full border border-gray-200" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                                                    {r.criminal.full_name?.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900">{r.criminal.full_name}</p>
                                                <p className="text-xs font-mono text-gray-500 mt-0.5">{r.criminal.criminal_id}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <InfoBlock title="NID Number" value={r.criminal.nid} mono />
                                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <span className="text-xs font-semibold text-gray-500 uppercase">Risk Level</span>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    r.criminal.risk_level >= 4 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    Level {r.criminal.risk_level || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No subject data available.</p>
                                )}
                            </div>

                            {/* Linked Arrest Record */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Original Arrest</h3>
                                
                                {r.arrest ? (
                                    <div className="space-y-4">
                                        <InfoBlock title="Arrest ID" value={r.arrest.arrest_id} mono />
                                        <InfoBlock title="Arrest Date" value={formatDate(r.arrest.arrest_date)} />
                                        <InfoBlock title="Case Reference" value={r.arrest.case_reference} mono />
                                        
                                        <button 
                                            onClick={() => navigate(`/arrest-records/${r.arrest.arrest_id}`)}
                                            className="w-full mt-2 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                        >
                                            Go To Arrest
                                            <span className="text-gray-400">→</span>
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No arrest context available.</p>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
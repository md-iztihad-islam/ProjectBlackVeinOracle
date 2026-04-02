import getOrganizationByIdApi from "@/services/Criminal/getOrganizationByIdApi";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

function Organization() {
    const { orgId } = useParams();
    const navigate = useNavigate();

    const { data: orgData, isLoading, isError } = useQuery({
        queryKey: ["organization", orgId],
        queryFn: () => getOrganizationByIdApi(orgId),
        enabled: !!orgId,
    });

    const organization = orgData?.data;

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper to determine threat level color
    const getThreatColor = (level) => {
        if (level >= 8) return "bg-red-50 text-red-700 border-red-200";
        if (level >= 5) return "bg-orange-50 text-orange-700 border-orange-200";
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    };

    // Helper for member status styling
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'in_custody': return "bg-blue-50 text-blue-700";
            case 'wanted': return "bg-red-50 text-red-700";
            case 'on_bail': return "bg-yellow-50 text-yellow-700";
            case 'escaped': return "bg-purple-50 text-purple-700";
            case 'released': return "bg-green-50 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    if (isError || !organization) {
        return (
            <div className="p-6 max-w-5xl mx-auto text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Unable to load organization details. Please try again.
                </div>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
                >
                    <svg 
                        className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to previous
                </button>

                {/* Main Organization Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Header: Identity & Core Stats */}
                    <div className="border-b border-gray-100 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {organization.name}
                                </h1>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="font-mono">ID: {organization.org_id}</span>
                                    <span>•</span>
                                    <span>Identified: {formatDate(organization.created_at)}</span>
                                </div>
                            </div>
                            
                            <div className={`px-4 py-2 rounded-lg border ${getThreatColor(organization.threat_level)} flex flex-col items-center`}>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Threat Level</span>
                                <span className="text-xl font-black">{organization.threat_level}/10</span>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Members</p>
                                <p className="text-2xl font-semibold text-gray-900">{organization.total_criminals}</p>
                            </div>
                            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">In Custody</p>
                                <p className="text-2xl font-semibold text-blue-900">{organization.in_custody_count}</p>
                            </div>
                            <div className="bg-red-50/50 rounded-lg p-4 border border-red-100">
                                <p className="text-xs text-red-600 uppercase tracking-wider font-semibold mb-1">Wanted / Escaped</p>
                                <p className="text-2xl font-semibold text-red-900">
                                    {parseInt(organization.wanted_count) + parseInt(organization.escaped_count)}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Avg Risk Level</p>
                                <p className="text-2xl font-semibold text-gray-900">{organization.avg_member_risk_level}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 md:p-8 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Organizational Intelligence</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Known Ideology / M.O.</p>
                                <p className="text-gray-900 font-medium">{organization.ideology || "Unknown"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Highest Known Member Risk</p>
                                <p className="text-gray-900 font-medium">Level {organization.max_member_risk_level}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Known Members Roster */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Known Associates & Members</h2>
                    </div>
                    
                    {organization.members && organization.members.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {organization.members.map((member) => (
                                <div key={member.criminal_id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center gap-4">
                                    
                                    {/* Avatar & Basic Info */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <img 
                                            src={member.image_url} 
                                            alt={member.full_name} 
                                            className="w-12 h-12 rounded-full border border-gray-200 bg-gray-100 object-cover"
                                        />
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{member.full_name}</h4>
                                            <p className="text-xs font-mono text-gray-500 mt-0.5">{member.criminal_id}</p>
                                        </div>
                                    </div>

                                    {/* Role & Risk */}
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900"><span className="text-gray-500">Role:</span> {member.role}</p>
                                        <p className="text-sm text-gray-900 mt-0.5"><span className="text-gray-500">Risk Level:</span> {member.risk_level}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="md:text-right">
                                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider inline-block ${getStatusStyle(member.status)}`}>
                                            {member.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No known members associated with this organization in the database.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Organization;
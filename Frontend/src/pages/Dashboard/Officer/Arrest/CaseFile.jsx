import getCaseFileByCaseIdApi from "@/services/Criminal/getCaseFileByCaseIdApi";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

function CaseFile() {
    const { caseId } = useParams();
    const navigate = useNavigate();

    const { data: caseFileData, isLoading, isError } = useQuery({
        queryKey: ["caseFile", caseId],
        queryFn: () => getCaseFileByCaseIdApi(caseId),
        enabled: !!caseId,
    });

    const caseFile = caseFileData?.data;

    // Helper function to format the ISO date string
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    if (isError || !caseFile) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Unable to load case file information. Please try again.
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
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
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

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Header Section */}
                    <div className="border-b border-gray-100 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {caseFile.case_title || "Untitled Case"}
                                </h1>
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                                    caseFile.status === 'open' 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {caseFile.status}
                                </span>
                            </div>
                            <p className="text-sm font-mono text-gray-500">
                                Case No: {caseFile.case_number}
                            </p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                            
                            {/* Case Details Group */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">
                                    Case Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Case Type</p>
                                        <p className="font-medium text-gray-900 capitalize">{caseFile.case_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Filed At</p>
                                        <p className="font-medium text-gray-900">{formatDate(caseFile.filed_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="text-gray-800 text-sm mt-1 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            {caseFile.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Entity Details Group */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">
                                        Subject Information
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">Primary Suspect</p>
                                        <p className="font-semibold text-gray-900">{caseFile.criminal_name}</p>
                                        <p className="text-xs font-mono text-gray-500 mt-0.5">ID: {caseFile.criminal_id}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">
                                        Jurisdiction
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Reporting Thana</p>
                                            <p className="font-medium text-gray-900">{caseFile.thana_name}</p>
                                            <p className="text-xs font-mono text-gray-500 mt-0.5">ID: {caseFile.thana_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CaseFile;
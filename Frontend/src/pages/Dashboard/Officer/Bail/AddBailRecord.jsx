import addBailRecordApi from "@/services/Bail/addBailRecordApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const bailStatusOptions = [
    { value: "pending",  label: "Pending" },
    { value: "granted",  label: "Granted" },
    { value: "rejected", label: "Rejected" },
];

function Field({ label, hint, children }) {
    return (
        <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {label}
                </label>
                {hint && <span className="text-[11px] text-gray-400 font-medium">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

export default function AddBailRecord({ isOpen, onClose, arrestId }) {
    const queryClient = useQueryClient();

    const [courtName, setCourtName]   = useState("");
    const [bailAmount, setBailAmount] = useState("");
    const [grantedAt, setGrantedAt]   = useState("");
    const [suretyName, setSuretyName] = useState("");
    const [status, setStatus]         = useState("pending");

    const { mutate: addBailRecord, isPending, isSuccess, isError } = useMutation({
        mutationFn: (bailData) => addBailRecordApi(bailData),
        onSuccess: () => {
            queryClient.invalidateQueries(["bailRecord", arrestId]);
            // Reset form and close modal after a brief delay for the success message
            setTimeout(() => {
                setCourtName("");
                setBailAmount("");
                setGrantedAt("");
                setSuretyName("");
                setStatus("pending");
                onClose();
            }, 1000);
        },
    });

    const isValid = courtName.trim();

    const handleSubmit = () => {
        if (!isValid) return;
        addBailRecord({
            arrest_id:   arrestId,
            court_name:  courtName.trim(),
            bail_amount: bailAmount ? parseFloat(bailAmount) : null,
            granted_at:  grantedAt || null,
            surety_name: suretyName.trim() || null,
            status,
        });
    };

    if (!isOpen) return null;

    const inputClasses = "w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Add Bail Record</h2>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">Arrest ID: {arrestId}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 overflow-y-auto">
                    {isSuccess && (
                        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                            <span>✓</span> Bail record added successfully.
                        </div>
                    )}
                    {isError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2">
                            <span>✕</span> Failed to add bail record. Please try again.
                        </div>
                    )}

                    <Field label="Court Name" hint="Required">
                        <input
                            className={inputClasses}
                            value={courtName}
                            onChange={e => setCourtName(e.target.value)}
                            placeholder="e.g. Dhaka Sessions Court"
                            disabled={isPending || isSuccess}
                        />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Bail Amount" hint="Optional">
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">৳</span>
                                <input
                                    className={`${inputClasses} pl-8`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={bailAmount}
                                    onChange={e => setBailAmount(e.target.value)}
                                    placeholder="0.00"
                                    disabled={isPending || isSuccess}
                                />
                            </div>
                        </Field>
                        <Field label="Decision Date" hint="Optional">
                            <input
                                className={inputClasses}
                                type="date"
                                value={grantedAt}
                                onChange={e => setGrantedAt(e.target.value)}
                                disabled={isPending || isSuccess}
                            />
                        </Field>
                    </div>

                    <Field label="Surety Name" hint="Optional">
                        <input
                            className={inputClasses}
                            value={suretyName}
                            onChange={e => setSuretyName(e.target.value)}
                            placeholder="Full name of surety"
                            disabled={isPending || isSuccess}
                        />
                    </Field>

                    <Field label="Status" hint="Required">
                        <select
                            className={inputClasses}
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            disabled={isPending || isSuccess}
                        >
                            {bailStatusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isPending || isSuccess}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !isValid || isSuccess}
                        className={`px-6 py-2 border border-transparent text-white rounded-lg text-sm font-medium shadow-sm transition-all ${
                            isPending || !isValid || isSuccess ? "opacity-60 cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isPending ? "Saving..." : "Add Record"}
                    </button>
                </div>

            </div>
        </div>
    );
}
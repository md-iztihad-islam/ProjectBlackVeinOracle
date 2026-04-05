import getArrestRecordByIdApi from "@/services/ArrestRecord/getArrestRecordByIdApi";
import updateArrestRecordApi from "@/services/ArrestRecord/updateArrestRecordApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const custodyOptions = [
  { value: "in_custody",  label: "In Custody" },
  { value: "on_bail",     label: "On Bail" },
  { value: "released",    label: "Released" },
  { value: "transferred", label: "Transferred" },
];

function Field({ label, hint, children }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-gray-500">
          {label}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function toDateInputValue(iso) {
  if (!iso) return "";
  return iso.split("T")[0];
}

function SkeletonForm() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-5 animate-pulse">
          <div className="h-2.5 w-1/4 rounded bg-gray-100 mb-2" />
          <div className="h-10 rounded-lg bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default function UpdateArrestRecord() {
  const navigate = useNavigate();
  const { arrestId } = useParams();
  const queryClient = useQueryClient();

  const { data: arrestRecordData, isLoading, error } = useQuery({
    queryKey: ["arrestRecord", arrestId],
    queryFn: () => getArrestRecordByIdApi(arrestId),
    cacheTime: 2 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const arrestRecord = arrestRecordData?.data || null;

  const [criminalId, setCriminalId]       = useState("");
  const [arrestDate, setArrestDate]       = useState("");
  const [bailDueDate, setBailDueDate]     = useState("");
  const [custodyStatus, setCustodyStatus] = useState("in_custody");
  const [caseReference, setCaseReference] = useState("");

  useEffect(() => {
    if (arrestRecord) {
      setCriminalId(arrestRecord.criminal_id || "");
      setArrestDate(toDateInputValue(arrestRecord.arrest_date));
      setBailDueDate(toDateInputValue(arrestRecord.bail_due_date));
      setCustodyStatus(arrestRecord.custody_status || "in_custody");
      setCaseReference(arrestRecord.case_reference || "");
    }
  }, [arrestRecord]);

  const { mutate: updateArrestRecord, isPending, isSuccess, isError } = useMutation({
    mutationFn: (updatedData) => updateArrestRecordApi({ arrestRecordId: arrestId, updatedData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arrestRecord", arrestId] });
      queryClient.invalidateQueries({ queryKey: ["arrestRecords"] });
    },
  });

  const isValid = criminalId.trim() && arrestDate;

  const handleUpdate = () => {
    if (!isValid) return;
    const updatedData = {
      criminal_id: criminalId.trim(),
      arrest_date: arrestDate,
      bail_due_date: bailDueDate || null,
      custody_status: custodyStatus,
      case_reference: caseReference.trim() || null,
    };

    updateArrestRecord(updatedData);
  };

  const inputClass =
    "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8 flex items-start justify-center">
      <div className="w-full max-w-xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 text-sm mb-6 hover:text-gray-600 transition bg-transparent border-none cursor-pointer p-0"
        >
          ← Back
        </button>

        {isLoading ? (
          <SkeletonForm />
        ) : error ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-red-500 text-sm shadow-sm">
            Failed to load record.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

            {/* Title */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
                Editing
              </p>
              <h1 className="text-xl font-bold text-gray-900 font-mono">
                {arrestId}
              </h1>
              {arrestRecord?.criminal_name && (
                <p className="text-gray-500 mt-1.5 text-sm">
                  {arrestRecord.criminal_name}
                </p>
              )}
            </div>

            {/* Banners */}
            {isSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-700 text-sm mb-6">
                <span>✓</span> Record updated successfully.
              </div>
            )}
            {isError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm mb-6">
                <span>✕</span> Failed to update. Please try again.
              </div>
            )}

            {/* Criminal ID */}
            <Field label="Criminal ID" hint="required">
              <input
                className={inputClass}
                value={criminalId}
                onChange={e => setCriminalId(e.target.value)}
                placeholder="CRM-0000001"
              />
            </Field>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Arrest Date" hint="required">
                <input
                  className={inputClass}
                  type="date"
                  value={arrestDate}
                  onChange={e => setArrestDate(e.target.value)}
                />
              </Field>
              <Field label="Bail Due Date" hint="optional">
                <input
                  className={inputClass}
                  type="date"
                  value={bailDueDate}
                  onChange={e => setBailDueDate(e.target.value)}
                  min={arrestDate || undefined}
                />
              </Field>
            </div>

            {/* Status */}
            <Field label="Custody Status">
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none cursor-pointer pr-8`}
                  value={custodyStatus}
                  onChange={e => setCustodyStatus(e.target.value)}
                >
                  {custodyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                  ▼
                </span>
              </div>
            </Field>

            {/* Case Reference */}
            <Field label="Case Reference" hint="optional">
              <input
                className={inputClass}
                value={caseReference}
                onChange={e => setCaseReference(e.target.value)}
                placeholder="CF-2024-DHK-001"
              />
            </Field>

            <div className="border-t border-gray-100 my-6" />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 text-sm font-medium cursor-pointer hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isPending || !isValid}
                className={`flex-[2] py-2.5 bg-blue-600 border-none rounded-lg text-white text-sm font-semibold transition
                  ${isPending || !isValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"}`}
              >
                {isPending ? "Saving…" : "Save Changes"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
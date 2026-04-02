import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCaseFileById, updateCaseFile } from "@/services/Thana/thanaApi";

const CASE_TYPE_OPTIONS = [
  { value: "theft", label: "Theft" },
  { value: "robbery", label: "Robbery" },
  { value: "murder", label: "Murder" },
  { value: "assault", label: "Assault" },
  { value: "kidnapping", label: "Kidnapping" },
  { value: "fraud", label: "Fraud" },
  { value: "cyber_crime", label: "Cyber Crime" },
  { value: "drug_offense", label: "Drug Offense" },
  { value: "domestic_violence", label: "Domestic Violence" },
  { value: "extortion", label: "Extortion" },
  { value: "illegal_firearms", label: "Illegal Firearms" },
  { value: "human_trafficking", label: "Human Trafficking" },
  { value: "other", label: "Other" },
];

function UpdateCaseFile() {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const [form, setForm] = useState({
    case_title: "",
    case_type: "",
    status: "",
    description: "",
  });

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { data: caseFileData, isLoading: isLoadingCaseFile } = useQuery({
    queryKey: ["case-file-by-id", caseId],
    queryFn: () => getCaseFileById(caseId),
    enabled: Boolean(caseId),
  });

  const currentCaseFile = caseFileData?.data || {};

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        case_title: form.case_title || currentCaseFile.case_title || "",
        case_type: form.case_type || currentCaseFile.case_type || "",
        status: form.status || currentCaseFile.status || "open",
        description: form.description || currentCaseFile.description || "",
      };
      return updateCaseFile(caseId, payload);
    },
    onSuccess: (r) => {
      if (r.success) {
        alert("Case file updated!");
        navigate("/thana/dashboard");
      } else {
        alert(r.message || "Failed to update case file");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-slate-100 mb-2">Update Case File</h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{caseId}</p>
        <p className="text-xs text-slate-400 mb-4">
          Registered At: {currentCaseFile?.filed_at ? new Date(currentCaseFile.filed_at).toLocaleString() : "—"}
        </p>
        {isLoadingCaseFile && (
          <p className="text-sm text-slate-400 mb-4">Loading current data...</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Case Title</label>
            <input
              value={form.case_title || currentCaseFile.case_title || ""}
              onChange={(e) => set("case_title", e.target.value)}
              className={inputCls}
              placeholder="e.g. Sonargaon Bank Robbery"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Case Type</label>
            <select
              value={form.case_type || currentCaseFile.case_type || ""}
              onChange={(e) => set("case_type", e.target.value)}
              className={inputCls}
              required
            >
              <option value="">Select case type</option>
              {CASE_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status || currentCaseFile.status || "open"}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="open">Open</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Description</label>
            <textarea
              value={form.description || currentCaseFile.description || ""}
              onChange={(e) => set("description", e.target.value)}
              className={inputCls}
              rows={4}
            />
            {(form.case_type || currentCaseFile.case_type) === "other" && (
              <p className="text-xs text-amber-300 mt-1">
                For "Other" type, provide detailed context in description.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Case File"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCaseFile;

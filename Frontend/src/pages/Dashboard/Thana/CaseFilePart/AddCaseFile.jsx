import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import userStore from "@/state/userStore";
import { addCaseFile } from "@/services/Thana/thanaApi";

function AddCaseFile() {
  const navigate = useNavigate();
  const { user } = userStore();

  const [form, setForm] = useState({
    case_number: "",
    criminal_id: "",
    case_type: "other",
    status: "open",
    description: "",
  });

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      addCaseFile({
        ...form,
        thana_id: user?.thana_id,
      }),
    onSuccess: (r) => {
      if (r.success) {
        alert("Case file added!");
        navigate("/thana/dashboard");
      } else {
        alert(r.message || "Failed to add case file");
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

        <h1 className="text-2xl font-bold text-slate-100 mb-6">Add Case File</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Case Number</label>
            <input
              value={form.case_number}
              onChange={(e) => set("case_number", e.target.value)}
              className={inputCls}
              placeholder="e.g. CFS-2026-001"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Criminal ID</label>
            <input
              value={form.criminal_id}
              onChange={(e) => set("criminal_id", e.target.value)}
              className={inputCls}
              placeholder="e.g. CRM-0000001"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Case Type</label>
            <input
              value={form.case_type}
              onChange={(e) => set("case_type", e.target.value)}
              className={inputCls}
              placeholder="e.g. robbery"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
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
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputCls}
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Case File"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCaseFile;

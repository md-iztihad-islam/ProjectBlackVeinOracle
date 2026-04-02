import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCriminalById, updateCriminal } from "@/services/Thana/thanaApi";
import { useMutation, useQuery } from "@tanstack/react-query";

function UpdateCriminal() {
  const navigate = useNavigate();
  const { criminalId } = useParams();
  const [form, setForm] = useState({
    full_name: "",
    nid: "",
    status: "",
    risk_level: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { data: criminalData, isLoading: isLoadingCriminal } = useQuery({
    queryKey: ["criminal-by-id", criminalId],
    queryFn: () => getCriminalById(criminalId),
    enabled: Boolean(criminalId),
  });

  const currentCriminal = Array.isArray(criminalData?.data)
    ? criminalData.data[0]
    : criminalData?.data;

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        full_name: form.full_name || currentCriminal?.full_name || "",
        nid: form.nid || currentCriminal?.nid || "",
        status: form.status || currentCriminal?.status || "unknown",
        risk_level:
          form.risk_level === ""
            ? Number(currentCriminal?.risk_level ?? 1)
            : Number(form.risk_level),
      };
      return updateCriminal(criminalId, payload);
    },
    onSuccess: (r) => {
      if (r.success) {
        alert("Updated!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Update Criminal
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{criminalId}</p>
        {isLoadingCriminal && (
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
            <label className="text-xs text-slate-400 uppercase">Full Name</label>
            <input
              value={form.full_name || currentCriminal?.full_name || ""}
              onChange={(e) => set("full_name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">NID</label>
            <input
              value={form.nid || currentCriminal?.nid || ""}
              onChange={(e) => set("nid", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status || currentCriminal?.status || "unknown"}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="unknown">Unknown</option>
              <option value="wanted">Wanted</option>
              <option value="in_custody">In Custody</option>
              <option value="on_bail">On Bail</option>
              <option value="released">Released</option>
              <option value="escaped">Escaped</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Risk Level
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.risk_level === "" ? currentCriminal?.risk_level ?? "" : form.risk_level}
              onChange={(e) => set("risk_level", e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Criminal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCriminal;
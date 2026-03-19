import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function UpdateOrganization() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const [form, setForm] = useState({
    name: "",
    ideology: "",
    threat_level: 5,
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance
        .put(`/organization/update-organization/${orgId}`, form)
        .then((r) => r.data),
    onSuccess: (r) => {
      if (r.success) {
        alert("Organization updated!");
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
          Update Organization
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{orgId}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Ideology</label>
            <input
              value={form.ideology}
              onChange={(e) => set("ideology", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Threat Level (1-10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.threat_level}
              onChange={(e) => set("threat_level", Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Organization"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateOrganization;
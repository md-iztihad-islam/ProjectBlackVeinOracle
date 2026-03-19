import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function UpdateCriminalOrganization() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id: "",
    org_id: "",
    role: "member",
    status: "active",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Update existing link first. If not found, create a new one.
      try {
        const updateRes = await axiosInstance.put(
          `/criminal-organization/update-link/${form.criminal_id}/${form.org_id}`,
          { role: form.role },
        );
        return updateRes.data;
      } catch (err) {
        if (err?.response?.status === 404) {
          const createRes = await axiosInstance.post(
            "/criminal-organization/add-link",
            {
              criminal_id: form.criminal_id,
              org_id: form.org_id,
              role: form.role,
            },
          );
          return createRes.data;
        }
        throw err;
      }
    },
    onSuccess: (r) => {
      if (r.success) {
        alert("Link updated!");
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
        <h1 className="text-2xl font-bold text-slate-100 mb-6">
          Link Criminal to Organization
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID
            </label>
            <input
              value={form.criminal_id}
              onChange={(e) => set("criminal_id", e.target.value)}
              placeholder="CRM-0000001"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Organization ID
            </label>
            <input
              value={form.org_id}
              onChange={(e) => set("org_id", e.target.value)}
              placeholder="ORG-0000001"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Role in Organization
            </label>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className={inputCls}
            >
              <option value="member">Member</option>
              <option value="leader">Leader</option>
              <option value="financier">Financier</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspected">Suspected</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              UI-only field for analyst notes. Backend link table stores role only.
            </p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Submitting..." : "Link Criminal to Org"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCriminalOrganization;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function AddCriminalRelation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id_1: "",
    criminal_id_2: "",
    relation_type: "associate",
    notes: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance
        .post("/criminal-relation/add-relation", {
          criminal_id_1: form.criminal_id_1,
          criminal_id_2: form.criminal_id_2,
          relation_type: form.relation_type,
        })
        .then((r) => r.data),
    onSuccess: (r) => {
      if (r.success) {
        alert("Relation added!");
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
          Add Criminal Relation
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
              Criminal ID 1
            </label>
            <input
              value={form.criminal_id_1}
              onChange={(e) => set("criminal_id_1", e.target.value)}
              placeholder="CRM-0000001"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID 2
            </label>
            <input
              value={form.criminal_id_2}
              onChange={(e) => set("criminal_id_2", e.target.value)}
              placeholder="CRM-0000002"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Relationship Type
            </label>
            <select
              value={form.relation_type}
              onChange={(e) => set("relation_type", e.target.value)}
              className={inputCls}
            >
              <option value="associate">Associate</option>
              <option value="family">Family</option>
              <option value="financial">Financial</option>
              <option value="accomplice">Accomplice</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Relation"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCriminalRelation;
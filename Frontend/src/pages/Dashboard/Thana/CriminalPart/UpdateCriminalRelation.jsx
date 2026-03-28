import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateCriminalRelation } from "@/services/Thana/thanaApi";
import { useMutation } from "@tanstack/react-query";

function UpdateCriminalRelation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    relation_id: "",
    relation_type: "associate",
  });

  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateCriminalRelation(form.relation_id, {
        relation_type: form.relation_type,
      }),
    onSuccess: (r) => {
      if (r.success) {
        alert("Criminal relation updated!");
        navigate("/thana/dashboard");
      } else {
        alert(r.message || "Failed");
      }
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
          Update Criminal-Criminal Relation
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Relation ID</label>
            <input
              value={form.relation_id}
              onChange={(e) => set("relation_id", e.target.value)}
              placeholder="1"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Relation Type</label>
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

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Relation"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCriminalRelation;

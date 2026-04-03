import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCriminalRelations, updateCriminalRelation } from "@/services/Thana/thanaApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import getCriminalByNameApi from "@/services/Criminal/getCriminalByNameApi";

function UpdateCriminalRelation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    relation_id: "",
    relation_type: "associate",
  });
  const [criminalInput, setCriminalInput] = useState("");
  const [selectedCriminalId, setSelectedCriminalId] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { data: criminalSearchData } = useQuery({
    queryKey: ["update-relation-criminal-search", criminalInput],
    queryFn: () => getCriminalByNameApi(criminalInput),
    enabled: criminalInput.trim().length >= 2,
    staleTime: 30_000,
  });
  const criminalSuggestions = criminalSearchData?.data || [];

  const { data: relationsData } = useQuery({
    queryKey: ["all-criminal-relations-update-form"],
    queryFn: getAllCriminalRelations,
    staleTime: 30_000,
  });
  const allRelations = useMemo(() => relationsData?.data || [], [relationsData?.data]);

  const filteredRelations = useMemo(() => {
    if (!selectedCriminalId) return [];
    return allRelations.filter(
      (r) => r.criminal_id_1 === selectedCriminalId || r.criminal_id_2 === selectedCriminalId,
    );
  }, [allRelations, selectedCriminalId]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
          <div ref={ref}>
            <label className="text-xs text-slate-400 uppercase">Criminal</label>
            <div className="relative">
              <input
                value={criminalInput}
                onChange={(e) => {
                  setSelectedCriminalId("");
                  set("relation_id", "");
                  setCriminalInput(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => criminalInput.trim().length >= 2 && setOpen(true)}
                placeholder="Type one criminal name..."
                className={inputCls}
                required
              />
              {open && !selectedCriminalId && criminalSuggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {criminalSuggestions.map((c) => (
                    <button
                      key={c.criminal_id}
                      type="button"
                      onClick={() => {
                        setSelectedCriminalId(c.criminal_id);
                        setCriminalInput(`${c.full_name} (${c.criminal_id})`);
                        setOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-white/5 border-b border-white/5 last:border-0"
                    >
                      <span className="font-semibold text-slate-100">{c.full_name}</span>
                      <span className="text-slate-400 text-xs ml-2">{c.criminal_id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Relation</label>
            <select
              value={form.relation_id}
              onChange={(e) => {
                const relationId = e.target.value;
                set("relation_id", relationId);
                const rel = filteredRelations.find((r) => String(r.relation_id) === String(relationId));
                if (rel?.relation_type) set("relation_type", rel.relation_type);
              }}
              className={inputCls}
              required
              disabled={!selectedCriminalId}
            >
              <option value="">Select relation id</option>
              {filteredRelations.map((r) => (
                <option key={r.relation_id} value={r.relation_id}>
                  #{r.relation_id} • {r.criminal_1_name} ↔ {r.criminal_2_name}
                </option>
              ))}
            </select>
            {selectedCriminalId && filteredRelations.length === 0 && (
              <p className="text-xs text-amber-300 mt-1">No relations found for this criminal.</p>
            )}
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

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import getCriminalByNameApi from "@/services/Criminal/getCriminalByNameApi";

function AddCriminalRelation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id_1: "",
    criminal_id_2: "",
    relation_type: "associate",
    notes: "",
  });
  const [criminal1Input, setCriminal1Input] = useState("");
  const [criminal2Input, setCriminal2Input] = useState("");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const { data: c1Data } = useQuery({
    queryKey: ["relation-criminal-1", criminal1Input],
    queryFn: () => getCriminalByNameApi(criminal1Input),
    enabled: criminal1Input.trim().length >= 2,
    staleTime: 30_000,
  });
  const { data: c2Data } = useQuery({
    queryKey: ["relation-criminal-2", criminal2Input],
    queryFn: () => getCriminalByNameApi(criminal2Input),
    enabled: criminal2Input.trim().length >= 2,
    staleTime: 30_000,
  });

  const c1Suggestions = c1Data?.data || [];
  const c2Suggestions = c2Data?.data || [];

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref1.current && !ref1.current.contains(e.target)) setOpen1(false);
      if (ref2.current && !ref2.current.contains(e.target)) setOpen2(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
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
          <div ref={ref1}>
            <label className="text-xs text-slate-400 uppercase">Criminal A</label>
            <div className="relative">
              <input
                value={criminal1Input}
                onChange={(e) => {
                  set("criminal_id_1", "");
                  setCriminal1Input(e.target.value);
                  setOpen1(true);
                }}
                onFocus={() => criminal1Input.trim().length >= 2 && setOpen1(true)}
                placeholder="Type criminal name..."
                className={inputCls}
                required
              />
              {open1 && !form.criminal_id_1 && c1Suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {c1Suggestions.map((c) => (
                    <button
                      key={c.criminal_id}
                      type="button"
                      onClick={() => {
                        set("criminal_id_1", c.criminal_id);
                        setCriminal1Input(`${c.full_name} (${c.criminal_id})`);
                        setOpen1(false);
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
            {form.criminal_id_1 && <p className="text-xs text-emerald-300 mt-1">Selected ID: {form.criminal_id_1}</p>}
          </div>
          <div ref={ref2}>
            <label className="text-xs text-slate-400 uppercase">Criminal B</label>
            <div className="relative">
              <input
                value={criminal2Input}
                onChange={(e) => {
                  set("criminal_id_2", "");
                  setCriminal2Input(e.target.value);
                  setOpen2(true);
                }}
                onFocus={() => criminal2Input.trim().length >= 2 && setOpen2(true)}
                placeholder="Type criminal name..."
                className={inputCls}
                required
              />
              {open2 && !form.criminal_id_2 && c2Suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {c2Suggestions.map((c) => (
                    <button
                      key={c.criminal_id}
                      type="button"
                      onClick={() => {
                        set("criminal_id_2", c.criminal_id);
                        setCriminal2Input(`${c.full_name} (${c.criminal_id})`);
                        setOpen2(false);
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
            {form.criminal_id_2 && <p className="text-xs text-emerald-300 mt-1">Selected ID: {form.criminal_id_2}</p>}
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
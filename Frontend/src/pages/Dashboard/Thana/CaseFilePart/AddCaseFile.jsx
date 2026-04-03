import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import userStore from "@/state/userStore";
import { addCaseFile } from "@/services/Thana/thanaApi";
import getCriminalByNameApi from "@/services/Criminal/getCriminalByNameApi";

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

function AddCaseFile() {
  const navigate = useNavigate();
  const { user } = userStore();

  const [form, setForm] = useState({
    case_title: "",
    criminal_id: "",
    case_type: "theft",
    status: "open",
    description: "",
  });
  const [criminalInput, setCriminalInput] = useState("");
  const [criminalOpen, setCriminalOpen] = useState(false);
  const criminalRef = useRef(null);

  const { data: criminalSearchData } = useQuery({
    queryKey: ["case-file-criminal-search", criminalInput],
    queryFn: () => getCriminalByNameApi(criminalInput),
    enabled: criminalInput.trim().length >= 2,
    staleTime: 30_000,
  });
  const criminalSuggestions = criminalSearchData?.data || [];

  useEffect(() => {
    const onDocClick = (e) => {
      if (criminalRef.current && !criminalRef.current.contains(e.target)) {
        setCriminalOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
            <label className="text-xs text-slate-400 uppercase">Case Title</label>
            <input
              value={form.case_title}
              onChange={(e) => set("case_title", e.target.value)}
              className={inputCls}
              placeholder="e.g. Sonargaon Bank Robbery"
              required
            />
          </div>

          <div ref={criminalRef}>
            <label className="text-xs text-slate-400 uppercase">Criminal</label>
            <div className="relative">
              <input
                value={form.criminal_id ? criminalInput : criminalInput}
                onChange={(e) => {
                  set("criminal_id", "");
                  setCriminalInput(e.target.value);
                  setCriminalOpen(true);
                }}
                onFocus={() => criminalInput.trim().length >= 2 && setCriminalOpen(true)}
                className={inputCls}
                placeholder="Type criminal name..."
                required
              />
              {form.criminal_id && (
                <button
                  type="button"
                  onClick={() => {
                    set("criminal_id", "");
                    setCriminalInput("");
                    setCriminalOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-base"
                >
                  ×
                </button>
              )}
              {criminalOpen && !form.criminal_id && criminalSuggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {criminalSuggestions.map((c) => (
                    <button
                      key={c.criminal_id}
                      type="button"
                      onClick={() => {
                        set("criminal_id", c.criminal_id);
                        setCriminalInput(`${c.full_name} (${c.criminal_id})`);
                        setCriminalOpen(false);
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
            {form.criminal_id && (
              <p className="text-xs text-emerald-300 mt-1">Selected ID: {form.criminal_id}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Case Type</label>
            <select
              value={form.case_type}
              onChange={(e) => set("case_type", e.target.value)}
              className={inputCls}
              required
            >
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
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="open">Open</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="closed">Closed</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Registration time is auto-captured when you submit this case file.
            </p>
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
            {form.case_type === "other" && (
              <p className="text-xs text-amber-300 mt-1">
                For "Other" type, give specific legal/narrative details in description.
              </p>
            )}
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

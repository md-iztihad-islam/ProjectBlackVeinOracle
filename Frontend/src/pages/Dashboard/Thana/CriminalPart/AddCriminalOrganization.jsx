import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCriminalOrganizationLink } from "@/services/Thana/thanaApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import getCriminalByNameApi from "@/services/Criminal/getCriminalByNameApi";
import getOrganizationByNameApi from "@/services/Organization/getOrganizationByNameApi";

function AddCriminalOrganization() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id: "",
    org_id: "",
    role: "member",
  });
  const [criminalInput, setCriminalInput] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [openCriminal, setOpenCriminal] = useState(false);
  const [openOrg, setOpenOrg] = useState(false);
  const criminalRef = useRef(null);
  const orgRef = useRef(null);

  const { data: criminalData } = useQuery({
    queryKey: ["add-link-criminal-search", criminalInput],
    queryFn: () => getCriminalByNameApi(criminalInput),
    enabled: criminalInput.trim().length >= 2,
    staleTime: 30_000,
  });
  const { data: orgData } = useQuery({
    queryKey: ["add-link-org-search", orgInput],
    queryFn: () => getOrganizationByNameApi(orgInput),
    enabled: orgInput.trim().length >= 2,
    staleTime: 30_000,
  });

  const criminalSuggestions = criminalData?.data || [];
  const orgSuggestions = orgData?.data || [];

  useEffect(() => {
    const onDocClick = (e) => {
      if (criminalRef.current && !criminalRef.current.contains(e.target)) setOpenCriminal(false);
      if (orgRef.current && !orgRef.current.contains(e.target)) setOpenOrg(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => addCriminalOrganizationLink(form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Criminal organization relation added!");
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
          Add Criminal Organization Relation
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div ref={criminalRef}>
            <label className="text-xs text-slate-400 uppercase">Criminal</label>
            <div className="relative">
              <input
                value={criminalInput}
                onChange={(e) => {
                  set("criminal_id", "");
                  setCriminalInput(e.target.value);
                  setOpenCriminal(true);
                }}
                onFocus={() => criminalInput.trim().length >= 2 && setOpenCriminal(true)}
                placeholder="Type criminal name..."
                className={inputCls}
                required
              />
              {openCriminal && !form.criminal_id && criminalSuggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {criminalSuggestions.map((c) => (
                    <button
                      key={c.criminal_id}
                      type="button"
                      onClick={() => {
                        set("criminal_id", c.criminal_id);
                        setCriminalInput(`${c.full_name} (${c.criminal_id})`);
                        setOpenCriminal(false);
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

          <div ref={orgRef}>
            <label className="text-xs text-slate-400 uppercase">Organization</label>
            <div className="relative">
              <input
                value={orgInput}
                onChange={(e) => {
                  set("org_id", "");
                  setOrgInput(e.target.value);
                  setOpenOrg(true);
                }}
                onFocus={() => orgInput.trim().length >= 2 && setOpenOrg(true)}
                placeholder="Type organization name..."
                className={inputCls}
                required
              />
              {openOrg && !form.org_id && orgSuggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {orgSuggestions.map((o) => (
                    <button
                      key={o.org_id}
                      type="button"
                      onClick={() => {
                        set("org_id", o.org_id);
                        setOrgInput(`${o.name} (${o.org_id})`);
                        setOpenOrg(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-white/5 border-b border-white/5 last:border-0"
                    >
                      <span className="font-semibold text-slate-100">{o.name}</span>
                      <span className="text-slate-400 text-xs ml-2">{o.org_id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Role</label>
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

export default AddCriminalOrganization;

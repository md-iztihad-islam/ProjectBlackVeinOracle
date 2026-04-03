import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllCriminalOrganizationLinks } from "@/services/Thana/thanaApi";
import getCriminalByNameApi from "@/services/Criminal/getCriminalByNameApi";
import getOrganizationByNameApi from "@/services/Organization/getOrganizationByNameApi";

function UpdateCriminalOrganization() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id: "",
    org_id: "",
    role: "member",
  });
  const [criminalInput, setCriminalInput] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [selectedLink, setSelectedLink] = useState("");
  const [openCriminal, setOpenCriminal] = useState(false);
  const [openOrg, setOpenOrg] = useState(false);
  const criminalRef = useRef(null);
  const orgRef = useRef(null);
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { data: criminalData } = useQuery({
    queryKey: ["update-link-criminal-search", criminalInput],
    queryFn: () => getCriminalByNameApi(criminalInput),
    enabled: criminalInput.trim().length >= 2,
    staleTime: 30_000,
  });
  const { data: orgData } = useQuery({
    queryKey: ["update-link-org-search", orgInput],
    queryFn: () => getOrganizationByNameApi(orgInput),
    enabled: orgInput.trim().length >= 2,
    staleTime: 30_000,
  });
  const { data: linksData } = useQuery({
    queryKey: ["all-criminal-org-links-update-form"],
    queryFn: getAllCriminalOrganizationLinks,
    staleTime: 30_000,
  });

  const criminalSuggestions = criminalData?.data || [];
  const orgSuggestions = orgData?.data || [];
  const allLinks = useMemo(() => linksData?.data || [], [linksData?.data]);

  const filteredLinks = useMemo(() => {
    return allLinks.filter((l) => {
      const byCriminal = form.criminal_id ? l.criminal_id === form.criminal_id : true;
      const byOrg = form.org_id ? l.org_id === form.org_id : true;
      if (!form.criminal_id && !form.org_id) return false;
      return byCriminal && byOrg;
    });
  }, [allLinks, form.criminal_id, form.org_id]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (criminalRef.current && !criminalRef.current.contains(e.target)) setOpenCriminal(false);
      if (orgRef.current && !orgRef.current.contains(e.target)) setOpenOrg(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!form.criminal_id || !form.org_id) {
        throw new Error("Select criminal and organization from suggestions first.");
      }

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
    onError: (e) => {
      alert(e?.message || "Failed");
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
          <div ref={criminalRef}>
            <label className="text-xs text-slate-400 uppercase">Criminal</label>
            <div className="relative">
              <input
                value={criminalInput}
                onChange={(e) => {
                  set("criminal_id", "");
                  setSelectedLink("");
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
                  setSelectedLink("");
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
            <label className="text-xs text-slate-400 uppercase">Existing Link</label>
            <select
              value={selectedLink}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedLink(v);
                const [criminalId, orgId] = v.split("::");
                if (criminalId && orgId) {
                  set("criminal_id", criminalId);
                  set("org_id", orgId);
                  const row = filteredLinks.find((l) => `${l.criminal_id}::${l.org_id}` === v);
                  if (row?.role) set("role", row.role);
                }
              }}
              className={inputCls}
              disabled={filteredLinks.length === 0}
            >
              <option value="">Select existing link</option>
              {filteredLinks.map((l) => (
                <option key={`${l.criminal_id}-${l.org_id}`} value={`${l.criminal_id}::${l.org_id}`}>
                  {l.criminal_name} ({l.criminal_id}) ↔ {l.organization_name} ({l.org_id})
                </option>
              ))}
            </select>
            {(form.criminal_id || form.org_id) && filteredLinks.length === 0 && (
              <p className="text-xs text-amber-300 mt-1">No existing links matched. Submitting will create one if not found.</p>
            )}
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
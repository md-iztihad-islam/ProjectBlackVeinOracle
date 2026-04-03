import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import getOrganizationByNameApi from "@/services/Organization/getOrganizationByNameApi";

function UpdateOrganization() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const [orgIdInput, setOrgIdInput] = useState(orgId || "");
  const [orgSearchInput, setOrgSearchInput] = useState("");
  const [orgOpen, setOrgOpen] = useState(false);
  const orgRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    ideology: "",
    threat_level: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const targetOrgId = orgId || orgIdInput;
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { data: orgSearchData } = useQuery({
    queryKey: ["organization-search-update", orgSearchInput],
    queryFn: () => getOrganizationByNameApi(orgSearchInput),
    enabled: !orgId && orgSearchInput.trim().length >= 2,
    staleTime: 30_000,
  });
  const orgSuggestions = orgSearchData?.data || [];

  useEffect(() => {
    const onDocClick = (e) => {
      if (orgRef.current && !orgRef.current.contains(e.target)) {
        setOrgOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const { data: existingOrg } = useQuery({
    queryKey: ["organizationById", targetOrgId],
    queryFn: () =>
      axiosInstance
        .get(`/organization/get-organization/${targetOrgId}`)
        .then((r) => r.data?.data),
    enabled: !!targetOrgId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name?.trim() || undefined,
        ideology: form.ideology?.trim() || undefined,
        threat_level:
          form.threat_level === "" || form.threat_level === null
            ? undefined
            : Number(form.threat_level),
      };
      return axiosInstance
        .put(`/organization/update-organization/${targetOrgId}`, payload)
        .then((r) => r.data);
    },
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
        <p className="text-sm text-slate-500 mb-6 font-mono">{targetOrgId || "No ID selected"}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!targetOrgId) {
              alert("Organization ID is required");
              return;
            }
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          {!orgId && (
            <div ref={orgRef}>
              <label className="text-xs text-slate-400 uppercase">Organization</label>
              <div className="relative">
                <input
                  value={orgSearchInput}
                  onChange={(e) => {
                    setOrgIdInput("");
                    setOrgSearchInput(e.target.value);
                    setOrgOpen(true);
                  }}
                  onFocus={() => orgSearchInput.trim().length >= 2 && setOrgOpen(true)}
                  placeholder="Type organization name..."
                  className={inputCls}
                  required
                />
                {orgOpen && !orgIdInput && orgSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                    {orgSuggestions.map((o) => (
                      <button
                        key={o.org_id}
                        type="button"
                        onClick={() => {
                          setOrgIdInput(o.org_id);
                          setOrgSearchInput(`${o.name} (${o.org_id})`);
                          setOrgOpen(false);
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
              {orgIdInput && <p className="text-xs text-emerald-300 mt-1">Selected ID: {orgIdInput}</p>}
            </div>
          )}
          <div>
            <label className="text-xs text-slate-400 uppercase">Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder={existingOrg?.name || "Current name"}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Ideology</label>
            <input
              value={form.ideology}
              onChange={(e) => set("ideology", e.target.value)}
              placeholder={existingOrg?.ideology || "Current ideology"}
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
              placeholder={existingOrg?.threat_level || 5}
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
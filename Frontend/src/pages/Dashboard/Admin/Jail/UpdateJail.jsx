import getJailByIdApi from "@/services/Jail/getJailByIdApi";
import updateJailApi from "@/services/Jail/updateJailApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const labelClass = "block text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2";
const inputClass =
  "w-full bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none focus:border-blue-400/30 hover:border-slate-700 transition-colors appearance-none";
const hintClass = "text-[10px] text-slate-700 mt-1.5";

export default function UpdateJail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jailId } = useParams();
  const queryClient = useQueryClient();

  const navigateWithModal = (to) => {
    const isModal = Boolean(location.state?.modal);
    const backgroundLocation = location.state?.backgroundLocation || location;
    navigate(to, isModal ? { state: { modal: true, backgroundLocation } } : undefined);
  };

  const { data: jailData, isLoading: jailLoading, error: jailError } = useQuery({
    queryKey: ["jailData", jailId],
    queryFn: () => getJailByIdApi(jailId),
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    enabled: !!jailId,
  });

  const jailDetails = jailData?.data || {};

  const [jailName, setJailName]   = useState("");
  const [district, setDistrict]   = useState("");
  const [zone, setZone]           = useState("");
  const [address, setAddress]     = useState("");
  const [capacity, setCapacity]   = useState("");
  const [email, setEmail]         = useState("");
  const [formError, setFormError] = useState("");

  // Populate fields once data loads
  useEffect(() => {
    if (jailDetails?.jail_name) {
      setJailName(jailDetails.jail_name || "");
      setDistrict(jailDetails.district || "");
      setZone(jailDetails.zone || "");
      setAddress(jailDetails.address || "");
      setCapacity(jailDetails.capacity?.toString() || "");
      setEmail(jailDetails.email || "");
    }
  }, [jailDetails?.jail_name]);

  const { mutate: updateJail, isLoading: updateJailLoading } = useMutation({
    mutationFn: (data) => updateJailApi({ jailId, jailData: data }),
    onSuccess: () => {
      queryClient.invalidateQueries(["jailList"]);
      queryClient.invalidateQueries(["jailData", jailId]);
      navigateWithModal("/admin/dashboard/jaildashboard/jail-list");
    },
    onError: () => setFormError("Failed to update jail. Please try again."),
  });

  const handleUpdateJail = () => {
    setFormError("");
    if (!jailName.trim() || !district.trim() || !zone.trim() || !address.trim() || !capacity || !email.trim()) {
      setFormError("All fields are required.");
      return;
    }
    if (isNaN(parseInt(capacity)) || parseInt(capacity) < 1) {
      setFormError("Capacity must be a positive integer (≥ 1).");
      return;
    }
    updateJail({
      jail_name: jailName.trim(),
      district: district.trim(),
      zone: zone.trim(),
      address: address.trim(),
      capacity: parseInt(capacity),
      email: email.trim(),
    });
  };

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(96,165,250,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 inline-block mb-3">
          Edit Record
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Update <span className="text-blue-400">Jail</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Modify an existing facility record · ID:{" "}
          <span className="text-blue-400/60">{jailId}</span>
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Loading ── */}
      {jailLoading && (
        <div className="flex items-center gap-3 py-16 text-slate-700 text-[11px] tracking-widest">
          <div className="w-4 h-4 border border-slate-700 border-t-blue-400 rounded-full animate-spin" />
          LOADING FACILITY DATA...
        </div>
      )}

      {/* ── Fetch Error ── */}
      {jailError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-xl">
          ⚠ Failed to load facility data. Please go back and try again.
        </div>
      )}

      {/* ── Form Error ── */}
      {formError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-xl">
          ⚠ {formError}
        </div>
      )}

      {!jailLoading && !jailError && (
        <div className="max-w-xl flex flex-col gap-0">

          {/* Section: Facility Info */}
          <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-5 border-b border-slate-800/80">
            // Facility Details
          </div>

          <div className="mb-4">
            <label className={labelClass}>Facility Name *</label>
            <input
              className={inputClass}
              value={jailName}
              onChange={(e) => setJailName(e.target.value)}
              placeholder="e.g. Dhaka Central Jail"
              maxLength={100}
            />
            <p className={hintClass}>Max 100 characters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>District *</label>
              <input
                className={inputClass}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Dhaka"
                maxLength={100}
              />
            </div>
            <div>
              <label className={labelClass}>Zone *</label>
              <input
                className={inputClass}
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="e.g. Central"
                maxLength={100}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Address *</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full facility address..."
            />
          </div>

          <div className="mb-8">
            <label className={labelClass}>Capacity *</label>
            <input
              className={inputClass}
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 500"
            />
            <p className={hintClass}>Must be a positive integer (≥ 1)</p>
          </div>

          {/* Section: Access */}
          <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-5 border-b border-slate-800/80">
            // Access Credentials
          </div>

          <div className="mb-8">
            <label className={labelClass}>Email *</label>
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="facility@example.com"
              maxLength={100}
            />
            <p className={hintClass}>Must be unique across all facilities</p>
          </div>

          {/* ── Preview ── */}
          {(jailName || district || capacity) && (
            <div className="bg-blue-400/5 border border-blue-400/15 px-5 py-4 mb-8 flex items-center gap-5">
              <div
                className="w-12 h-12 flex items-center justify-center text-base font-black text-blue-400 bg-slate-800 border border-slate-700 flex-shrink-0"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                {capacity || "—"}
              </div>
              <div>
                <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Preview</div>
                <div className="text-white font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  {jailName || "Facility Name"}
                </div>
                <div className="text-[11px] text-blue-400 mt-0.5">
                  {[district, zone].filter(Boolean).join(" · ") || "District · Zone"}
                </div>
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800">
            <button
              onClick={handleUpdateJail}
              disabled={updateJailLoading}
              className="bg-blue-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 disabled:bg-blue-900 disabled:text-blue-700 disabled:translate-y-0 transition-all duration-150"
            >
              {updateJailLoading ? "SAVING..." : "SAVE CHANGES"}
            </button>
            <button
              onClick={() => navigateWithModal("/admin/dashboard/jaildashboard/jail-list")}
              className="border border-slate-800 text-slate-600 px-6 py-3.5 text-[13px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
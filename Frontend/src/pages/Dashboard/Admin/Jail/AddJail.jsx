import addJailApi from "@/services/Jail/addJailApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const labelClass = "block text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2";
const inputClass =
  "w-full bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none focus:border-blue-400/30 hover:border-slate-700 transition-colors appearance-none";
const hintClass = "text-[10px] text-slate-700 mt-1.5";

export default function AddJail() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const navigateWithModal = (to) => {
    const isModal = Boolean(location.state?.modal);
    const backgroundLocation = location.state?.backgroundLocation || location;
    navigate(to, isModal ? { state: { modal: true, backgroundLocation } } : undefined);
  };

  const [jailName, setJailName]   = useState("");
  const [district, setDistrict]   = useState("");
  const [zone, setZone]           = useState("");
  const [address, setAddress]     = useState("");
  const [capacity, setCapacity]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [formError, setFormError] = useState("");

  const { mutate: addJail, isLoading: addJailLoading } = useMutation({
    mutationFn: (jailData) => addJailApi(jailData),
    onSuccess: () => {
      queryClient.invalidateQueries(["jailList"]);
      navigateWithModal("/admin/dashboard/jaildashboard/jail-list");
    },
    onError: () => setFormError("Failed to add jail. Please try again."),
  });

  const handleAddJail = () => {
    setFormError("");
    if (!jailName.trim() || !district.trim() || !zone.trim() || !address.trim() || !capacity || !email.trim() || !password.trim()) {
      setFormError("All fields are required.");
      return;
    }
    if (isNaN(parseInt(capacity)) || parseInt(capacity) < 1) {
      setFormError("Capacity must be a positive integer (≥ 1).");
      return;
    }
    addJail({
      jail_name: jailName.trim(),
      district: district.trim(),
      zone: zone.trim(),
      address: address.trim(),
      capacity: parseInt(capacity),
      email: email.trim(),
      password: password.trim(),
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
          New Record
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Add <span className="text-blue-400">Jail</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Register a new detention facility in the system
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Error ── */}
      {formError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-xl">
          ⚠ {formError}
        </div>
      )}

      {/* ── Form ── */}
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

        {/* Section: Access Credentials */}
        <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-5 border-b border-slate-800/80">
          // Access Credentials
        </div>

        <div className="mb-4">
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

        <div className="mb-8">
          <label className={labelClass}>Password *</label>
          <div className="relative">
            <input
              className={`${inputClass} pr-16`}
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] tracking-widest text-slate-600 hover:text-slate-400 uppercase transition-colors"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
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
            onClick={handleAddJail}
            disabled={addJailLoading}
            className="bg-blue-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 disabled:bg-blue-900 disabled:text-blue-700 disabled:translate-y-0 transition-all duration-150"
          >
            {addJailLoading ? "SAVING..." : "+ ADD JAIL"}
          </button>
          <button
            onClick={() => navigateWithModal("/admin/dashboard/jaildashboard/jail-list")}
            className="border border-slate-800 text-slate-600 px-6 py-3.5 text-[13px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
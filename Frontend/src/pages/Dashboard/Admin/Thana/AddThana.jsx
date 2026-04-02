import addThanaApi from "@/services/Thana/addThanaApi";
import userStore from "@/state/userStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ZONES = [
  "Dhaka Metro", "Chittagong Metro", "Rajshahi",
  "Khulna", "Barisal", "Sylhet", "Mymensingh", "Rangpur",
];

const DISTRICTS = [
    "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola",
    "Bogura", "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram",
    "Chuadanga", "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur",
    "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj",
    "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah",
    "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram",
    "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura",
    "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh",
    "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
    "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
    "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati",
    "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj",
    "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
];

const inputClass =
  "w-full bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none focus:border-lime-400/30 hover:border-slate-700 transition-colors appearance-none";

const labelClass = "block text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2";

export default function AddThana() {
  const { user } = userStore();
  const adminId = user?.admin_id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    thana_name: "", district: "", zone: "",
    address: "", phone: "", email: "", password: "",
  });
  const [formError, setFormError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const { mutate: addThanaMutation, isLoading } = useMutation({
    mutationFn: (data) => addThanaApi(data),
    onSuccess: () => {
      setForm({ thana_name: "", district: "", zone: "", address: "", phone: "", email: "", password: "" });
      setFormError("");
      navigate("/admin/dashboard/thanadashboard/thana-list");
    },
    onError: () => setFormError("Failed to add thana. Please check your inputs and try again."),
  });

  const handleSubmit = () => {
    setFormError("");
    const missing = Object.values(form).some((v) => !v.trim());
    if (missing) { setFormError("All fields are required."); return; }
    addThanaMutation({ ...form, created_by_admin_id: adminId });
  };

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(132,204,22,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(132,204,22,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-lime-400 bg-lime-400/10 border border-lime-400/20 px-3 py-1 inline-block mb-3">
          New Record
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Add <span className="text-lime-400">Thana</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Register a new police station to the system
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-lime-400/30 via-lime-400/10 to-transparent mb-10" />

      {/* ── Admin ID strip ── */}
      <div className="flex items-center justify-between bg-lime-400/5 border border-lime-400/15 px-4 py-3 mb-8 max-w-2xl">
        <span className="text-[11px] text-slate-600 tracking-widest uppercase">Created by Admin ID</span>
        <span className="text-lime-400 text-[12px]">{admin_id || "—"}</span>
      </div>

      {/* ── Error ── */}
      {formError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-2xl">
          ⚠ {formError}
        </div>
      )}

      {/* ── Form ── */}
      <div className="max-w-2xl flex flex-col gap-0">

        {/* Section: Identity */}
        <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-4 border-b border-slate-800/80">
          // Station Identity
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Thana Name *</label>
            <input className={inputClass} value={form.thana_name} onChange={set("thana_name")} placeholder="e.g. Gulshan Thana" />
          </div>
          <div>
            <label className={labelClass}>District *</label>
            <select className={inputClass} value={form.district} onChange={set("district")}>
              <option value="">Select district...</option>
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Zone *</label>
            <select className={inputClass} value={form.zone} onChange={set("zone")}>
              <option value="">Select zone...</option>
              {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input className={inputClass} value={form.phone} onChange={set("phone")} placeholder="+880..." />
          </div>
        </div>

        <div className="mb-6">
          <label className={labelClass}>Address *</label>
          <input className={inputClass} value={form.address} onChange={set("address")} placeholder="Full station address" />
        </div>

        {/* Section: Credentials */}
        <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-4 border-b border-slate-800/80">
          // Access Credentials
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className={labelClass}>Email *</label>
            <input className={inputClass} type="email" value={form.email} onChange={set("email")} placeholder="station@police.gov.bd" />
          </div>
          <div>
            <label className={labelClass}>Password *</label>
            <input className={inputClass} type="password" value={form.password} onChange={set("password")} placeholder="Set station password" />
            <p className="text-[10px] text-slate-700 mt-1.5">Min. 8 characters recommended</p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-lime-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-lime-300 hover:-translate-y-0.5 disabled:bg-lime-900 disabled:text-lime-700 disabled:translate-y-0 transition-all duration-150"
          >
            {isLoading ? "SAVING..." : "+ ADD THANA"}
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/thanadashboard/thana-list")}
            className="border border-slate-800 text-slate-600 px-6 py-3.5 text-[13px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
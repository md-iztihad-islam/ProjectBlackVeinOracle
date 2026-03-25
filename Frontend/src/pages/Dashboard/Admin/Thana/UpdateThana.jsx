import getThanaByThanaIdApi from "@/services/Thana/getThanaByThanaIdApi";
import updateThanaApi from "@/services/Thana/updateThanaApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const labelClass = "block text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2 flex items-center gap-2";

export default function UpdateThana() {
  const { thana_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    thana_name: "", district: "", zone: "", address: "", phone: "", email: "",
  });
  const [original, setOriginal] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [formError, setFormError] = useState("");

  const { data: thanaData, isLoading: thanaLoading } = useQuery({
    queryKey: ["thanaDetails", thana_id],
    queryFn: () => getThanaByThanaIdApi(thana_id),
    enabled: !!thana_id,
  });

  useEffect(() => {
    const d = thanaData?.data;
    if (d) {
      const snap = {
        thana_name: d.thana_name || "",
        district: d.district || "",
        zone: d.zone || "",
        address: d.address || "",
        phone: d.phone || "",
        email: d.email || "",
      };
      setForm(snap);
      setOriginal({ ...snap, created_by_admin_id: d.created_by_admin_id });
    }
  }, [thanaData]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const isChanged = (key) => original[key] !== undefined && original[key] !== form[key];

  const inputClass = (key) =>
    `w-full bg-slate-900/60 border text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none transition-colors appearance-none ` +
    (isChanged(key)
      ? "border-violet-400/40 focus:border-violet-400/60"
      : "border-slate-800 hover:border-slate-700 focus:border-violet-400/20");

  const { mutate: updateThanaMutation, isLoading: updateLoading } = useMutation({
    mutationFn: ({ thanaId, thanaData }) => updateThanaApi({thanaId, thanaData}),
    onSuccess: () => {
      setFormError("");
      setShowToast(true);
      queryClient.invalidateQueries(["thanaDetails", thana_id]);
      queryClient.invalidateQueries(["thanaList"]);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: () => setFormError("Failed to update thana. Please try again."),
  });

  const handleSubmit = () => {
    setFormError("");
    console.log("Submitting update for thana ID:", thana_id, "with data:", form);
    updateThanaMutation({ thanaId: thana_id, thanaData: form });
  };

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(167,139,250,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Toast ── */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0e1218] border border-lime-400/30 text-lime-400 text-[11px] tracking-widest px-5 py-3 animate-[slideIn_0.3s_ease]">
          ✓ THANA UPDATED SUCCESSFULLY
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 inline-block mb-3">
          Edit Record
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Update <span className="text-violet-400">Thana</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">// Modify existing station details</p>
      </div>

      <div className="h-px bg-gradient-to-r from-violet-400/30 via-violet-400/10 to-transparent mb-10" />

      {thanaLoading ? (
        <div className="flex flex-col items-center py-24 gap-4 text-slate-700 text-[12px] tracking-widest">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-violet-400 rounded-full animate-spin" />
          LOADING THANA DATA...
        </div>
      ) : (
        <>
          {/* ── Meta bar ── */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-violet-400/5 border border-violet-400/12 px-4 py-3 mb-8 max-w-2xl">
            <div>
              <span className="text-[10px] text-slate-700 tracking-widest uppercase mr-2">Thana ID</span>
              <span className="text-violet-400 text-[12px]">{thana_id}</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-700 tracking-widest uppercase mr-2">Admin</span>
              <span className="text-violet-400 text-[12px]">{original.created_by_admin_id || "—"}</span>
            </div>
          </div>

          {formError && (
            <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-2xl">
              ⚠ {formError}
            </div>
          )}

          <div className="max-w-2xl">
            {/* Section: Identity */}
            <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-4 border-b border-slate-800/80">
              // Station Identity
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>
                  Thana Name
                  {isChanged("thana_name") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                </label>
                <input className={inputClass("thana_name")} value={form.thana_name} onChange={set("thana_name")} />
              </div>
              <div>
                <label className={labelClass}>
                  District
                  {isChanged("district") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                </label>
                <select className={inputClass("district")} value={form.district} onChange={set("district")}>
                  <option value="">Select district...</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>
                  Zone
                  {isChanged("zone") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                </label>
                <select className={inputClass("zone")} value={form.zone} onChange={set("zone")}>
                  <option value="">Select zone...</option>
                  {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Phone
                  {isChanged("phone") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                </label>
                <input className={inputClass("phone")} value={form.phone} onChange={set("phone")} />
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>
                Address
                {isChanged("address") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
              </label>
              <input className={inputClass("address")} value={form.address} onChange={set("address")} />
            </div>

            {/* Section: Contact */}
            <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-4 border-b border-slate-800/80">
              // Contact
            </div>

            <div className="mb-8">
              <label className={labelClass}>
                Email
                {isChanged("email") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
              </label>
              <input className={inputClass("email")} type="email" value={form.email} onChange={set("email")} />
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800">
              <button
                onClick={handleSubmit}
                disabled={updateLoading}
                className="bg-violet-500 text-white px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-violet-400 hover:-translate-y-0.5 disabled:bg-violet-950 disabled:text-violet-800 disabled:translate-y-0 transition-all duration-150"
              >
                {updateLoading ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                onClick={() => navigate("/admin/dashboard/thanadashboard/thana-list")}
                className="border border-slate-800 text-slate-600 px-6 py-3.5 text-[13px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
              >
                CANCEL
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
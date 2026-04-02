import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCriminalById, updateCriminal } from "@/services/Thana/thanaApi";
import { useMutation, useQuery } from "@tanstack/react-query";

function UpdateCriminal() {
  const navigate = useNavigate();
  const { criminalId } = useParams();
  const [form, setForm] = useState({
    full_name: "",
    nid: "",
    image_url: "",
    father_name: "",
    mother_name: "",
    birth_date: "",
    gender: "",
    aliases: "",
    nationality: "",
    permanent_address: "",
    current_address: "",
    identifying_marks: "",
    status: "",
    risk_level: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { data: criminalData, isLoading: isLoadingCriminal } = useQuery({
    queryKey: ["criminal-by-id", criminalId],
    queryFn: () => getCriminalById(criminalId),
    enabled: Boolean(criminalId),
  });

  const currentCriminal = Array.isArray(criminalData?.data)
    ? criminalData.data[0]
    : criminalData?.data;

  const effectiveBirthDate = form.birth_date || currentCriminal?.birth_date || "";
  const effectiveImageUrl = form.image_url || currentCriminal?.image_url || "";

  const getAgeFromBirthDate = (birthDate) => {
    if (!birthDate) return "";
    const dob = new Date(birthDate);
    if (Number.isNaN(dob.getTime())) return "";
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
    return age >= 0 ? age : "";
  };

  const calculatedAge = getAgeFromBirthDate(effectiveBirthDate);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        full_name: form.full_name || currentCriminal?.full_name || "",
        nid: form.nid || currentCriminal?.nid || "",
        image_url: form.image_url || currentCriminal?.image_url || "",
        father_name: form.father_name || currentCriminal?.father_name || "",
        mother_name: form.mother_name || currentCriminal?.mother_name || "",
        birth_date: form.birth_date || currentCriminal?.birth_date || null,
        gender: form.gender || currentCriminal?.gender || "",
        aliases: form.aliases || currentCriminal?.aliases || "",
        nationality: form.nationality || currentCriminal?.nationality || "",
        permanent_address: form.permanent_address || currentCriminal?.permanent_address || "",
        current_address: form.current_address || currentCriminal?.current_address || "",
        identifying_marks: form.identifying_marks || currentCriminal?.identifying_marks || "",
        status: form.status || currentCriminal?.status || "unknown",
        risk_level:
          form.risk_level === ""
            ? Number(currentCriminal?.risk_level ?? 1)
            : Number(form.risk_level),
      };
      return updateCriminal(criminalId, payload);
    },
    onSuccess: (r) => {
      if (r.success) {
        alert("Updated!");
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
          Update Criminal
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{criminalId}</p>
        {isLoadingCriminal && (
          <p className="text-sm text-slate-400 mb-4">Loading current data...</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Full Name</label>
            <input
              value={form.full_name || currentCriminal?.full_name || ""}
              onChange={(e) => set("full_name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">NID</label>
            <input
              value={form.nid || currentCriminal?.nid || ""}
              onChange={(e) => set("nid", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Image URL / Data URL</label>
            <input
              value={effectiveImageUrl}
              onChange={(e) => set("image_url", e.target.value)}
              className={inputCls}
            />
          </div>
          {effectiveImageUrl && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/10">
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-red-400 via-amber-300 to-red-600">
                <img src={effectiveImageUrl} alt="Criminal preview" className="w-full h-full rounded-full object-cover" />
              </div>
              <p className="text-xs text-slate-400">Profile image preview</p>
            </div>
          )}
          <div>
            <label className="text-xs text-slate-400 uppercase">Father's Name</label>
            <input
              value={form.father_name || currentCriminal?.father_name || ""}
              onChange={(e) => set("father_name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Mother's Name</label>
            <input
              value={form.mother_name || currentCriminal?.mother_name || ""}
              onChange={(e) => set("mother_name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Birth Date</label>
            <input
              type="date"
              value={effectiveBirthDate}
              onChange={(e) => set("birth_date", e.target.value)}
              className={inputCls}
            />
            {calculatedAge !== "" && (
              <p className="mt-1 text-xs text-blue-300">Calculated Age: {calculatedAge}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Gender</label>
            <select
              value={form.gender || currentCriminal?.gender || ""}
              onChange={(e) => set("gender", e.target.value)}
              className={inputCls}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Aliases / Known Names</label>
            <input
              value={form.aliases || currentCriminal?.aliases || ""}
              onChange={(e) => set("aliases", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Nationality</label>
            <input
              value={form.nationality || currentCriminal?.nationality || ""}
              onChange={(e) => set("nationality", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Permanent Address</label>
            <textarea
              value={form.permanent_address || currentCriminal?.permanent_address || ""}
              onChange={(e) => set("permanent_address", e.target.value)}
              className={inputCls}
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Current Address</label>
            <textarea
              value={form.current_address || currentCriminal?.current_address || ""}
              onChange={(e) => set("current_address", e.target.value)}
              className={inputCls}
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Identifying Marks</label>
            <textarea
              value={form.identifying_marks || currentCriminal?.identifying_marks || ""}
              onChange={(e) => set("identifying_marks", e.target.value)}
              className={inputCls}
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status || currentCriminal?.status || "unknown"}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="unknown">Unknown</option>
              <option value="wanted">Wanted</option>
              <option value="in_custody">In Custody</option>
              <option value="on_bail">On Bail</option>
              <option value="released">Released</option>
              <option value="escaped">Escaped</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Risk Level
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.risk_level === "" ? currentCriminal?.risk_level ?? "" : form.risk_level}
              onChange={(e) => set("risk_level", e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Criminal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCriminal;
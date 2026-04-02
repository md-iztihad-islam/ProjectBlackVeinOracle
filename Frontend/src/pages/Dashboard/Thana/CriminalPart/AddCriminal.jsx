import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCriminal } from "@/services/Thana/thanaApi";
import { useMutation } from "@tanstack/react-query";

function AddCriminal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    nid: "",
    image_url: "",
    father_name: "",
    mother_name: "",
    birth_date: "",
    gender: "",
    aliases: "",
    nationality: "Bangladeshi",
    permanent_address: "",
    current_address: "",
    identifying_marks: "",
    status: "in_custody",
    risk_level: 5,
  });
  const [imagePreview, setImagePreview] = useState("");
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const computedAge = (() => {
    if (!form.birth_date) return "";
    const dob = new Date(form.birth_date);
    if (Number.isNaN(dob.getTime())) return "";
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
    return age >= 0 ? age : "";
  })();

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      set("image_url", result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => addCriminal(form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Criminal added!");
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
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Add Criminal</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Full Name
            </label>
            <input
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              NID Number
            </label>
            <input
              value={form.nid}
              onChange={(e) => set("nid", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Criminal Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className={`${inputCls} file:mr-3 file:border-0 file:bg-blue-600/20 file:text-blue-300 file:px-3 file:py-1.5 file:rounded-md`}
              required={!form.image_url}
            />
          </div>
          {(imagePreview || form.image_url) && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/10">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-red-400 via-amber-300 to-red-600">
                <img
                  src={imagePreview || form.image_url}
                  alt="Criminal preview"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="text-sm text-slate-200 font-semibold">Profile Preview</p>
                <p className="text-xs text-slate-400">This image will appear in criminal profile cards.</p>
              </div>
            </div>
          )}
          <div>
            <label className="text-xs text-slate-400 uppercase">Father's Name</label>
            <input
              value={form.father_name}
              onChange={(e) => set("father_name", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Mother's Name</label>
            <input
              value={form.mother_name}
              onChange={(e) => set("mother_name", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Birth Date</label>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => set("birth_date", e.target.value)}
              className={inputCls}
              required
            />
            {computedAge !== "" && (
              <p className="mt-1 text-xs text-blue-300">Calculated Age: {computedAge}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
              className={inputCls}
              required
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
              value={form.aliases}
              onChange={(e) => set("aliases", e.target.value)}
              className={inputCls}
              placeholder="e.g. Raju, Black Tiger"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Nationality</label>
            <input
              value={form.nationality}
              onChange={(e) => set("nationality", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Permanent Address</label>
            <textarea
              value={form.permanent_address}
              onChange={(e) => set("permanent_address", e.target.value)}
              className={inputCls}
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Current Address</label>
            <textarea
              value={form.current_address}
              onChange={(e) => set("current_address", e.target.value)}
              className={inputCls}
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Identifying Marks</label>
            <textarea
              value={form.identifying_marks}
              onChange={(e) => set("identifying_marks", e.target.value)}
              className={inputCls}
              rows={2}
              placeholder="e.g. Scar on left eyebrow"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
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
              Risk Level (1-10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.risk_level}
              onChange={(e) => set("risk_level", Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Criminal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCriminal;
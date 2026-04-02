import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function AddCriminalLocation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id: "",
    location_id: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        "/criminal-location/add-criminal-location",
        {
          criminal_id: form.criminal_id,
          location_id: form.location_id,
        },
      );
      return res.data;
    },
    onSuccess: (r) => {
      if (r.success) {
        alert("Criminal location linked!");
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
          Add Criminal Location
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID
            </label>
            <input
              value={form.criminal_id}
              onChange={(e) => set("criminal_id", e.target.value)}
              className={inputCls}
              placeholder="CRM-0000001"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">
              Location ID
            </label>
            <input
              value={form.location_id}
              onChange={(e) => set("location_id", e.target.value)}
              className={inputCls}
              placeholder="LOC-0000001"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Linking..." : "Link Criminal to Location"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCriminalLocation;

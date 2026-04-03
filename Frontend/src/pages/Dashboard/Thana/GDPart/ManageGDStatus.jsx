import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOfficersByThana,
  updateGDReportStatus,
  getGDReportsByThana,
} from "@/services/Thana/thanaApi";
import userStore from "@/state/userStore";

function ManageGDStatus() {
  const navigate = useNavigate();
  const { gdId } = useParams();
  const { user } = userStore();
  const thanaId = user?.thana_id;

  const [assignedOfficerId, setAssignedOfficerId] = useState("");

  const { data: officersData } = useQuery({
    queryKey: ["thana-officers-for-gd", thanaId],
    queryFn: () => getOfficersByThana(thanaId),
    enabled: !!thanaId,
  });

  const officers = officersData?.data || [];

  const { data: gdData } = useQuery({
    queryKey: ["thana-gd-list", thanaId],
    queryFn: () => getGDReportsByThana(thanaId),
    enabled: !!thanaId,
  });

  const gdRecord = useMemo(
    () => (gdData?.data || []).find((g) => String(g.gd_id) === String(gdId)),
    [gdData, gdId],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateGDReportStatus(gdId, {
        status: "assigned",
        assignedOfficerId: assignedOfficerId || null,
      }),
    onSuccess: (r) => {
      if (r.success) {
        alert("GD status updated!");
        navigate("/thana/dashboard");
      } else {
        alert(r.message || "Failed");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-slate-100 mb-2">Manage GD</h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">GD ID: {gdId}</p>

        <div className="mb-5 rounded-lg border border-white/10 bg-gray-800/50 p-3 text-sm text-slate-300">
          <p>
            Current status: <span className="font-semibold">{gdRecord?.status || "unknown"}</span>
          </p>
          <p>
            Current assigned officer: <span className="font-semibold">{gdRecord?.assigned_officer_id || "none"}</span>
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!assignedOfficerId) {
              alert("Please select an officer to assign this GD.");
              return;
            }
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Assign / Change Assigned Officer
            </label>
            <select
              value={assignedOfficerId || gdRecord?.assigned_officer_id || ""}
              onChange={(e) => setAssignedOfficerId(e.target.value)}
              className="w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50"
            >
              <option value="">No officer selected</option>
              {officers.map((o) => (
                <option key={o.officer_id} value={o.officer_id}>
                  {o.officer_id} — {o.full_name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Assigning..." : "Assign Officer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageGDStatus;

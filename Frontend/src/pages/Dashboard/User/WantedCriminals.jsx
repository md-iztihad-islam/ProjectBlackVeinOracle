import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWantedCriminalsApi } from "@/services/User/criminalLookupApi";

function WantedCriminals() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["user-wanted-criminals"],
    queryFn: getWantedCriminalsApi,
  });

  const rows = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Wanted Criminals</h1>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="text-blue-400 text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-slate-400">No wanted criminals found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-3">Criminal ID</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Risk</th>
                  <th className="text-left px-4 py-3">Registered Thana</th>
                  <th className="text-left px-4 py-3">Last Seen District</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.criminal_id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-mono">{r.criminal_id}</td>
                    <td className="px-4 py-3">{r.full_name}</td>
                    <td className="px-4 py-3 capitalize">{r.status}</td>
                    <td className="px-4 py-3">{r.risk_level}</td>
                    <td className="px-4 py-3">{r.registered_thana || r.thana_name || r.registered_thana_id || "N/A"}</td>
                    <td className="px-4 py-3">{r.last_seen_district || r.district || "Unknown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WantedCriminals;

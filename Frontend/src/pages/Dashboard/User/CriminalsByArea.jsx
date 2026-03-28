import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCriminalsByAreaApi } from "@/services/User/criminalLookupApi";

function CriminalsByArea() {
  const navigate = useNavigate();
  const [districtInput, setDistrictInput] = useState("");
  const [district, setDistrict] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["user-criminals-by-area", district],
    queryFn: () => getCriminalsByAreaApi(district),
    enabled: !!district,
  });

  const rows = data?.data || [];
  const apiFailed = Boolean(district && data && data.success === false);

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Criminals by Area</h1>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="text-blue-400 text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDistrict(districtInput.trim());
          }}
          className="flex gap-2 mb-6"
        >
          <input
            value={districtInput}
            onChange={(e) => setDistrictInput(e.target.value)}
            placeholder="Enter district (e.g. Dhaka)"
            className="flex-1 bg-gray-800 border border-white/10 rounded-lg px-3 py-2"
          />
          <button className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg">
            Search
          </button>
        </form>

        {!district ? (
          <p className="text-slate-400">Search by district to view records.</p>
        ) : isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : apiFailed ? (
          <p className="text-rose-400">Failed to fetch records. Please retry.</p>
        ) : rows.length === 0 ? (
          <p className="text-slate-400">No records found for this district.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-3">Criminal ID</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Risk</th>
                  <th className="text-left px-4 py-3">District</th>
                  <th className="text-left px-4 py-3">Zone</th>
                  <th className="text-left px-4 py-3">Last Noted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={`${r.criminal_id || i}-${r.noted_at || i}`}
                    className="border-t border-white/10"
                  >
                    <td className="px-4 py-3 font-mono">{r.criminal_id}</td>
                    <td className="px-4 py-3">{r.full_name}</td>
                    <td className="px-4 py-3 capitalize">{r.status}</td>
                    <td className="px-4 py-3">{r.risk_level}</td>
                    <td className="px-4 py-3">{r.district || r.last_seen_district || district}</td>
                    <td className="px-4 py-3">{r.zone || "N/A"}</td>
                    <td className="px-4 py-3">
                      {r.noted_at
                        ? new Date(r.noted_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
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

export default CriminalsByArea;

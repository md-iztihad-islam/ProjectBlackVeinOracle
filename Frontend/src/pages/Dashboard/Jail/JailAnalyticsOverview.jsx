import {
  getCellOccupancyDetails,
  getCustodyOverview,
  getInmatesDueForBail,
} from "@/services/Analytics/analyticsApi";
import getJailByIdApi from "@/services/Jail/getJailByIdApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

export default function JailAnalyticsOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = userStore();
  const jailId = user?.jail_id;

  const handleBack = () => {
    if (location.state?.modal) {
      navigate(-1);
      return;
    }
    navigate("/jail/dashboard");
  };

  const { data: jailData } = useQuery({
    queryKey: ["jailDataForAnalytics", jailId],
    queryFn: () => getJailByIdApi(jailId),
    enabled: !!jailId,
  });

  const { data: cellOccData, isLoading: cellOccLoading } = useQuery({
    queryKey: ["jailCellOccupancyDetails", jailId],
    queryFn: () => getCellOccupancyDetails(jailId),
    enabled: !!jailId,
  });

  const { data: dueData, isLoading: dueLoading } = useQuery({
    queryKey: ["inmatesDueForBail"],
    queryFn: getInmatesDueForBail,
    enabled: !!jailId,
  });

  const { data: custodyData, isLoading: custodyLoading } = useQuery({
    queryKey: ["custodyOverview"],
    queryFn: getCustodyOverview,
    enabled: !!jailId,
  });

  const jail = jailData?.data || null;
  const blockRows = Array.isArray(cellOccData?.data) ? cellOccData.data : [];
  const dueRowsAll = Array.isArray(dueData?.data) ? dueData.data : [];
  const dueRows = jail?.jail_name
    ? dueRowsAll.filter((r) => String(r.jail_name || "").toLowerCase() === String(jail.jail_name).toLowerCase())
    : dueRowsAll;
  const custodyRows = Array.isArray(custodyData?.data) ? custodyData.data : [];

  const totals = blockRows.reduce(
    (acc, r) => {
      acc.blocks += 1;
      acc.cells += Number(r.total_cells || 0);
      acc.capacity += Number(r.total_cell_capacity || 0);
      acc.occupants += Number(r.total_occupants || 0);
      acc.availableCells += Number(r.available_cells || 0);
      return acc;
    },
    { blocks: 0, cells: 0, capacity: 0, occupants: 0, availableCells: 0 }
  );

  const occupancyPct = totals.capacity > 0 ? ((totals.occupants / totals.capacity) * 100).toFixed(1) : "0.0";

  return (
    <div className="w-full max-w-6xl mx-auto text-slate-200">
      <div className="bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-400">Jail Analytics</p>
            <h1 className="text-3xl font-bold mt-1">Facility Operations Overview</h1>
            <p className="text-sm text-slate-400 mt-1">
              {jail?.jail_name ? `${jail.jail_name} (${jail.jail_id})` : "Loading facility..."}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard label="Blocks" value={totals.blocks} />
          <StatCard label="Cells" value={totals.cells} />
          <StatCard label="Cell Capacity" value={totals.capacity} />
          <StatCard label="Current Occupants" value={totals.occupants} accent />
          <StatCard label="Available Cells" value={totals.availableCells} />
          <StatCard label="Occupancy %" value={`${occupancyPct}%`} />
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Block-wise Occupancy</h2>
          <div className="bg-gray-900/80 border border-white/10 rounded-xl overflow-x-auto shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            {cellOccLoading ? (
              <p className="p-6 text-slate-400">Loading block occupancy...</p>
            ) : blockRows.length === 0 ? (
              <p className="p-6 text-slate-400">No cell occupancy data found for this jail.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                    <th className="text-left p-3">Block</th>
                    <th className="text-left p-3">Cells</th>
                    <th className="text-left p-3">Capacity</th>
                    <th className="text-left p-3">Occupants</th>
                    <th className="text-left p-3">Available</th>
                    <th className="text-left p-3">Occupied</th>
                    <th className="text-left p-3">Maintenance</th>
                    <th className="text-left p-3">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {blockRows.map((r, idx) => (
                    <tr key={r.block_id} className={`border-b border-white/5 hover:bg-blue-500/[0.06] ${idx % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                      <td className="p-3">
                        <div className="font-medium text-slate-100">{r.block_name}</div>
                        <div className="text-xs text-slate-400 font-mono">{r.block_id}</div>
                      </td>
                      <td className="p-3">{r.total_cells}</td>
                      <td className="p-3">{r.total_cell_capacity}</td>
                      <td className="p-3">{r.total_occupants}</td>
                      <td className="p-3 text-emerald-300">{r.available_cells}</td>
                      <td className="p-3 text-amber-300">{r.occupied_cells}</td>
                      <td className="p-3 text-red-300">{r.maintenance_cells}</td>
                      <td className="p-3">{r.occupancy_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Inmates Due for Bail (This Jail)</h2>
          <div className="bg-gray-900/80 border border-white/10 rounded-xl overflow-x-auto shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            {dueLoading ? (
              <p className="p-6 text-slate-400">Loading due-for-bail list...</p>
            ) : dueRows.length === 0 ? (
              <p className="p-6 text-slate-400">No upcoming bail-due inmates found for this jail.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                    <th className="text-left p-3">Criminal</th>
                    <th className="text-left p-3">Arrest ID</th>
                    <th className="text-left p-3">Risk</th>
                    <th className="text-left p-3">Bail Due</th>
                    <th className="text-left p-3">Days Left</th>
                    <th className="text-left p-3">Thana</th>
                  </tr>
                </thead>
                <tbody>
                  {dueRows.map((r, idx) => (
                    <tr key={`${r.arrest_id}-${r.criminal_id}`} className={`border-b border-white/5 hover:bg-blue-500/[0.06] ${idx % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                      <td className="p-3">
                        <div className="font-medium text-slate-100">{r.full_name}</div>
                        <div className="text-xs text-slate-400 font-mono">{r.criminal_id}</div>
                      </td>
                      <td className="p-3 font-mono text-xs">{r.arrest_id}</td>
                      <td className="p-3">{r.risk_level}</td>
                      <td className="p-3">{r.bail_due_date ? new Date(r.bail_due_date).toLocaleDateString() : "—"}</td>
                      <td className="p-3">{r.days_until_bail}</td>
                      <td className="p-3">{r.thana_name || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">National Custody Snapshot</h2>
          <div className="bg-gray-900/80 border border-white/10 rounded-xl overflow-x-auto shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            {custodyLoading ? (
              <p className="p-6 text-slate-400">Loading custody snapshot...</p>
            ) : custodyRows.length === 0 ? (
              <p className="p-6 text-slate-400">No custody summary found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Count</th>
                    <th className="text-left p-3">Share</th>
                    <th className="text-left p-3">Avg Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {custodyRows.map((r, idx) => (
                    <tr key={r.status} className={`border-b border-white/5 hover:bg-blue-500/[0.06] ${idx % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                      <td className="p-3 capitalize">{String(r.status || "").replaceAll("_", " ")}</td>
                      <td className="p-3">{r.total_count}</td>
                      <td className="p-3">{r.percentage}%</td>
                      <td className="p-3">{r.avg_risk_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = false }) {
  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-slate-900/70 border border-white/10 rounded-xl p-4">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent ? "text-blue-300" : "text-slate-100"}`}>{value}</p>
    </div>
  );
}

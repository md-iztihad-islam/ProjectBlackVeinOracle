import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCriminalRanking,
  getDistrictCrimeStats,
  getOfficerWorkload,
  getThanaPerformance,
} from "@/services/Analytics/analyticsApi";

const take = (arr, n = 8) => (Array.isArray(arr) ? arr.slice(0, n) : []);

function DataBlock({ title, rows, columns, emptyText = "No data available" }) {
  return (
    <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800/70 text-slate-400 text-xs uppercase">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-3 py-2 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-5 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="border-t border-white/5">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2 text-slate-200 whitespace-nowrap">
                      {row?.[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminAnalyticsOverview() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.state?.modal) {
      navigate(-1);
      return;
    }
    navigate("/admin/dashboard");
  };

  const { data: districtStatsData, isLoading: districtLoading } = useQuery({
    queryKey: ["admin-district-stats"],
    queryFn: getDistrictCrimeStats,
  });
  const { data: officerWorkloadData, isLoading: workloadLoading } = useQuery({
    queryKey: ["admin-officer-workload"],
    queryFn: getOfficerWorkload,
  });
  const { data: criminalRankingData, isLoading: rankingLoading } = useQuery({
    queryKey: ["admin-criminal-ranking"],
    queryFn: getCriminalRanking,
  });
  const { data: thanaPerformanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ["admin-thana-performance"],
    queryFn: getThanaPerformance,
  });

  const districtStats = districtStatsData?.data || [];
  const officerWorkload = officerWorkloadData?.data || [];
  const criminalRanking = criminalRankingData?.data || [];
  const thanaPerformance = thanaPerformanceData?.data || [];

  const loading = districtLoading || workloadLoading || rankingLoading || performanceLoading;

  return (
    <div className="w-full max-w-6xl mx-auto text-slate-200">
      <div className="bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics Overview</h1>
            <p className="text-sm text-slate-400 mt-1">Admin intelligence and performance insights</p>
          </div>
          <button
            onClick={handleBack}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
            <p className="text-xs uppercase text-slate-500">District Stats</p>
            <p className="text-2xl font-bold text-blue-300 mt-1">{districtStats.length}</p>
          </div>
          <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
            <p className="text-xs uppercase text-slate-500">Officer Workload</p>
            <p className="text-2xl font-bold text-cyan-300 mt-1">{officerWorkload.length}</p>
          </div>
          <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
            <p className="text-xs uppercase text-slate-500">Criminal Ranking</p>
            <p className="text-2xl font-bold text-amber-300 mt-1">{criminalRanking.length}</p>
          </div>
          <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
            <p className="text-xs uppercase text-slate-500">Thana Performance</p>
            <p className="text-2xl font-bold text-emerald-300 mt-1">{thanaPerformance.length}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading analytics...</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <DataBlock
              title="District Crime Stats"
              rows={take(districtStats)}
              columns={[
                { key: "district", label: "District" },
                { key: "total_criminals", label: "Total Criminals" },
                { key: "high_risk_criminals", label: "High Risk" },
                { key: "total_cases", label: "Total Cases" },
                { key: "open_cases", label: "Open Cases" },
              ]}
            />

            <DataBlock
              title="Officer Workload"
              rows={take(officerWorkload)}
              columns={[
                { key: "officer_id", label: "Officer ID" },
                { key: "full_name", label: "Officer" },
                { key: "rank_name", label: "Rank" },
                { key: "thana_name", label: "Thana" },
                { key: "total_workload", label: "Workload" },
              ]}
            />

            <DataBlock
              title="Criminal Ranking"
              rows={take(criminalRanking)}
              columns={[
                { key: "criminal_id", label: "Criminal ID" },
                { key: "full_name", label: "Name" },
                { key: "status", label: "Status" },
                { key: "case_count", label: "Cases" },
                { key: "overall_rank", label: "Overall Rank" },
              ]}
            />

            <DataBlock
              title="Thana Performance"
              rows={take(thanaPerformance)}
              columns={[
                { key: "thana_id", label: "Thana ID" },
                { key: "thana_name", label: "Thana" },
                { key: "district", label: "District" },
                { key: "total_cases", label: "Total Cases" },
                { key: "performance_rank", label: "Performance Rank" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

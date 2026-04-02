import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getBailStatistics,
  getCriminalRanking,
  getDistrictCrimeStats,
  getGdReportAnalytics,
  getOfficerWorkload,
  getThanaPerformance,
} from "@/services/Analytics/analyticsApi";

function AnalyticsOverview() {
  const navigate = useNavigate();

  const { data: gd } = useQuery({ queryKey: ["analytics-gd"], queryFn: getGdReportAnalytics });
  const { data: bail } = useQuery({ queryKey: ["analytics-bail"], queryFn: getBailStatistics });
  const { data: district } = useQuery({
    queryKey: ["analytics-district"],
    queryFn: getDistrictCrimeStats,
  });
  const { data: workload } = useQuery({
    queryKey: ["analytics-workload"],
    queryFn: getOfficerWorkload,
  });
  const { data: ranking } = useQuery({
    queryKey: ["analytics-ranking"],
    queryFn: getCriminalRanking,
  });
  const { data: performance } = useQuery({
    queryKey: ["analytics-performance"],
    queryFn: getThanaPerformance,
  });

  const cards = [
    {
      label: "GD Analytics Rows",
      value: Array.isArray(gd?.data) ? gd.data.length : 0,
    },
    {
      label: "Bail Stats Rows",
      value: Array.isArray(bail?.data) ? bail.data.length : 0,
    },
    {
      label: "District Stats",
      value: Array.isArray(district?.data) ? district.data.length : 0,
    },
    {
      label: "Officer Workload",
      value: Array.isArray(workload?.data) ? workload.data.length : 0,
    },
    {
      label: "Criminal Ranking",
      value: Array.isArray(ranking?.data) ? ranking.data.length : 0,
    },
    {
      label: "Thana Performance",
      value: performance?.success
        ? Array.isArray(performance?.data)
          ? performance.data.length
          : 0
        : "No access",
    },
  ];

  const blockTitleCls = "text-sm font-semibold mb-3";
  const blockCls = "bg-gray-900 border border-white/5 rounded-xl p-4";

  const take = (arr, n = 5) => (Array.isArray(arr) ? arr.slice(0, n) : []);
  const gdRows = take(gd?.data);
  const bailRows = take(bail?.data);
  const districtRows = take(district?.data);
  const workloadRows = take(workload?.data);
  const rankingRows = take(ranking?.data);

  const renderRows = (rows, columns, emptyText = "No data available") => (
    <div className="overflow-x-auto border border-white/5 rounded-lg">
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
              <td
                colSpan={columns.length}
                className="px-3 py-4 text-center text-slate-500"
              >
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
  );

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Analytics Overview</h1>
          <button
            onClick={() => navigate("/thana/dashboard")}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {cards.map((c) => (
            <div key={c.label} className="bg-gray-900 border border-white/5 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase">{c.label}</p>
              <p className="text-xl font-bold mt-1 text-blue-300">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={blockCls}>
            <h2 className={blockTitleCls}>GD Analytics (Top 5)</h2>
            {renderRows(gdRows, [
              { key: "thana_name", label: "Thana" },
              { key: "total_gd_reports", label: "Total GD" },
              { key: "submitted", label: "Submitted" },
              { key: "assigned", label: "Assigned" },
              { key: "approved", label: "Approved" },
              { key: "rejected", label: "Rejected" },
              { key: "approval_rate", label: "Approval %" },
            ])}
          </div>

          <div className={blockCls}>
            <h2 className={blockTitleCls}>Bail Statistics (Top 5)</h2>
            {renderRows(bailRows, [
              { key: "court_name", label: "Court" },
              { key: "total_applications", label: "Total" },
              { key: "granted", label: "Granted" },
              { key: "rejected", label: "Rejected" },
              { key: "pending", label: "Pending" },
              { key: "avg_bail_amount", label: "Avg Bail" },
              { key: "max_bail_amount", label: "Max Bail" },
            ])}
          </div>

          <div className={blockCls}>
            <h2 className={blockTitleCls}>District Crime Stats (Top 5)</h2>
            {renderRows(districtRows, [
              { key: "district", label: "District" },
              { key: "total_criminals", label: "Total Criminals" },
              { key: "high_risk_criminals", label: "High Risk" },
              { key: "total_cases", label: "Total Cases" },
              { key: "open_cases", label: "Open Cases" },
              { key: "total_arrests", label: "Arrests" },
              { key: "active_thanas", label: "Active Thanas" },
            ])}
          </div>

          <div className={blockCls}>
            <h2 className={blockTitleCls}>Officer Workload (Top 5)</h2>
            {renderRows(workloadRows, [
              { key: "officer_id", label: "Officer ID" },
              { key: "full_name", label: "Officer" },
              { key: "badge_no", label: "Badge" },
              { key: "rank_name", label: "Rank" },
              { key: "thana_name", label: "Thana" },
              { key: "assigned_gds", label: "Assigned GD" },
              { key: "approved_gds", label: "Approved GD" },
              { key: "total_workload", label: "Total Workload" },
              { key: "workload_rank", label: "Rank" },
            ])}
          </div>

          <div className={blockCls}>
            <h2 className={blockTitleCls}>Criminal Ranking (Top 5)</h2>
            {renderRows(rankingRows, [
              { key: "criminal_id", label: "Criminal ID" },
              { key: "full_name", label: "Name" },
              { key: "status", label: "Status" },
              { key: "arrest_count", label: "Arrests" },
              { key: "case_count", label: "Cases" },
              { key: "overall_rank", label: "Overall Rank" },
              { key: "status_rank", label: "Status Rank" },
            ])}
          </div>

          <div className={blockCls}>
            <h2 className={blockTitleCls}>Thana Performance</h2>
            {renderRows(take(performance?.data), [
              { key: "thana_id", label: "Thana ID" },
              { key: "thana_name", label: "Thana" },
              { key: "district", label: "District" },
              { key: "officer_count", label: "Officers" },
              { key: "total_cases", label: "Total Cases" },
              { key: "closed_cases", label: "Closed Cases" },
              { key: "case_closure_rate", label: "Case Closure %" },
              { key: "total_gd_reports", label: "Total GD" },
              { key: "approved_gds", label: "Approved GD" },
              { key: "gd_approval_rate", label: "GD Approval %" },
              { key: "criminals_registered", label: "Criminals" },
              { key: "performance_rank", label: "Performance Rank" },
            ], "No data available")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsOverview;

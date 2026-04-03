import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  getCriminalOverview,
  getCrimeTypeDistribution,
  getCrimeYears,
  getCriminalRanking,
  getGdReportAnalytics,
  getOfficerRanking,
} from "@/services/Analytics/analyticsApi";
import {
  getCriminalFullProfile,
  getCriminalTimeline,
  getCriminalCaseHistory,
} from "@/services/Thana/thanaApi";
import userStore from "@/state/userStore";

const PIE_COLORS = ["#2563eb", "#0d9488", "#d97706", "#dc2626", "#7c3aed", "#16a34a", "#0ea5e9", "#f59e0b"];
const fmt = (n) => (n != null ? Number(n).toLocaleString() : "0");

function CaseInfo({ label, value, mono = false }) {
  return (
    <div className="bg-gray-800/70 border border-white/5 rounded-lg p-3">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-sm text-slate-200 ${mono ? "font-mono" : ""}`}>{value ?? "—"}</p>
    </div>
  );
}

function Info({ label, value, color = "text-slate-400" }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <p className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`text-2xl font-extrabold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function AnalyticsOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = userStore();

  const thanaId = user?.thana_id || user?.user_id || null;
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [selectedCaseFile, setSelectedCaseFile] = useState(null);

  const handleBack = () => {
    if (location.state?.modal) {
      navigate(-1);
      return;
    }
    navigate("/thana/dashboard");
  };

  const queryScope = useMemo(() => ({ thanaId }), [thanaId]);

  const { data: yearsData } = useQuery({ queryKey: ["thana-analytics-years"], queryFn: getCrimeYears });
  const yearOptions = (yearsData?.data || []).map((r) => r.year).filter(Boolean);

  const { data: overviewData } = useQuery({
    queryKey: ["thana-analytics-overview", queryScope],
    queryFn: () => getCriminalOverview(queryScope),
    enabled: Boolean(thanaId),
  });

  const { data: gdData } = useQuery({
    queryKey: ["thana-analytics-gd", queryScope],
    queryFn: () => getGdReportAnalytics(queryScope),
    enabled: Boolean(thanaId),
  });

  const { data: officerRankingData } = useQuery({
    queryKey: ["thana-analytics-officer-ranking", queryScope],
    queryFn: () => getOfficerRanking(queryScope),
    enabled: Boolean(thanaId),
  });

  const { data: rankingData } = useQuery({
    queryKey: ["thana-analytics-ranking", queryScope],
    queryFn: () => getCriminalRanking(queryScope),
    enabled: Boolean(thanaId),
  });

  const { data: typeData } = useQuery({
    queryKey: ["thana-analytics-crime-types", thanaId, year],
    queryFn: () => getCrimeTypeDistribution({ thanaId, year }),
    enabled: Boolean(thanaId),
  });

  const gdRow = Array.isArray(gdData?.data) ? gdData.data[0] : null;
  const officerRankingRows = Array.isArray(officerRankingData?.data) ? officerRankingData.data : [];
  const rankingRows = Array.isArray(rankingData?.data) ? rankingData.data : [];
  const overview = overviewData?.data || {};

  const gdStatusData = gdRow
    ? [
      { name: "Submitted", value: Number(gdRow.submitted || 0), fill: "#2563eb" },
      { name: "Assigned", value: Number(gdRow.assigned || 0), fill: "#d97706" },
      { name: "Approved", value: Number(gdRow.approved || 0), fill: "#16a34a" },
      { name: "Rejected", value: Number(gdRow.rejected || 0), fill: "#dc2626" },
    ]
    : [];

  const officerChart = officerRankingRows.slice(0, 8).map((o) => ({
    name: o.full_name,
    arrests: Number(o.arrest_count || 0),
    gdReports: Number(o.gd_report_count || 0),
    score: Number(o.ranking_score || 0),
  }));

  const criminalChart = rankingRows.slice(0, 8).map((r) => ({
    name: r.full_name,
    arrests: Number(r.arrest_count || 0),
    cases: Number(r.case_count || 0),
  }));

  const crimeTypeRows = (typeData?.data || []).map((r) => ({
    name: String(r.case_type || "unknown").replace(/_/g, " "),
    value: Number(r.total_cases || 0),
  }));

  const selectedCriminalId = selectedCriminal?.criminal_id || "";
  const { data: selectedCriminalProfileData, isLoading: isLoadingCriminalProfile } = useQuery({
    queryKey: ["thana-analytics-criminal-profile", selectedCriminalId],
    queryFn: () => getCriminalFullProfile(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });
  const { data: selectedCriminalTimelineData, isLoading: isLoadingCriminalTimeline } = useQuery({
    queryKey: ["thana-analytics-criminal-timeline", selectedCriminalId],
    queryFn: () => getCriminalTimeline(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });
  const { data: selectedCriminalCaseHistoryData, isLoading: isLoadingCriminalCaseHistory } = useQuery({
    queryKey: ["thana-analytics-criminal-case-history", selectedCriminalId],
    queryFn: () => getCriminalCaseHistory(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const selectedCriminalProfile = selectedCriminalProfileData?.data || null;
  const selectedCriminalTimeline = selectedCriminalTimelineData?.data || [];
  const selectedCriminalCaseHistory = selectedCriminalCaseHistoryData?.data || [];
  const profileCriminal = selectedCriminalProfile || selectedCriminal || {};

  return (
    <div className="space-y-6 bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-blue-300 font-bold">Thana Analytics</p>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Operational Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Live analytics for your thana only.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={String(year)}
            onChange={(e) => setYear(Number(e.target.value || currentYear))}
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200"
          >
            {(yearOptions.length ? yearOptions : [currentYear]).map((y) => (
              <option key={y} value={String(y)} className="text-slate-900">{y}</option>
            ))}
          </select>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Info label="Total Criminals" value={fmt(overview.total_criminals)} color="text-blue-700" />
        <Info label="Wanted" value={fmt(overview.wanted_criminals)} color="text-red-700" />
        <Info label="High Risk" value={fmt(overview.high_risk_criminals)} color="text-violet-700" />
        <Info label="Total GD Reports" value={fmt(gdRow?.total_gd_reports || 0)} color="text-amber-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">GD Status Breakdown</h3>
          <p className="text-xs text-slate-400 mb-3">Submitted/Assigned/Approved/Rejected</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gdStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {gdStatusData.map((d, idx) => <Cell key={idx} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Crime Type Distribution</h3>
          <p className="text-xs text-slate-400 mb-3">Case-file distribution for {year}</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={crimeTypeRows} dataKey="value" nameKey="name" outerRadius={95} innerRadius={45}>
                  {crimeTypeRows.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Officer Ranking</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={officerChart} margin={{ bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-22} textAnchor="end" interval={0} height={56} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="arrests" fill="#dc2626" radius={[5, 5, 0, 0]} name="Arrests" />
                <Bar dataKey="gdReports" fill="#2563eb" radius={[5, 5, 0, 0]} name="GD Reports" />
                <Bar dataKey="score" fill="#16a34a" radius={[5, 5, 0, 0]} name="Ranking Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Criminal Pressure Index</h3>
          <p className="text-xs text-slate-400 mb-3">Top criminals by arrests and case volume</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criminalChart} margin={{ bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-22} textAnchor="end" interval={0} height={56} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="arrests" fill="#dc2626" radius={[5, 5, 0, 0]} name="Arrests" />
                <Bar dataKey="cases" fill="#7c3aed" radius={[5, 5, 0, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Officer Ranking Table</h3>
            <p className="text-xs text-slate-400">Only officers under this thana. Click officer name for full profile.</p>
          </div>
          <div className="overflow-auto max-h-[360px]">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Officer</th>
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-center">Arrests</th>
                  <th className="px-4 py-2 text-center">GD Reports</th>
                  <th className="px-4 py-2 text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {officerRankingRows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No officer ranking data found.</td></tr>
                ) : officerRankingRows.map((o, index) => (
                  <tr key={o.officer_id} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-700">#{index + 1}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => navigate(`/analytics/officer/profile/${o.officer_id}`, { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
                        className="font-semibold text-blue-700 hover:underline text-left"
                      >
                        {o.full_name}
                      </button>
                      <p className="text-xs text-slate-400">{o.officer_id}</p>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{o.rank_code || "—"}</td>
                    <td className="px-4 py-2.5 text-center font-semibold text-red-700">{fmt(o.arrest_count)}</td>
                    <td className="px-4 py-2.5 text-center font-semibold text-blue-700">{fmt(o.gd_report_count)}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-green-700">{fmt(o.ranking_score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Criminal Ranking Table</h3>
            <p className="text-xs text-slate-400">Click criminal name to open full legal profile.</p>
          </div>
          <div className="overflow-auto max-h-[360px]">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Criminal</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">Arrests</th>
                  <th className="px-4 py-2 text-center">Cases</th>
                </tr>
              </thead>
              <tbody>
                {rankingRows.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No criminal ranking data found.</td></tr>
                ) : rankingRows.map((r) => (
                  <tr key={r.criminal_id} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-700">#{r.overall_rank}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => setSelectedCriminal(r)}
                        className="font-semibold text-blue-700 hover:underline text-left"
                      >
                        {r.full_name}
                      </button>
                      <p className="text-xs text-slate-400">{r.criminal_id}</p>
                    </td>
                    <td className="px-4 py-2.5 capitalize text-slate-600">{r.status || "—"}</td>
                    <td className="px-4 py-2.5 text-center font-semibold text-slate-800">{fmt(r.arrest_count)}</td>
                    <td className="px-4 py-2.5 text-center font-semibold text-slate-800">{fmt(r.case_count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCriminal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedCriminal(null)}
        >
          <div
            className="w-full max-w-5xl bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-red-400 via-amber-300 to-red-600">
                  {profileCriminal.image_url ? (
                    <img
                      src={profileCriminal.image_url}
                      alt={profileCriminal.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[11px] text-slate-400">
                      N/A
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Criminal Profile</p>
                  <h3 className="text-xl font-bold text-slate-100 mt-1">
                    {profileCriminal.full_name || "Unknown Criminal"}
                  </h3>
                </div>
              </div>
              <button onClick={() => setSelectedCriminal(null)} className="text-slate-400 hover:text-slate-200 text-sm">Close</button>
            </div>

            {(isLoadingCriminalProfile || isLoadingCriminalTimeline || isLoadingCriminalCaseHistory) && (
              <p className="text-sm text-slate-400 mb-4">Loading full legal history...</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <CaseInfo label="Criminal ID" value={profileCriminal.criminal_id} mono />
              <CaseInfo label="NID" value={profileCriminal.nid} mono />
              <CaseInfo label="Gender" value={profileCriminal.gender} />
              <CaseInfo label="Age" value={profileCriminal.age ?? "—"} />
              <CaseInfo label="Birth Date" value={profileCriminal.birth_date ? new Date(profileCriminal.birth_date).toLocaleDateString() : "—"} />
              <CaseInfo label="Father's Name" value={profileCriminal.father_name} />
              <CaseInfo label="Mother's Name" value={profileCriminal.mother_name} />
              <CaseInfo label="Aliases" value={profileCriminal.aliases} />
              <CaseInfo label="Nationality" value={profileCriminal.nationality} />
              <CaseInfo label="Status" value={profileCriminal.status} />
              <CaseInfo label="Risk Level" value={profileCriminal.risk_level != null ? `${profileCriminal.risk_level}/10` : "—"} />
              <CaseInfo label="Registered Thana" value={profileCriminal.registered_thana || profileCriminal.registered_thana_id || thanaId} />
              <CaseInfo label="Open Cases" value={profileCriminal.open_cases ?? "—"} />
              <CaseInfo label="Closed Cases" value={profileCriminal.closed_cases ?? "—"} />
              <CaseInfo label="Total Arrests" value={profileCriminal.total_arrests ?? "—"} />
              <CaseInfo label="Organizations" value={profileCriminal.organizations || "None"} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Legal History Timeline</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden">
                {selectedCriminalTimeline.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400">No legal history found.</p>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {selectedCriminalTimeline.map((item, index) => (
                      <li key={`${item.event_type}-${item.event_date}-${index}`} className="p-3">
                        <p className="text-xs text-slate-500">{item.event_date ? new Date(item.event_date).toLocaleString() : "—"}</p>
                        <p className="text-sm font-semibold text-slate-200 mt-1">{item.event_type}</p>
                        <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Case Files & Updates</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden">
                {selectedCriminalCaseHistory.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400">No case files found for this criminal.</p>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {selectedCriminalCaseHistory.map((caseItem) => (
                      <li
                        key={caseItem.case_id}
                        className="p-3 cursor-pointer hover:bg-white/[0.03]"
                        onClick={() => {
                          setSelectedCaseFile({
                            case_id: caseItem.case_id,
                            case_title: caseItem.case_title,
                            case_type: caseItem.case_type,
                            status: caseItem.status,
                            filed_at: caseItem.filed_at,
                            description: caseItem.description,
                            criminal_id: profileCriminal?.criminal_id,
                            criminal_name: profileCriminal?.full_name,
                            thana_id: caseItem.thana_id,
                            thana_name: caseItem.thana_name,
                          });
                        }}
                      >
                        <p className="text-sm font-semibold text-blue-300 hover:text-blue-200">Case #{caseItem.case_id}: {caseItem.case_title || "Untitled Case"}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Type: {caseItem.case_type || "—"} | Status: {caseItem.status || "—"} | Registered: {caseItem.filed_at ? new Date(caseItem.filed_at).toLocaleString() : "—"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCaseFile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setSelectedCaseFile(null)}>
          <div className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Case Details</p>
                <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedCaseFile.case_title || "Untitled Case"}</h3>
              </div>
              <button onClick={() => setSelectedCaseFile(null)} className="text-slate-400 hover:text-slate-200 text-sm">Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <CaseInfo label="Case ID" value={selectedCaseFile.case_id} mono />
              <CaseInfo label="Case Type" value={selectedCaseFile.case_type} />
              <CaseInfo label="Status" value={selectedCaseFile.status} />
              <CaseInfo label="Registered At" value={selectedCaseFile.filed_at ? new Date(selectedCaseFile.filed_at).toLocaleString() : "—"} />
              <CaseInfo label="Criminal" value={selectedCaseFile.criminal_name || "—"} />
              <CaseInfo label="Criminal ID" value={selectedCaseFile.criminal_id} mono />
              <CaseInfo label="Thana" value={selectedCaseFile.thana_name || "—"} />
              <CaseInfo label="Thana ID" value={selectedCaseFile.thana_id || "—"} mono />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Description</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap">
                {selectedCaseFile.description || "No description provided."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsOverview;

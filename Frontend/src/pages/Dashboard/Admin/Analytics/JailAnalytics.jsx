import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getAdminJailDetails, getAdminJailOverview } from "@/services/Analytics/analyticsApi";
import {
  getAllJails,
  getCriminalFullProfile,
  getCriminalTimeline,
  getCriminalCaseHistory,
} from "@/services/Admin/adminApi";

const fmt = (n) => Number(n || 0).toLocaleString();

const pct = (n) => `${Number(n || 0).toFixed(1)}%`;

function StatCard({ label, value, tone = "blue", hint }) {
  const tones = {
    blue: "from-blue-50 to-cyan-50 border-blue-200 text-blue-700",
    amber: "from-amber-50 to-orange-50 border-amber-200 text-amber-700",
    rose: "from-rose-50 to-red-50 border-rose-200 text-rose-700",
    violet: "from-violet-50 to-indigo-50 border-violet-200 text-violet-700",
  };
  return (
    <div className={`rounded-xl border bg-gradient-to-br px-4 py-3 ${tones[tone] || tones.blue}`}>
      <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">{label}</p>
      <p className="text-2xl font-extrabold mt-1">{value}</p>
      {hint ? <p className="text-xs text-slate-500 mt-1">{hint}</p> : null}
    </div>
  );
}

function Meter({ label, value, max, color = "bg-blue-500" }) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-500">{fmt(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Info({ label, value, mono = false }) {
  return (
    <div className="bg-gray-800/70 border border-white/5 rounded-lg p-3">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-slate-200 ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</p>
    </div>
  );
}

export default function JailAnalytics() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [selectedJailId, setSelectedJailId] = useState("");
  const [selectedCriminal, setSelectedCriminal] = useState(null);

  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ["admin-jail-overview"],
    queryFn: () => getAdminJailOverview({ limit: 5 }),
  });

  const { data: allJailsData } = useQuery({
    queryKey: ["admin-all-jails-list"],
    queryFn: getAllJails,
  });

  const { data: jailDetailsData, isLoading: detailsLoading } = useQuery({
    queryKey: ["admin-jail-details", selectedJailId],
    queryFn: () => getAdminJailDetails(selectedJailId),
    enabled: !!selectedJailId,
  });

  const selectedCriminalId = selectedCriminal?.criminal_id || "";

  const { data: selectedCriminalFullProfileData } = useQuery({
    queryKey: ["admin-jail-analytics-criminal-profile", selectedCriminalId],
    queryFn: () => getCriminalFullProfile(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const { data: selectedCriminalTimelineData } = useQuery({
    queryKey: ["admin-jail-analytics-criminal-timeline", selectedCriminalId],
    queryFn: () => getCriminalTimeline(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const { data: selectedCriminalCaseHistoryData } = useQuery({
    queryKey: ["admin-jail-analytics-criminal-case-history", selectedCriminalId],
    queryFn: () => getCriminalCaseHistory(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const selectedCriminalFullProfile = selectedCriminalFullProfileData?.data || null;
  const selectedCriminalTimeline = selectedCriminalTimelineData?.data || [];
  const selectedCriminalCaseHistory = selectedCriminalCaseHistoryData?.data || [];

  const overview = overviewData?.data || {};
  const districtRows = (overview.jails_by_district || []).slice(0, 5);
  const topCriminalRows = (overview.top_jails_by_criminals || []).slice(0, 5);
  const topVacancyRows = (overview.top_jails_by_vacancy || []).slice(0, 5);
  const topOccupancyRows = (overview.top_jails_by_occupancy || []).slice(0, 5);
  const allJails = Array.isArray(allJailsData?.data) ? allJailsData.data : [];

  const jailSuggestions = (() => {
    const q = search.trim().toLowerCase();
    if (!q) return allJails.slice(0, 10);
    return allJails
      .filter((j) =>
        String(j.jail_name || "").toLowerCase().includes(q) ||
        String(j.jail_id || "").toLowerCase().includes(q),
      )
      .slice(0, 10);
  })();

  const listRows = (() => {
    const q = search.trim().toLowerCase();
    if (!q) return allJails;
    return allJails.filter((j) =>
      String(j.jail_name || "").toLowerCase().includes(q) ||
      String(j.jail_id || "").toLowerCase().includes(q),
    );
  })();

  const details = jailDetailsData?.data || null;

  const topCriminalJail = (overview.top_jails_by_criminals || [])[0] || null;
  const topVacancyJail = (overview.top_jails_by_vacancy || [])[0] || null;
  const topOccupancyJail = (overview.top_jails_by_occupancy || [])[0] || null;
  const districtLeader = (overview.jails_by_district || [])[0] || null;

  const detailCapacity = Number(details?.summary?.total_cell_capacity || 0);
  const detailCriminals = Number(details?.summary?.total_criminals || 0);
  const detailOccupancyPercent = detailCapacity > 0 ? (detailCriminals * 100) / detailCapacity : 0;

  const handleBack = () => {
    if (location.state?.modal) {
      const bg = location.state?.backgroundLocation;
      if (bg?.pathname) {
        navigate({ pathname: bg.pathname, search: bg.search || "", hash: bg.hash || "" }, { replace: true });
        return;
      }
      navigate("/admin/dashboard", { replace: true });
      return;
    }
    navigate("/admin/dashboard");
  };

  return (
    <div className="space-y-6 bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-blue-300 font-bold">Admin Analytics</p>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Jail Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Administrative facility overview and jail-level drilldown.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/analytics", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Criminal
          </button>
          <button
            onClick={() => navigate("/analytics/officer", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Officer
          </button>
          <button
            onClick={() => navigate("/analytics/thana", { state: { modal: true, backgroundLocation: location.state?.backgroundLocation || location } })}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm font-semibold transition-all"
          >
            Thana
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Jail</button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto bg-white text-slate-800 rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Busiest Jail"
          value={topCriminalJail ? fmt(topCriminalJail.active_criminals) : "0"}
          tone="rose"
          hint={topCriminalJail ? `${topCriminalJail.jail_name}` : "No data"}
        />
        <StatCard
          label="Highest Occupancy"
          value={topOccupancyJail ? pct(topOccupancyJail.occupancy_percentage) : "0.0%"}
          tone="amber"
          hint={topOccupancyJail ? `${topOccupancyJail.jail_name}` : "No data"}
        />
        <StatCard
          label="Highest Vacancy"
          value={topVacancyJail ? fmt(topVacancyJail.vacancy) : "0"}
          tone="blue"
          hint={topVacancyJail ? `${topVacancyJail.jail_name}` : "No data"}
        />
        <StatCard
          label="Top District"
          value={districtLeader ? fmt(districtLeader.total_jails) : "0"}
          tone="violet"
          hint={districtLeader ? `${districtLeader.district}` : "No data"}
        />
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Quick Insights</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-slate-500">Most crowded right now</p>
            <p className="font-semibold mt-1">{topCriminalJail ? `${topCriminalJail.jail_name} (${fmt(topCriminalJail.active_criminals)})` : "No data"}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-slate-500">Most room available</p>
            <p className="font-semibold mt-1">{topVacancyJail ? `${topVacancyJail.jail_name} (${fmt(topVacancyJail.vacancy)} spots)` : "No data"}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-slate-500">District with most facilities</p>
            <p className="font-semibold mt-1">{districtLeader ? `${districtLeader.district} (${fmt(districtLeader.total_jails)} jails)` : "No data"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <CardTable title="Jails by District (Top 5)" rows={districtRows} columns={[
          ["district", "District"],
          ["total_jails", "Jails"],
        ]} loading={overviewLoading} />

        <CardTable title="Top Jails by Active Criminals (Top 5)" rows={topCriminalRows} columns={[
          ["jail_name", "Jail"],
          ["district", "District"],
          ["active_criminals", "Criminals"],
        ]} loading={overviewLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CardTable title="Top Jails by Vacancy (Top 5)" rows={topVacancyRows} columns={[
          ["jail_name", "Jail"],
          ["vacancy", "Vacancy"],
          ["total_capacity", "Capacity"],
        ]} loading={overviewLoading} />

        <CardTable title="Top Jails by Occupancy % (Top 5)" rows={topOccupancyRows} columns={[
          ["jail_name", "Jail"],
          ["occupancy_percentage", "Occupancy %"],
          ["total_occupants", "Occupants"],
        ]} loading={overviewLoading} />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
        <label className="text-xs uppercase tracking-widest text-slate-500 block mb-2">Search Jail</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type jail name..."
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        {search.trim().length >= 1 && jailSuggestions.length > 0 && (
          <div className="mt-2 bg-white border border-slate-200 rounded-lg max-h-44 overflow-auto">
            {jailSuggestions.map((j) => (
              <button
                key={j.jail_id}
                type="button"
                onClick={() => {
                  setSelectedJailId(j.jail_id);
                  setSearch(j.jail_name || j.jail_id);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
              >
                {j.jail_name} <span className="text-slate-400">({j.jail_id})</span>
              </button>
            ))}
          </div>
        )}

        {!search.trim() && (overview.top_jails_by_criminals || []).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {(overview.top_jails_by_criminals || []).slice(0, 6).map((j) => (
              <button
                key={`chip-${j.jail_id}`}
                type="button"
                onClick={() => {
                  setSelectedJailId(j.jail_id);
                  setSearch(j.jail_name || j.jail_id);
                }}
                className="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-100"
              >
                {j.jail_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left p-3">Jail ID</th>
              <th className="text-left p-3">Jail</th>
              <th className="text-left p-3">District</th>
              <th className="text-left p-3">Zone</th>
              <th className="text-left p-3">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {listRows.map((j) => (
              <tr
                key={j.jail_id}
                className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                onClick={() => setSelectedJailId(j.jail_id)}
              >
                <td className="p-3 font-mono text-xs">{j.jail_id}</td>
                <td className="p-3 font-medium">{j.jail_name}</td>
                <td className="p-3">{j.district}</td>
                <td className="p-3">{j.zone}</td>
                <td className="p-3">{fmt(j.capacity)}</td>
              </tr>
            ))}
            {listRows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">No jails found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedJailId && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          {detailsLoading ? (
            <p className="text-sm text-slate-500">Loading jail details...</p>
          ) : !details ? (
            <p className="text-sm text-slate-500">No details found.</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-3">{details.jail?.jail_name} ({details.jail?.jail_id})</h2>

              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Occupancy Snapshot</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Meter label="Current Criminals" value={detailCriminals} max={Math.max(detailCapacity, detailCriminals, 1)} color="bg-rose-500" />
                  <Meter label="Cell Capacity" value={detailCapacity} max={Math.max(detailCapacity, detailCriminals, 1)} color="bg-blue-500" />
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 flex items-center justify-between">
                    <span className="text-sm text-slate-600">Occupancy Rate</span>
                    <span className="text-lg font-bold text-slate-800">{pct(detailOccupancyPercent)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <Info label="Total Criminals" value={fmt(details.summary?.total_criminals)} />
                <Info label="Blocks" value={fmt(details.summary?.total_blocks)} />
                <Info label="Cells" value={fmt(details.summary?.total_cells)} />
                <Info label="Cell Capacity" value={fmt(details.summary?.total_cell_capacity)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="p-3 border-b border-slate-100 text-sm font-semibold">Locations</div>
                  <div className="max-h-48 overflow-auto">
                    {(details.locations || []).length === 0 ? (
                      <p className="p-3 text-sm text-slate-500">No linked locations.</p>
                    ) : (
                      (details.locations || []).map((l) => (
                        <div key={l.location_id} className="p-3 text-sm border-b border-slate-100">
                          <div className="font-medium">{l.district} · {l.zone}</div>
                          <div className="text-slate-500">{l.address}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="p-3 border-b border-slate-100 text-sm font-semibold">Criminal List</div>
                  <div className="max-h-64 overflow-auto">
                    {(details.criminals || []).length === 0 ? (
                      <p className="p-3 text-sm text-slate-500">No active criminals in this jail.</p>
                    ) : (
                      (details.criminals || []).map((c) => (
                        <button
                          key={c.incarceration_id}
                          type="button"
                          onClick={() => setSelectedCriminal(c)}
                          className="w-full text-left p-3 text-sm border-b border-slate-100 hover:bg-slate-50"
                        >
                          <div className="font-medium">{c.full_name} <span className="text-slate-400">({c.criminal_id})</span></div>
                          <div className="text-xs text-slate-500 mt-1">Arrest: {c.arrest_id} · Block/Cell: {c.block_name || "—"}/{c.cell_number || "—"}</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {selectedCriminal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[95] flex items-center justify-center p-4" onClick={() => setSelectedCriminal(null)}>
          <div className="w-full max-w-4xl bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-red-400 via-amber-300 to-red-600">
                  {(selectedCriminal?.image_url || selectedCriminalFullProfile?.image_url) ? (
                    <img
                      src={selectedCriminal.image_url || selectedCriminalFullProfile?.image_url}
                      alt={selectedCriminal.full_name}
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
                <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedCriminal.full_name}</h3>
                </div>
              </div>
              <button onClick={() => setSelectedCriminal(null)} className="text-slate-400 hover:text-slate-200 text-sm">Close</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <Info label="Criminal ID" value={selectedCriminal.criminal_id} mono />
              <Info label="Status" value={selectedCriminal.status} />
              <Info label="Risk" value={selectedCriminal.risk_level != null ? `${selectedCriminal.risk_level}/10` : "—"} />
              <Info label="Arrest ID" value={selectedCriminal.arrest_id} mono />
              <Info label="Gender" value={selectedCriminalFullProfile?.gender} />
              <Info label="Age" value={selectedCriminalFullProfile?.age ?? "—"} />
              <Info label="Open Cases" value={selectedCriminalFullProfile?.open_cases ?? "—"} />
              <Info label="Total Arrests" value={selectedCriminalFullProfile?.total_arrests ?? "—"} />
            </div>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Timeline</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden">
                {selectedCriminalTimeline.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400">No timeline found.</p>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {selectedCriminalTimeline.map((item, idx) => (
                      <li key={`${item.event_type}-${idx}`} className="p-3">
                        <p className="text-xs text-slate-500">{item.event_date ? new Date(item.event_date).toLocaleString() : "—"}</p>
                        <p className="text-sm font-semibold text-slate-200 mt-1">{item.event_type}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Case Files</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden">
                {selectedCriminalCaseHistory.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400">No case file history found.</p>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {selectedCriminalCaseHistory.map((c) => (
                      <li key={c.case_id} className="p-3">
                        <p className="text-sm text-slate-200 font-semibold">Case #{c.case_id}: {c.case_title || "Untitled"}</p>
                        <p className="text-xs text-slate-400 mt-1">{c.case_type} | {c.status}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

function CardTable({ title, rows, columns, loading }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-3 border-b border-slate-100 text-sm font-semibold bg-gradient-to-r from-slate-50 to-white">{title}</div>
      {loading ? (
        <p className="p-4 text-sm text-slate-500">Loading...</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left p-3 w-12">#</th>
              {columns.map(([k, label]) => (
                <th key={k} className="text-left p-3">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center text-slate-500">No data found</td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} className={`border-t border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-blue-50/40`}>
                  <td className="p-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                      {idx + 1}
                    </span>
                  </td>
                  {columns.map(([k]) => (
                    <td key={k} className={`p-3 ${typeof r?.[k] === "number" ? "font-semibold text-slate-800" : "text-slate-700"}`}>
                      {r?.[k] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

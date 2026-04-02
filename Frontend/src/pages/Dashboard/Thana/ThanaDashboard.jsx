import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { thanaSignoutApi } from "@/services/authServices/signoutApi";
import {
  getCriminalsByThana,
  getOfficersByThana,
  getCaseFilesByThana,
  getGDReportsByThana,
  getAllOrganizations,
  getAllLocations,
  getAllCriminalOrganizationLinks,
  getAllCriminalRelations,
  getAllCriminalLocations,
} from "@/services/Thana/thanaApi";
import { getUnreadNotificationCount } from "@/services/Notification/notificationApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";

function ThanaDashboard() {
  const navigate = useNavigate();
  const { user, clearUser } = userStore();
  const thanaId = user?.thana_id;
  const [activeTab, setActiveTab] = useState("criminals");

  const handleSignout = async () => {
    await thanaSignoutApi();
    clearUser();
    navigate("/");
  };

  const { data: crimData } = useQuery({
    queryKey: ["thanaCriminals", thanaId],
    queryFn: () => getCriminalsByThana(thanaId),
    enabled: !!thanaId,
  });
  const { data: offData } = useQuery({
    queryKey: ["thanaOfficers", thanaId],
    queryFn: () => getOfficersByThana(thanaId),
    enabled: !!thanaId,
  });
  const { data: caseData } = useQuery({
    queryKey: ["thanaCases", thanaId],
    queryFn: () => getCaseFilesByThana(thanaId),
    enabled: !!thanaId,
  });
  const { data: gdData } = useQuery({
    queryKey: ["thanaGD", thanaId],
    queryFn: () => getGDReportsByThana(thanaId),
    enabled: !!thanaId,
  });
  const { data: orgData } = useQuery({
    queryKey: ["thanaOrganizations"],
    queryFn: getAllOrganizations,
  });
  const { data: locData } = useQuery({
    queryKey: ["thanaLocations"],
    queryFn: getAllLocations,
  });
  const { data: orgLinksData } = useQuery({
    queryKey: ["thanaCriminalOrgLinks"],
    queryFn: getAllCriminalOrganizationLinks,
  });
  const { data: relData } = useQuery({
    queryKey: ["thanaCriminalRelations"],
    queryFn: getAllCriminalRelations,
  });
  const { data: crimLocData } = useQuery({
    queryKey: ["thanaCriminalLocations"],
    queryFn: getAllCriminalLocations,
  });
  const { data: unreadNotificationData } = useQuery({
    queryKey: ["thanaUnreadNotificationCount"],
    queryFn: getUnreadNotificationCount,
  });

  const criminals = crimData?.data || [];
  const officers = offData?.data || [];
  const cases = caseData?.data || [];
  const gdReports = gdData?.data || [];
  const organizations = orgData?.data || [];
  const locations = locData?.data || [];
  const orgLinks = orgLinksData?.data || [];
  const relations = relData?.data || [];
  const criminalLocations = crimLocData?.data || [];
  const unreadNotificationCount = Number(
    unreadNotificationData?.data?.unread_count || 0,
  );

  const statusColor = (s) => {
    const c = {
      in_custody: "text-red-400 bg-red-500/10",
      on_bail: "text-yellow-400 bg-yellow-500/10",
      wanted: "text-orange-400 bg-orange-500/10",
      escaped: "text-rose-400 bg-rose-500/10",
      released: "text-green-400 bg-green-500/10",
      unknown: "text-gray-400 bg-gray-500/10",
      submitted: "text-blue-400 bg-blue-500/10",
      assigned: "text-yellow-400 bg-yellow-500/10",
      approved: "text-green-400 bg-green-500/10",
      rejected: "text-red-400 bg-red-500/10",
    };
    return c[s] || "text-gray-400 bg-gray-500/10";
  };

  const tabs = [
    { id: "criminals", label: `Criminals (${criminals.length})` },
    { id: "officers", label: `Officers (${officers.length})` },
    { id: "cases", label: `Cases (${cases.length})` },
    { id: "gd", label: `GD Reports (${gdReports.length})` },
    { id: "organizations", label: `Organizations (${organizations.length})` },
    { id: "locations", label: `Locations (${locations.length})` },
    { id: "orgLinks", label: `Criminal-Org Links (${orgLinks.length})` },
    { id: "relations", label: `Criminal Relations (${relations.length})` },
    { id: "crimLocations", label: `Criminal Locations (${criminalLocations.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200">
      <header className="border-b border-white/5 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-lg font-bold">Thana Dashboard</h1>
            <p className="text-xs text-slate-500 font-mono">
              {user?.thana_name || thanaId}
            </p>
          </div>
          <button
            onClick={handleSignout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { l: "Criminals", v: criminals.length, c: "text-red-400" },
            { l: "Officers", v: officers.length, c: "text-green-400" },
            { l: "Cases", v: cases.length, c: "text-blue-400" },
            { l: "GD Reports", v: gdReports.length, c: "text-amber-400" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-gray-900 border border-white/5 rounded-xl p-4"
            >
              <p className="text-xs text-slate-500 uppercase">{s.l}</p>
              <p className={`text-2xl font-bold mt-1 ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => navigate("/thana/add-criminal")}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg"
          >
            + Add Criminal
          </button>
          <button
            onClick={() => navigate("/thana/add-officer")}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg"
          >
            + Add Officer
          </button>
          <button
            onClick={() => navigate("/thana/add-case-file")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg"
          >
            + Add Case File
          </button>
          <button
            onClick={() => navigate("/thana/add-location")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg"
          >
            + Add Location
          </button>
          <button
            onClick={() => navigate("/thana/add-organization")}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm rounded-lg"
          >
            + Add Organization
          </button>
          <button
            onClick={() => navigate("/thana/update-organization")}
            className="px-4 py-2 bg-orange-700 hover:bg-orange-600 text-white text-sm rounded-lg"
          >
            + Update Organization
          </button>
          <button
            onClick={() => navigate("/thana/add-criminal-relation")}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg"
          >
            + Add Criminal Relation
          </button>
          <button
            onClick={() => navigate("/thana/add-criminal-location")}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm rounded-lg"
          >
            + Add Criminal Location
          </button>
          <button
            onClick={() => navigate("/thana/add-criminal-organization")}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg"
          >
            + Add Criminal Organization
          </button>
          <button
            onClick={() => navigate("/thana/update-criminal-organization")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg"
          >
            + Update Criminal Organization
          </button>
          <button
            onClick={() => navigate("/thana/update-criminal-relation")}
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-sm rounded-lg"
          >
            + Update Criminal Relation
          </button>
          <button
            onClick={() => navigate("/thana/update-location")}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white text-sm rounded-lg"
          >
            + Update/Remove Location
          </button>
          <button
            onClick={() => navigate("/thana/notifications")}
            className="relative px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded-lg"
          >
            Notifications
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("/thana/analytics-overview")}
            className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm rounded-lg"
          >
            Analytics Overview
          </button>
          <button
            onClick={() => navigate("/thana/transfer-criminal")}
            className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded-lg"
          >
            Transfer Criminal
          </button>
          <button
            onClick={() => navigate("/thana/transfer-history")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg"
          >
            Transfer History
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-900 border border-white/5 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === t.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Criminals Tab */}
        {activeTab === "criminals" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Risk</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {criminals.map((c) => (
                  <tr
                    key={c.criminal_id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="p-3 font-mono text-xs">{c.criminal_id}</td>
                    <td className="p-3 font-medium">{c.full_name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{c.risk_level}/10</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          navigate(`/thana/update-criminal/${c.criminal_id}`)
                        }
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {criminals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No criminals registered
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Officers Tab */}
        {activeTab === "officers" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Badge</th>
                  <th className="text-left p-3">Rank</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((o) => (
                  <tr key={o.officer_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{o.officer_id}</td>
                    <td className="p-3">{o.full_name}</td>
                    <td className="p-3 font-mono text-xs">{o.badge_no}</td>
                    <td className="p-3">{o.rank_code}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          navigate(`/thana/update-officer/${o.officer_id}`)
                        }
                        className="text-blue-400 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {officers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No officers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === "cases" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">Case #</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Criminal</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr
                    key={c.case_id || c.case_number}
                    className="border-b border-white/5"
                  >
                    <td className="p-3 font-mono text-xs">{c.case_number}</td>
                    <td className="p-3">{c.case_type}</td>
                    <td className="p-3">{c.criminal_id}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          navigate(`/thana/update-case-file/${c.case_id}`)
                        }
                        className="text-blue-400 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {cases.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No case files found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* GD Reports Tab */}
        {activeTab === "gd" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gdReports.map((g) => (
                  <tr key={g.gd_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{g.gd_id}</td>
                    <td className="p-3 text-xs capitalize">
                      {g.gd_type?.replace("_", " ") || "—"}
                    </td>
                    <td className="p-3 truncate max-w-xs">{g.description}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(g.status)}`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs">
                      {g.submitted_at
                        ? new Date(g.submitted_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate(`/thana/gd/manage/${g.gd_id}`)}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {gdReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No GD reports
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === "organizations" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">Org ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Ideology</th>
                  <th className="text-left p-3">Threat</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((o) => (
                  <tr key={o.org_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{o.org_id}</td>
                    <td className="p-3">{o.name}</td>
                    <td className="p-3">{o.ideology || "—"}</td>
                    <td className="p-3">{o.threat_level}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate(`/thana/update-organization/${o.org_id}`)}
                        className="text-blue-400 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {organizations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No organizations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === "locations" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">Location ID</th>
                  <th className="text-left p-3">District</th>
                  <th className="text-left p-3">Zone</th>
                  <th className="text-left p-3">Address</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((l) => (
                  <tr key={l.location_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{l.location_id}</td>
                    <td className="p-3">{l.district}</td>
                    <td className="p-3">{l.zone}</td>
                    <td className="p-3">{l.address}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate(`/thana/update-location/${l.location_id}`)}
                        className="text-blue-400 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {locations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No locations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Criminal-Organization Links Tab */}
        {activeTab === "orgLinks" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">Criminal ID</th>
                  <th className="text-left p-3">Organization ID</th>
                  <th className="text-left p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {orgLinks.map((link, idx) => (
                  <tr key={`${link.criminal_id}-${link.org_id}-${idx}`} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{link.criminal_id}</td>
                    <td className="p-3 font-mono text-xs">{link.org_id}</td>
                    <td className="p-3">{link.role || "—"}</td>
                  </tr>
                ))}
                {orgLinks.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No criminal-organization links found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Criminal Relations Tab */}
        {activeTab === "relations" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">Relation ID</th>
                  <th className="text-left p-3">Criminal 1</th>
                  <th className="text-left p-3">Criminal 2</th>
                  <th className="text-left p-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {relations.map((r) => (
                  <tr key={r.relation_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{r.relation_id}</td>
                    <td className="p-3 font-mono text-xs">{r.criminal_id_1}</td>
                    <td className="p-3 font-mono text-xs">{r.criminal_id_2}</td>
                    <td className="p-3">{r.relation_type}</td>
                  </tr>
                ))}
                {relations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No criminal relations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Criminal Locations Tab */}
        {activeTab === "crimLocations" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">Link ID</th>
                  <th className="text-left p-3">Criminal ID</th>
                  <th className="text-left p-3">Location ID</th>
                  <th className="text-left p-3">Noted At</th>
                </tr>
              </thead>
              <tbody>
                {criminalLocations.map((cl) => (
                  <tr key={cl.criminal_location_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{cl.criminal_location_id}</td>
                    <td className="p-3 font-mono text-xs">{cl.criminal_id}</td>
                    <td className="p-3 font-mono text-xs">{cl.location_id}</td>
                    <td className="p-3 text-xs">{cl.noted_at ? new Date(cl.noted_at).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {criminalLocations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No criminal-location links found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default ThanaDashboard;
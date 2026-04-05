import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { thanaSignoutApi } from "@/services/authServices/signoutApi";
import {
  getCriminalsByThana,
  getCriminalFullProfile,
  getCriminalTimeline,
  getCriminalCaseHistory,
  getOfficersByThana,
  getCaseFilesByThana,
  getGDReportsByThana,
  getAllOrganizations,
  getAllLocations,
  getAllCriminalOrganizationLinks,
  getAllCriminalRelations,
} from "@/services/Thana/thanaApi";
import { getUnreadNotificationCount } from "@/services/Notification/notificationApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";

function ThanaDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = userStore();
  const thanaId = user?.thana_id;
  const [activeTab, setActiveTab] = useState("criminals");
  const [selectedCaseFile, setSelectedCaseFile] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [selectedGDReport, setSelectedGDReport] = useState(null);
  const [gdTypeSort, setGdTypeSort] = useState("none");
  const [caseTypeSort, setCaseTypeSort] = useState("none");
  const [expandedOfficerImage, setExpandedOfficerImage] = useState(null);
  const [expandedCriminalImage, setExpandedCriminalImage] = useState(null);

  const handleSignout = async () => {
    await thanaSignoutApi();
    clearUser();
    navigate("/");
  };

  const openThanaModal = (path) => {
    navigate(path, {
      state: {
        modal: true,
        backgroundLocation: location,
      },
    });
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
  const { data: unreadNotificationData } = useQuery({
    queryKey: ["thanaUnreadNotificationCount"],
    queryFn: getUnreadNotificationCount,
  });
  const selectedCriminalId = selectedCriminal?.criminal_id || "";
  const { data: selectedCriminalProfileData, isLoading: isLoadingCriminalProfile } = useQuery({
    queryKey: ["thana-criminal-profile", selectedCriminalId],
    queryFn: () => getCriminalFullProfile(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });
  const { data: selectedCriminalTimelineData, isLoading: isLoadingCriminalTimeline } = useQuery({
    queryKey: ["thana-criminal-timeline", selectedCriminalId],
    queryFn: () => getCriminalTimeline(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });
  const { data: selectedCriminalCaseHistoryData, isLoading: isLoadingCriminalCaseHistory } = useQuery({
    queryKey: ["thana-criminal-case-history", selectedCriminalId],
    queryFn: () => getCriminalCaseHistory(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const criminals = crimData?.data || [];
  const officers = offData?.data || [];
  const cases = caseData?.data || [];
  const gdReports = gdData?.data || [];
  const organizations = orgData?.data || [];
  const locations = locData?.data || [];
  const orgLinks = orgLinksData?.data || [];
  const relations = relData?.data || [];
  const unreadNotificationCount = Number(
    unreadNotificationData?.data?.unread_count || 0,
  );
  const selectedCriminalProfile = selectedCriminalProfileData?.data || null;
  const selectedCriminalTimeline = selectedCriminalTimelineData?.data || [];
  const selectedCriminalCaseHistory = selectedCriminalCaseHistoryData?.data || [];

  const sortedCases = [...cases].sort((a, b) => {
    if (caseTypeSort === "none") return 0;
    const av = String(a?.case_type || "").toLowerCase();
    const bv = String(b?.case_type || "").toLowerCase();
    return caseTypeSort === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const sortedGdReports = [...gdReports].sort((a, b) => {
    if (gdTypeSort === "none") return 0;
    const av = String(a?.gd_type || "").toLowerCase();
    const bv = String(b?.gd_type || "").toLowerCase();
    return gdTypeSort === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

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
  ];

  const quickActionClass =
    "thana-quick-action-btn px-4 py-2 text-white text-sm rounded-lg";

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => openThanaModal("/thana/notifications")}
              className="thana-icon-btn relative w-10 h-10 rounded-lg transition-all flex items-center justify-center"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
            <button
              onClick={handleSignout}
              className="thana-danger-btn px-4 py-2 text-sm rounded-lg"
            >
              Sign Out
            </button>
          </div>
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
            onClick={() => openThanaModal("/thana/add-criminal")}
            className={quickActionClass}
          >
            + Add Criminal
          </button>
          <button
            onClick={() => openThanaModal("/thana/add-officer")}
            className={quickActionClass}
          >
            + Add Officer
          </button>
          <button
            onClick={() => openThanaModal("/thana/add-case-file")}
            className={quickActionClass}
          >
            + Add Case File
          </button>
          <button
            onClick={() => openThanaModal("/thana/add-location")}
            className={quickActionClass}
          >
            + Add Location
          </button>
          <button
            onClick={() => openThanaModal("/thana/add-organization")}
            className={quickActionClass}
          >
            + Add Organization
          </button>
          <button
            onClick={() => openThanaModal("/thana/update-organization")}
            className={quickActionClass}
          >
            + Update Organization
          </button>
          <button
            onClick={() => openThanaModal("/thana/add-criminal-relation")}
            className={quickActionClass}
          >
            + Add Criminal Relation
          </button>
          <button
            onClick={() => openThanaModal("/thana/add-criminal-organization")}
            className={quickActionClass}
          >
            + Add Criminal Organization
          </button>
          <button
            onClick={() => openThanaModal("/thana/update-criminal-organization")}
            className={quickActionClass}
          >
            + Update Criminal Organization
          </button>
          <button
            onClick={() => openThanaModal("/thana/update-criminal-relation")}
            className={quickActionClass}
          >
            + Update Criminal Relation
          </button>
          <button
            onClick={() => openThanaModal("/thana/update-location")}
            className={quickActionClass}
          >
            + Update/Remove Location
          </button>
          <button
            onClick={() => openThanaModal("/thana/analytics-overview")}
            className={quickActionClass}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => openThanaModal("/thana/transfer-history")}
            className={quickActionClass}
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
                  <th className="text-left p-3">Criminal ID</th>
                  <th className="text-left p-3">Photo</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Gender</th>
                  <th className="text-left p-3">Age</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Risk</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {criminals.map((c) => (
                  <tr
                    key={c.criminal_id}
                    className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => setSelectedCriminal(c)}
                  >
                    <td className="p-3 font-mono text-xs">{c.criminal_id}</td>
                    <td className="p-3">
                      {c.image_url ? (
                        <button
                          type="button"
                          className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-red-400 via-amber-300 to-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCriminalImage({
                              src: c.image_url,
                              name: c.full_name || c.criminal_id || "Criminal",
                            });
                          }}
                          aria-label="Expand criminal photo"
                        >
                          <img
                            src={c.image_url}
                            alt={c.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-slate-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium">{c.full_name}</td>
                    <td className="p-3 text-xs capitalize">{c.gender || "—"}</td>
                    <td className="p-3 text-xs">{c.age ?? "—"}</td>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          openThanaModal(`/thana/update-criminal/${c.criminal_id}`);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {criminals.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
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
                  <th className="text-left p-3">Photo</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Badge</th>
                  <th className="text-left p-3">NID</th>
                  <th className="text-left p-3">Age</th>
                  <th className="text-left p-3">Rank</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((o) => (
                  <tr
                    key={o.officer_id}
                    className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => setSelectedOfficer(o)}
                  >
                    <td className="p-3 font-mono text-xs">{o.officer_id}</td>
                    <td className="p-3">
                      {o.image_url ? (
                        <button
                          type="button"
                          className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedOfficerImage({
                              src: o.image_url,
                              name: o.full_name || o.officer_id || "Officer",
                            });
                          }}
                          aria-label="Expand officer photo"
                        >
                          <img
                            src={o.image_url}
                            alt={o.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-slate-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="p-3">{o.full_name}</td>
                    <td className="p-3 font-mono text-xs">{o.badge_no}</td>
                    <td className="p-3 font-mono text-xs">{o.nid_number || "—"}</td>
                    <td className="p-3 text-xs">{o.age ?? "—"}</td>
                    <td className="p-3">{o.rank_code}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openThanaModal(`/thana/update-officer/${o.officer_id}`);
                        }}
                        className="text-blue-400 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {officers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
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
          <div className="space-y-3">
            <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
              <label className="text-xs text-slate-500 uppercase block mb-2">Sort by case type</label>
              <select
                value={caseTypeSort}
                onChange={(e) => setCaseTypeSort(e.target.value)}
                className="w-full max-w-xs bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">Default order</option>
                <option value="asc">Type A-Z</option>
                <option value="desc">Type Z-A</option>
              </select>
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">Case ID</th>
                  <th className="text-left p-3">Case Title</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Criminal</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Registered</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCases.map((c) => (
                  <tr
                    key={c.case_id}
                    className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => setSelectedCaseFile(c)}
                  >
                    <td className="p-3 font-mono text-xs">{c.case_id}</td>
                    <td className="p-3">{c.case_title || "Untitled Case"}</td>
                    <td className="p-3">{c.case_type}</td>
                    <td className="p-3">{c.criminal_name || c.criminal_id}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-400">
                      {c.filed_at ? new Date(c.filed_at).toLocaleString() : "—"}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openThanaModal(`/thana/update-case-file/${c.case_id}`);
                        }}
                        className="text-blue-400 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {sortedCases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500">
                      No case files found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* GD Reports Tab */}
        {activeTab === "gd" && (
          <div className="space-y-3">
            <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
              <label className="text-xs text-slate-500 uppercase block mb-2">Sort by GD type</label>
              <select
                value={gdTypeSort}
                onChange={(e) => setGdTypeSort(e.target.value)}
                className="w-full max-w-xs bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">Default order</option>
                <option value="asc">Type A-Z</option>
                <option value="desc">Type Z-A</option>
              </select>
            </div>

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
                {sortedGdReports.map((g) => (
                  <tr key={g.gd_id} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedGDReport(g)}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          openThanaModal(`/thana/gd/manage/${g.gd_id}`);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {sortedGdReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No GD reports
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                        onClick={() => openThanaModal(`/thana/update-organization/${o.org_id}`)}
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
                        onClick={() => openThanaModal(`/thana/update-location/${l.location_id}`)}
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

      </main>

      {selectedCaseFile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedCaseFile(null)}
        >
          <div
            className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Case Details</p>
                <h3 className="text-xl font-bold text-slate-100 mt-1">
                  {selectedCaseFile.case_title || "Untitled Case"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCaseFile(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <CaseInfo label="Case ID" value={selectedCaseFile.case_id} mono />
              <CaseInfo label="Case Type" value={selectedCaseFile.case_type} />
              <CaseInfo label="Status" value={selectedCaseFile.status} />
              <CaseInfo
                label="Registered At"
                value={selectedCaseFile.filed_at ? new Date(selectedCaseFile.filed_at).toLocaleString() : "—"}
              />
              <CaseInfo label="Criminal" value={selectedCaseFile.criminal_name || "—"} />
              <CaseInfo label="Criminal ID" value={selectedCaseFile.criminal_id} mono />
              <CaseInfo label="Thana ID" value={selectedCaseFile.thana_id || thanaId} mono />
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

      {selectedGDReport && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedGDReport(null)}
        >
          <div
            className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">GD Details</p>
                <h3 className="text-xl font-bold text-slate-100 mt-1">GD #{selectedGDReport.gd_id}</h3>
              </div>
              <button
                onClick={() => setSelectedGDReport(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <Info label="GD ID" value={selectedGDReport.gd_id} mono />
              <Info label="Type" value={selectedGDReport.gd_type?.replace("_", " ")} />
              <Info label="Status" value={selectedGDReport.status} />
              <Info
                label="Submitted At"
                value={selectedGDReport.submitted_at ? new Date(selectedGDReport.submitted_at).toLocaleString() : "—"}
              />
              <Info label="Thana ID" value={selectedGDReport.thana_id || "—"} mono />
              <Info label="Assigned Officer" value={selectedGDReport.assigned_officer_id || "—"} mono />
              <Info label="Approved By" value={selectedGDReport.approved_by_officer_id || "—"} mono />
              <Info label="Incident Location" value={selectedGDReport.incident_location || "—"} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Description</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap">
                {selectedGDReport.description || "No description provided."}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOfficer && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedOfficer(null)}
        >
          <div
            className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-600">
                  {selectedOfficer.image_url ? (
                    <button
                      type="button"
                      className="w-full h-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedOfficerImage({
                          src: selectedOfficer.image_url,
                          name: selectedOfficer.full_name || selectedOfficer.officer_id || "Officer",
                        });
                      }}
                      aria-label="Expand officer photo"
                    >
                      <img
                        src={selectedOfficer.image_url}
                        alt={selectedOfficer.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </button>
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[11px] text-slate-400">
                      N/A
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Officer Profile</p>
                  <h3 className="text-xl font-bold text-slate-100 mt-1">
                    {selectedOfficer.full_name || "Unknown Officer"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedOfficer(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <CaseInfo label="Officer ID" value={selectedOfficer.officer_id} mono />
              <CaseInfo label="Badge No" value={selectedOfficer.badge_no} mono />
              <CaseInfo label="Rank" value={selectedOfficer.rank_code} />
              <CaseInfo label="Thana ID" value={selectedOfficer.thana_id || thanaId} mono />
              <CaseInfo label="Email" value={selectedOfficer.email} />
              <CaseInfo label="Phone" value={selectedOfficer.phone} />
              <CaseInfo label="NID" value={selectedOfficer.nid_number} mono />
              <CaseInfo label="Age" value={selectedOfficer.age ?? "—"} />
              <CaseInfo label="Birth Date" value={selectedOfficer.birth_date ? new Date(selectedOfficer.birth_date).toLocaleDateString() : "—"} />
              <CaseInfo label="Gender" value={selectedOfficer.gender} />
              <CaseInfo label="Father's Name" value={selectedOfficer.father_name} />
              <CaseInfo label="Mother's Name" value={selectedOfficer.mother_name} />
            </div>
          </div>
        </div>
      )}

      {selectedCriminal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedCriminal(null)}
        >
          <div
            className="w-full max-w-4xl bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-red-400 via-amber-300 to-red-600">
                  {(selectedCriminal.image_url || selectedCriminalProfile?.image_url) ? (
                    <button
                      type="button"
                      className="w-full h-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCriminalImage({
                          src: selectedCriminal.image_url || selectedCriminalProfile?.image_url,
                          name: selectedCriminal.full_name || selectedCriminal.criminal_id || "Criminal",
                        });
                      }}
                      aria-label="Expand criminal photo"
                    >
                      <img
                        src={selectedCriminal.image_url || selectedCriminalProfile?.image_url}
                        alt={selectedCriminal.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </button>
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[11px] text-slate-400">
                      N/A
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Criminal Profile</p>
                  <h3 className="text-xl font-bold text-slate-100 mt-1">
                    {selectedCriminal.full_name || "Unknown Criminal"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCriminal(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Close
              </button>
            </div>

            {(isLoadingCriminalProfile || isLoadingCriminalTimeline || isLoadingCriminalCaseHistory) && (
              <p className="text-sm text-slate-400 mb-4">Loading full legal history...</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <CaseInfo label="Criminal ID" value={selectedCriminal.criminal_id} mono />
              <CaseInfo label="NID" value={selectedCriminal.nid} mono />
              <CaseInfo label="Gender" value={selectedCriminal.gender} />
              <CaseInfo label="Age" value={selectedCriminal.age ?? selectedCriminalProfile?.age ?? "—"} />
              <CaseInfo label="Birth Date" value={selectedCriminal.birth_date ? new Date(selectedCriminal.birth_date).toLocaleDateString() : "—"} />
              <CaseInfo label="Father's Name" value={selectedCriminal.father_name} />
              <CaseInfo label="Mother's Name" value={selectedCriminal.mother_name} />
              <CaseInfo label="Aliases" value={selectedCriminal.aliases} />
              <CaseInfo label="Nationality" value={selectedCriminal.nationality} />
              <CaseInfo label="Status" value={selectedCriminal.status} />
              <CaseInfo label="Risk Level" value={selectedCriminal.risk_level != null ? `${selectedCriminal.risk_level}/10` : "—"} />
              <CaseInfo label="Registered Thana" value={selectedCriminalProfile?.registered_thana || selectedCriminal.registered_thana_id || thanaId} />
              <CaseInfo label="Open Cases" value={selectedCriminalProfile?.open_cases ?? "—"} />
              <CaseInfo label="Closed Cases" value={selectedCriminalProfile?.closed_cases ?? "—"} />
              <CaseInfo label="Total Arrests" value={selectedCriminalProfile?.total_arrests ?? "—"} />
              <CaseInfo label="Organizations" value={selectedCriminalProfile?.organizations || "None"} />
              <CaseInfo label="Current Address" value={selectedCriminal.current_address} />
              <CaseInfo label="Permanent Address" value={selectedCriminal.permanent_address} />
              <CaseInfo label="Identifying Marks" value={selectedCriminal.identifying_marks} />
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
                        <p className="text-xs text-slate-500">
                          {item.event_date ? new Date(item.event_date).toLocaleString() : "—"}
                        </p>
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
                          setSelectedCriminal(null);
                          setSelectedCaseFile({
                            case_id: caseItem.case_id,
                            case_title: caseItem.case_title,
                            case_type: caseItem.case_type,
                            status: caseItem.status,
                            filed_at: caseItem.filed_at,
                            description: caseItem.description,
                            criminal_id: selectedCriminal?.criminal_id,
                            criminal_name: selectedCriminal?.full_name,
                            thana_id: caseItem.thana_id,
                            thana_name: caseItem.thana_name,
                          });
                        }}
                      >
                        <p className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                          Case #{caseItem.case_id}: {caseItem.case_title || "Untitled Case"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Type: {caseItem.case_type || "—"} | Status: {caseItem.status || "—"} | Registered: {caseItem.filed_at ? new Date(caseItem.filed_at).toLocaleString() : "—"}
                        </p>
                        {caseItem.last_status_change_at && (
                          <p className="text-xs text-amber-300 mt-1">
                            Last Status Update: {new Date(caseItem.last_status_change_at).toLocaleString()}
                          </p>
                        )}
                        {Array.isArray(caseItem.status_history) && caseItem.status_history.length > 0 && (
                          <ul className="mt-2 pl-4 list-disc text-xs text-slate-300 space-y-1">
                            {caseItem.status_history.map((h, idx) => (
                              <li key={`${caseItem.case_id}-status-${idx}`}>
                                {h?.from_status || "unknown"} → {h?.to_status || "unknown"}
                                {h?.changed_at ? ` (${new Date(h.changed_at).toLocaleString()})` : ""}
                              </li>
                            ))}
                          </ul>
                        )}
                        {caseItem.description && (
                          <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{caseItem.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {expandedCriminalImage?.src && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          onClick={() => setExpandedCriminalImage(null)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={expandedCriminalImage.src}
              alt={expandedCriminalImage.name || "Criminal"}
              className="w-full max-h-[85vh] object-contain rounded-xl border border-white/10"
            />
            <button
              type="button"
              onClick={() => setExpandedCriminalImage(null)}
              className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-slate-200"
            >
              Close image
            </button>
          </div>
        </div>
      )}

      {expandedOfficerImage?.src && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          onClick={() => setExpandedOfficerImage(null)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={expandedOfficerImage.src}
              alt={expandedOfficerImage.name || "Officer"}
              className="w-full max-h-[85vh] object-contain rounded-xl border border-white/10"
            />
            <button
              type="button"
              onClick={() => setExpandedOfficerImage(null)}
              className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-slate-200"
            >
              Close image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CaseInfo({ label, value, mono = false }) {
  return (
    <div className="bg-gray-800/70 border border-white/5 rounded-lg p-3">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-slate-200 ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</p>
    </div>
  );
}

export default ThanaDashboard;
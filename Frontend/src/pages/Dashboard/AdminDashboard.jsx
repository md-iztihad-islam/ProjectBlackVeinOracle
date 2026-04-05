import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminSignoutApi } from "@/services/authServices/signoutApi";
import {
  getAllThanas,
  getAllOfficers,
  getAllCriminals,
  getCriminalFullProfile,
  getCriminalTimeline,
  getCriminalCaseHistory,
  getAllRanks,
  getAllJails,
  getAllUsers,
  getAllGDReports,
  getAllCaseFiles,
  getDashboardOverview,
  addThana,
  addJail,
  addRank,
  addHeadOfficer as _addHeadOfficer,
  deleteThana,
} from "@/services/Admin/adminApi";
import {
  getAllCriminalOrganizationLinks,
  getAllCriminalRelations,
  getAllLocations,
  getAllOrganizations,
} from "@/services/Thana/thanaApi";
import {
  getCriminalRanking,
  getDistrictCrimeStats,
  getOfficerWorkload,
  getThanaPerformance,
  getAdminJailDetails,
} from "@/services/Analytics/analyticsApi";
import { getUnreadNotificationCount } from "@/services/Notification/notificationApi";
import userStore from "@/state/userStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearUser, user } = userStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState("criminal");
  const [showAddThana, setShowAddThana] = useState(false);
  const [showAddJail, setShowAddJail] = useState(false);
  const [showAddRank, setShowAddRank] = useState(false);
  const [selectedCaseFile, setSelectedCaseFile] = useState(null);
  const [selectedCaseDistrict, setSelectedCaseDistrict] = useState("");
  const [selectedCaseThanaId, setSelectedCaseThanaId] = useState("");
  const [selectedOfficerDistrict, setSelectedOfficerDistrict] = useState("");
  const [selectedOfficerThanaId, setSelectedOfficerThanaId] = useState("");
  const [selectedCriminalDistrict, setSelectedCriminalDistrict] = useState("");
  const [selectedCriminalThanaId, setSelectedCriminalThanaId] = useState("");
  const [selectedThanaDistrict, setSelectedThanaDistrict] = useState("");
  const [selectedJailDistrict, setSelectedJailDistrict] = useState("");
  const [selectedGdDistrict, setSelectedGdDistrict] = useState("");
  const [selectedGdThanaId, setSelectedGdThanaId] = useState("");
  const [gdTypeSort, setGdTypeSort] = useState("none");
  const [caseTypeSort, setCaseTypeSort] = useState("none");
  const [thanaSearch, setThanaSearch] = useState("");
  const [officerSearch, setOfficerSearch] = useState("");
  const [criminalSearch, setCriminalSearch] = useState("");
  const [jailSearch, setJailSearch] = useState("");
  const [selectedGDReport, setSelectedGDReport] = useState(null);
  const [selectedOfficerProfile, setSelectedOfficerProfile] = useState(null);
  const [selectedCriminalProfile, setSelectedCriminalProfile] = useState(null);
  const [expandedOfficerImage, setExpandedOfficerImage] = useState(null);
  const [expandedCriminalImage, setExpandedCriminalImage] = useState(null);
  const [selectedJailId, setSelectedJailId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [thanaForm, setThanaForm] = useState({
    thana_name: "",
    district: "",
    zone: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });
  const [rankForm, setRankForm] = useState({
    rank_code: "",
    rank_name: "",
    level: "",
  });
  const [jailForm, setJailForm] = useState({
    jail_name: "",
    district: "",
    zone: "",
    address: "",
    capacity: "",
    email: "",
    password: "",
  });

  const handleSignout = async () => {
    await adminSignoutApi();
    clearUser();
    navigate("/");
  };

  const openAdminModal = (path) => {
    navigate(path, {
      state: {
        modal: true,
        backgroundLocation: location,
      },
    });
  };

  useEffect(() => {
    const id = user?.admin_id || user?.thana_id || user?.officer_id || user?.jail_id || user?.user_id;

    if (String(id).startsWith("ADM")) return;
    if (String(id).startsWith("JAL")) {
      navigate("/jail/dashboard", { replace: true });
      return;
    }
    if (String(id).startsWith("THN")) {
      navigate("/thana/dashboard", { replace: true });
      return;
    }
    if (String(id).startsWith("OFC")) {
      navigate("/officer/dashboard", { replace: true });
      return;
    }
    if (String(id).startsWith("USR")) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [navigate, user]);

  // Queries — live data from backend
  const { data: thanasData } = useQuery({
    queryKey: ["allThanas"],
    queryFn: getAllThanas,
  });
  const { data: officersData } = useQuery({
    queryKey: ["allOfficers"],
    queryFn: getAllOfficers,
  });
  const { data: criminalsData } = useQuery({
    queryKey: ["allCriminals"],
    queryFn: getAllCriminals,
  });
  const { data: ranksData } = useQuery({
    queryKey: ["allRanks"],
    queryFn: getAllRanks,
  });
  const { data: jailsData } = useQuery({
    queryKey: ["allJails"],
    queryFn: getAllJails,
  });
  const { data: usersData } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });
  const { data: gdData } = useQuery({
    queryKey: ["allGDReports"],
    queryFn: getAllGDReports,
  });
  const { data: allCaseFilesData } = useQuery({
    queryKey: ["adminAllCaseFiles"],
    queryFn: getAllCaseFiles,
  });
  const { data: organizationsData } = useQuery({
    queryKey: ["allOrganizations"],
    queryFn: getAllOrganizations,
  });
  const { data: locationsData } = useQuery({
    queryKey: ["allLocations"],
    queryFn: getAllLocations,
  });
  const { data: criminalOrgLinksData } = useQuery({
    queryKey: ["allCriminalOrgLinks"],
    queryFn: getAllCriminalOrganizationLinks,
  });
  const { data: criminalRelationsData } = useQuery({
    queryKey: ["allCriminalRelations"],
    queryFn: getAllCriminalRelations,
  });
  const { data: _overviewData } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: getDashboardOverview,
  });
  const { data: _districtStatsData } = useQuery({
    queryKey: ["admin-district-stats"],
    queryFn: getDistrictCrimeStats,
  });
  const { data: _officerWorkloadData } = useQuery({
    queryKey: ["admin-officer-workload"],
    queryFn: getOfficerWorkload,
  });
  const { data: _criminalRankingData } = useQuery({
    queryKey: ["admin-criminal-ranking"],
    queryFn: getCriminalRanking,
  });
  const { data: _thanaPerformanceData } = useQuery({
    queryKey: ["admin-thana-performance"],
    queryFn: getThanaPerformance,
  });
  const { data: unreadNotificationData } = useQuery({
    queryKey: ["admin-unread-notification-count"],
    queryFn: getUnreadNotificationCount,
  });
  const selectedCriminalId = selectedCriminalProfile?.criminal_id || "";
  const { data: selectedCriminalFullProfileData, isLoading: isLoadingCriminalProfile } = useQuery({
    queryKey: ["admin-criminal-profile", selectedCriminalId],
    queryFn: () => getCriminalFullProfile(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });
  const { data: selectedCriminalTimelineData, isLoading: isLoadingCriminalTimeline } = useQuery({
    queryKey: ["admin-criminal-timeline", selectedCriminalId],
    queryFn: () => getCriminalTimeline(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });
  const { data: selectedCriminalCaseHistoryData, isLoading: isLoadingCriminalCaseHistory } = useQuery({
    queryKey: ["admin-criminal-case-history", selectedCriminalId],
    queryFn: () => getCriminalCaseHistory(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const { data: selectedJailDetailsData, isLoading: selectedJailDetailsLoading } = useQuery({
    queryKey: ["admin-jail-details-inline", selectedJailId],
    queryFn: () => getAdminJailDetails(selectedJailId),
    enabled: Boolean(selectedJailId),
  });

  const thanas = thanasData?.data || [];
  const officers = officersData?.data || [];
  const criminals = criminalsData?.data || [];
  const ranks = ranksData?.data || [];
  const jails = jailsData?.data || [];
  const users = usersData?.data || [];
  const gdReports = gdData?.data || [];
  const allCaseFiles = allCaseFilesData?.data || [];
  const organizations = organizationsData?.data || [];
  const locations = locationsData?.data || [];
  const criminalOrgLinks = criminalOrgLinksData?.data || [];
  const criminalRelations = criminalRelationsData?.data || [];
  const unreadNotificationCount = Number(
    unreadNotificationData?.data?.unread_count || 0,
  );
  const selectedCriminalFullProfile = selectedCriminalFullProfileData?.data || null;
  const selectedCriminalTimeline = selectedCriminalTimelineData?.data || [];
  const selectedCriminalCaseHistory = selectedCriminalCaseHistoryData?.data || [];

  const openCriminalProfileById = (criminalId) => {
    if (!criminalId) return;
    const fromList = criminals.find((c) => c.criminal_id === criminalId);
    setSelectedCriminalProfile(fromList || { criminal_id: criminalId });
  };

  // Mutations
  const addThanaMut = useMutation({
    mutationFn: (d) => addThana(d),
    onSuccess: (r) => {
      if (r.success) {
        queryClient.invalidateQueries(["allThanas"]);
        setShowAddThana(false);
        setThanaForm({
          thana_name: "",
          district: "",
          zone: "",
          address: "",
          phone: "",
          email: "",
          password: "",
        });
      } else {
        alert(r.message);
      }
    },
  });
  const addRankMut = useMutation({
    mutationFn: (d) => addRank(d),
    onSuccess: (r) => {
      if (r.success) {
        queryClient.invalidateQueries(["allRanks"]);
        setShowAddRank(false);
        setRankForm({ rank_code: "", rank_name: "", level: "" });
      } else {
        alert(r.message);
      }
    },
  });
  const addJailMut = useMutation({
    mutationFn: (d) => addJail(d),
    onSuccess: (r) => {
      if (r.success) {
        queryClient.invalidateQueries(["allJails"]);
        setShowAddJail(false);
        setJailForm({
          jail_name: "",
          district: "",
          zone: "",
          address: "",
          capacity: "",
          email: "",
          password: "",
        });
      } else {
        alert(r.message || "Failed to add jail");
      }
    },
  });
  const deleteThanaMut = useMutation({
    mutationFn: (id) => deleteThana(id),
    onSuccess: () => queryClient.invalidateQueries(["allThanas"]),
  });

  const statusColor = (s) => {
    const c = {
      active: "text-green-400 bg-green-500/10",
      in_custody: "text-red-400 bg-red-500/10",
      on_bail: "text-yellow-400 bg-yellow-500/10",
      wanted: "text-orange-400 bg-orange-500/10",
      escaped: "text-rose-400 bg-rose-500/10",
      released: "text-blue-400 bg-blue-500/10",
      unknown: "text-gray-400 bg-gray-500/10",
      assigned: "text-yellow-400 bg-yellow-500/10",
      approved: "text-green-400 bg-green-500/10",
      rejected: "text-red-400 bg-red-500/10",
      submitted: "text-blue-400 bg-blue-500/10",
    };
    return c[s] || "text-gray-400 bg-gray-500/10";
  };

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500/50";
  const btnCls =
    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200";

  const renderTable = (rows, columns, emptyText = "No data found") => (
    <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
            {columns.map((c) => (
              <th key={c.key} className="text-left p-3">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-6 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                {columns.map((c) => (
                  <td key={c.key} className="p-3 text-slate-200">
                    {row?.[c.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "thanas", label: `Thanas (${thanas.length})` },
    { id: "officers", label: `Officers (${officers.length})` },
    { id: "criminals", label: `Criminals (${criminals.length})` },
    { id: "jails", label: `Jails (${jails.length})` },
    { id: "organizations", label: `Organizations (${organizations.length})` },
    { id: "locations", label: `Locations (${locations.length})` },
    { id: "criminal-relations", label: `Relations (${criminalRelations.length})` },
    { id: "criminal-org-links", label: `Org Links (${criminalOrgLinks.length})` },
    { id: "ranks", label: `Ranks (${ranks.length})` },
    { id: "users", label: `Users (${users.length})` },
    { id: "gd-reports", label: `GD Reports (${gdReports.length})` },
    { id: "case-files-by-thana", label: "Case Files By Thana" },
    { id: "analytics", label: "Analytics" },
  ];

  const districtOptions = [...new Set(thanas.map((t) => t?.district).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b))
  );

  const thanaById = thanas.reduce((acc, t) => {
    if (t?.thana_id) {
      acc[t.thana_id] = t;
    }
    return acc;
  }, {});

  const thanaOptionsByDistrict = thanas.filter(
    (t) => t?.thana_id && (!selectedCaseDistrict || t.district === selectedCaseDistrict)
  );

  const thanaOptionsByOfficerDistrict = thanas.filter(
    (t) => t?.thana_id && (!selectedOfficerDistrict || t.district === selectedOfficerDistrict)
  );

  const thanaOptionsByCriminalDistrict = thanas.filter(
    (t) => t?.thana_id && (!selectedCriminalDistrict || t.district === selectedCriminalDistrict)
  );

  const criminalsForSelectedThana = criminals
    .filter((c) => selectedCriminalThanaId && c?.registered_thana_id === selectedCriminalThanaId)
    .filter((c) => {
      const q = criminalSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        String(c.full_name || "").toLowerCase().includes(q) ||
        String(c.criminal_id || "").toLowerCase().includes(q)
      );
    })
    .map((c) => ({
      ...c,
      registered_thana_name: thanaById[c.registered_thana_id]?.thana_name || c.thana_name || "—",
      district: thanaById[c.registered_thana_id]?.district || "—",
    }));

  const officersForSelectedThana = officers
    .filter((o) => selectedOfficerThanaId && o?.thana_id === selectedOfficerThanaId)
    .filter((o) => {
      const q = officerSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        String(o.full_name || "").toLowerCase().includes(q) ||
        String(o.officer_id || "").toLowerCase().includes(q)
      );
    })
    .map((o) => ({
      ...o,
      thana_name: thanaById[o.thana_id]?.thana_name || "—",
      district: thanaById[o.thana_id]?.district || "—",
      zone: thanaById[o.thana_id]?.zone || "—",
    }));

  const jailsByDistrict = jails
    .filter((j) => !selectedJailDistrict || j?.district === selectedJailDistrict)
    .filter((j) => {
      const q = jailSearch.trim().toLowerCase();
      if (!selectedJailDistrict) return true;
      if (!q) return true;
      return (
        String(j.jail_name || "").toLowerCase().includes(q) ||
        String(j.jail_id || "").toLowerCase().includes(q)
      );
    });

  const thanasBySelectedDistrict = thanas
    .filter((t) => !selectedThanaDistrict || t?.district === selectedThanaDistrict)
    .filter((t) => {
      const q = thanaSearch.trim().toLowerCase();
      if (!selectedThanaDistrict) return true;
      if (!q) return true;
      return (
        String(t.thana_name || "").toLowerCase().includes(q) ||
        String(t.thana_id || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => String(a?.thana_name || "").localeCompare(String(b?.thana_name || "")));

  const thanaOptionsByGdDistrict = thanas.filter(
    (t) => t?.thana_id && (!selectedGdDistrict || t.district === selectedGdDistrict)
  );

  const gdReportsForSelectedThana = gdReports
    .filter((g) => selectedGdThanaId && g?.thana_id === selectedGdThanaId)
    .map((g) => ({
      ...g,
      thana_name: thanaById[g.thana_id]?.thana_name || g.thana_name || g.thana_id,
      district: thanaById[g.thana_id]?.district || "—",
    }))
    .sort((a, b) => {
      if (gdTypeSort === "none") return 0;
      const av = String(a?.gd_type || "").toLowerCase();
      const bv = String(b?.gd_type || "").toLowerCase();
      return gdTypeSort === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const selectedJailDetails = selectedJailDetailsData?.data || null;

  const thanaSuggestions = thanasBySelectedDistrict.slice(0, 12).map((t) => t.thana_name).filter(Boolean);
  const officerSuggestions = officersForSelectedThana.slice(0, 12).map((o) => o.full_name).filter(Boolean);
  const criminalSuggestions = criminalsForSelectedThana.slice(0, 12).map((c) => c.full_name).filter(Boolean);
  const jailSuggestions = jailsByDistrict.slice(0, 12).map((j) => j.jail_name).filter(Boolean);

  const caseFilesForSelectedThana = allCaseFiles
    .filter((c) => c?.thana_id && c.thana_id === selectedCaseThanaId)
    .sort((a, b) => {
      if (caseTypeSort === "none") return 0;
      const av = String(a?.case_type || "").toLowerCase();
      const bv = String(b?.case_type || "").toLowerCase();
      return caseTypeSort === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200">
      {/* Header */}
      <header className="border-b border-white/5 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-sm">
              BV
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 font-mono">
                BLACK VEIN ORACLE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAdminModal("/admin/dashboard/notifications")}
              className="relative w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-lg transition-all flex items-center justify-center"
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
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm rounded-lg transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-gray-900 border border-white/5 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                if (t.id === "analytics") {
                  openAdminModal("/admin/dashboard/analytics");
                  return;
                }
                setActiveTab(t.id);
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === t.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Thanas", val: thanas.length, color: "text-blue-400" },
              {
                label: "Officers",
                val: officers.length,
                color: "text-green-400",
              },
              {
                label: "Criminals",
                val: criminals.length,
                color: "text-red-400",
              },
              { label: "Jails", val: jails.length, color: "text-purple-400" },
              { label: "Ranks", val: ranks.length, color: "text-cyan-400" },
              { label: "Users", val: users.length, color: "text-amber-400" },
              {
                label: "Organizations",
                val: organizations.length,
                color: "text-fuchsia-400",
              },
              {
                label: "Locations",
                val: locations.length,
                color: "text-teal-400",
              },
              {
                label: "GD Reports",
                val: gdReports.length,
                color: "text-emerald-400",
              },
              {
                label: "In Custody",
                val: criminals.filter((c) => c.status === "in_custody").length,
                color: "text-orange-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-gray-900 border border-white/5 rounded-xl p-4"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  {s.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Thanas */}
        {activeTab === "thanas" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Police Stations</h2>
              <button
                onClick={() => setShowAddThana(!showAddThana)}
                className={`${btnCls} bg-blue-600 hover:bg-blue-500 text-white`}
              >
                + Add Thana
              </button>
            </div>

            {showAddThana && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addThanaMut.mutate(thanaForm);
                }}
                className="bg-gray-900 border border-white/5 rounded-xl p-5 grid grid-cols-2 gap-3"
              >
                <input
                  placeholder="Thana Name"
                  value={thanaForm.thana_name}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, thana_name: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="District"
                  value={thanaForm.district}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, district: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Zone"
                  value={thanaForm.zone}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, zone: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Address"
                  value={thanaForm.address}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, address: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Phone"
                  value={thanaForm.phone}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, phone: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={thanaForm.email}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, email: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={thanaForm.password}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, password: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <div className="col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={addThanaMut.isPending}
                    className={`${btnCls} bg-green-600 hover:bg-green-500 text-white`}
                  >
                    {addThanaMut.isPending ? "Adding..." : "Add Thana"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddThana(false)}
                    className={`${btnCls} bg-gray-700 text-slate-300`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
              <label className="text-xs text-slate-500 uppercase block mb-2">District</label>
              <select
                value={selectedThanaDistrict}
                onChange={(e) => setSelectedThanaDistrict(e.target.value)}
                className={`${inputCls} max-w-md`}
              >
                <option value="">All districts</option>
                {districtOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {selectedThanaDistrict && (
                <div className="mt-3">
                  <label className="text-xs text-slate-500 uppercase block mb-2">Search thana</label>
                  <input
                    value={thanaSearch}
                    onChange={(e) => setThanaSearch(e.target.value)}
                    placeholder="Type thana name..."
                    list="admin-thana-search-suggestions"
                    className={`${inputCls} max-w-md`}
                  />
                  <datalist id="admin-thana-search-suggestions">
                    {thanaSuggestions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">District</th>
                    <th className="text-left p-3">Zone</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {thanasBySelectedDistrict.map((t) => (
                    <tr
                      key={t.thana_id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="p-3 font-mono text-xs">{t.thana_id}</td>
                      <td className="p-3 font-medium">{t.thana_name}</td>
                      <td className="p-3 text-slate-400">{t.district}</td>
                      <td className="p-3 text-slate-400">{t.zone}</td>
                      <td className="p-3 text-slate-400">{t.phone}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm("Delete this thana?"))
                              deleteThanaMut.mutate(t.thana_id);
                          }}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {thanasBySelectedDistrict.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        No thanas found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Officers */}
        {activeTab === "officers" && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 uppercase block mb-2">District</label>
                <select
                  value={selectedOfficerDistrict}
                  onChange={(e) => {
                    setSelectedOfficerDistrict(e.target.value);
                    setSelectedOfficerThanaId("");
                  }}
                  className={inputCls}
                >
                  <option value="">Select district</option>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase block mb-2">Thana</label>
                <select
                  value={selectedOfficerThanaId}
                  onChange={(e) => setSelectedOfficerThanaId(e.target.value)}
                  className={inputCls}
                  disabled={!selectedOfficerDistrict}
                >
                  <option value="">Select thana</option>
                  {thanaOptionsByOfficerDistrict.map((t) => (
                    <option key={t.thana_id} value={t.thana_id}>
                      {t.thana_name} ({t.thana_id})
                    </option>
                  ))}
                </select>
              </div>
              {selectedOfficerThanaId && (
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-500 uppercase block mb-2">Search officer (selected thana)</label>
                  <input
                    value={officerSearch}
                    onChange={(e) => setOfficerSearch(e.target.value)}
                    placeholder="Type officer name or ID..."
                    list="admin-officer-search-suggestions"
                    className={inputCls}
                  />
                  <datalist id="admin-officer-search-suggestions">
                    {officerSuggestions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">Officer ID</th>
                    <th className="text-left p-3">Photo</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Badge</th>
                    <th className="text-left p-3">Rank</th>
                    <th className="text-left p-3">Thana</th>
                    <th className="text-left p-3">District</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedOfficerThanaId ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500">
                        Select district and thana to view officers.
                      </td>
                    </tr>
                  ) : officersForSelectedThana.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500">
                        No officers found under selected thana.
                      </td>
                    </tr>
                  ) : (
                    officersForSelectedThana.map((o) => (
                      <tr
                        key={o.officer_id}
                        className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                        onClick={() => setSelectedOfficerProfile(o)}
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
                        <td className="p-3 font-medium">{o.full_name}</td>
                        <td className="p-3 text-slate-400 font-mono text-xs">{o.badge_no}</td>
                        <td className="p-3 text-slate-400">{o.rank_code}</td>
                        <td className="p-3 text-slate-400">{o.thana_name}</td>
                        <td className="p-3 text-slate-400">{o.district}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Criminals */}
        {activeTab === "criminals" && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 uppercase block mb-2">District</label>
                <select
                  value={selectedCriminalDistrict}
                  onChange={(e) => {
                    setSelectedCriminalDistrict(e.target.value);
                    setSelectedCriminalThanaId("");
                  }}
                  className={inputCls}
                >
                  <option value="">Select district</option>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase block mb-2">Thana</label>
                <select
                  value={selectedCriminalThanaId}
                  onChange={(e) => setSelectedCriminalThanaId(e.target.value)}
                  className={inputCls}
                  disabled={!selectedCriminalDistrict}
                >
                  <option value="">Select thana</option>
                  {thanaOptionsByCriminalDistrict.map((t) => (
                    <option key={t.thana_id} value={t.thana_id}>
                      {t.thana_name} ({t.thana_id})
                    </option>
                  ))}
                </select>
              </div>
              {selectedCriminalThanaId && (
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-500 uppercase block mb-2">Search criminal (selected thana)</label>
                  <input
                    value={criminalSearch}
                    onChange={(e) => setCriminalSearch(e.target.value)}
                    placeholder="Type criminal name or ID..."
                    list="admin-criminal-search-suggestions"
                    className={inputCls}
                  />
                  <datalist id="admin-criminal-search-suggestions">
                    {criminalSuggestions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Photo</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Gender</th>
                    <th className="text-left p-3">Age</th>
                    <th className="text-left p-3">NID</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Risk</th>
                    <th className="text-left p-3">Thana</th>
                    <th className="text-left p-3">District</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedCriminalThanaId ? (
                    <tr>
                      <td colSpan={10} className="p-6 text-center text-slate-500">
                        Select district and thana to view criminals.
                      </td>
                    </tr>
                  ) : criminalsForSelectedThana.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-6 text-center text-slate-500">
                        No criminals found under selected thana.
                      </td>
                    </tr>
                  ) : (
                    criminalsForSelectedThana.map((c) => (
                      <tr
                        key={c.criminal_id}
                        className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                        onClick={() => setSelectedCriminalProfile(c)}
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
                        <td className="p-3 text-slate-400 text-xs capitalize">{c.gender || "—"}</td>
                        <td className="p-3 text-slate-400">{c.age ?? "—"}</td>
                        <td className="p-3 text-slate-400 font-mono text-xs">{c.nid}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{c.risk_level}/10</td>
                        <td className="p-3 text-slate-400">{c.registered_thana_name}</td>
                        <td className="p-3 text-slate-400">{c.district}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Jails */}
        {activeTab === "jails" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Jails</h2>
              <button
                onClick={() => setShowAddJail(!showAddJail)}
                className={`${btnCls} bg-blue-600 hover:bg-blue-500 text-white`}
              >
                + Add Jail
              </button>
            </div>

            {showAddJail && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addJailMut.mutate({
                    ...jailForm,
                    capacity: Number(jailForm.capacity || 0),
                  });
                }}
                className="bg-gray-900 border border-white/5 rounded-xl p-5 grid grid-cols-2 gap-3"
              >
                <input
                  placeholder="Jail Name"
                  value={jailForm.jail_name}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, jail_name: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="District"
                  value={jailForm.district}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, district: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Zone"
                  value={jailForm.zone}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, zone: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Address"
                  value={jailForm.address}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, address: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Capacity"
                  type="number"
                  min="1"
                  value={jailForm.capacity}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, capacity: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={jailForm.email}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, email: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={jailForm.password}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, password: e.target.value })
                  }
                  className={`${inputCls} col-span-2`}
                  required
                />
                <div className="col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={addJailMut.isPending}
                    className={`${btnCls} bg-green-600 hover:bg-green-500 text-white`}
                  >
                    {addJailMut.isPending ? "Adding..." : "Add Jail"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddJail(false)}
                    className={`${btnCls} bg-gray-700 text-slate-300`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
              <label className="text-xs text-slate-500 uppercase block mb-2">District</label>
              <select
                value={selectedJailDistrict}
                onChange={(e) => setSelectedJailDistrict(e.target.value)}
                className={`${inputCls} max-w-md`}
              >
                <option value="">All districts</option>
                {districtOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {selectedJailDistrict && (
                <div className="mt-3">
                  <label className="text-xs text-slate-500 uppercase block mb-2">Search jail</label>
                  <input
                    value={jailSearch}
                    onChange={(e) => setJailSearch(e.target.value)}
                    placeholder="Type jail name..."
                    list="admin-jail-search-suggestions"
                    className={`${inputCls} max-w-md`}
                  />
                  <datalist id="admin-jail-search-suggestions">
                    {jailSuggestions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">District</th>
                    <th className="text-left p-3">Zone</th>
                    <th className="text-left p-3">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {jailsByDistrict.map((j) => (
                    <tr
                      key={j.jail_id}
                      className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                      onClick={() => setSelectedJailId(j.jail_id)}
                    >
                      <td className="p-3 font-mono text-xs">{j.jail_id}</td>
                      <td className="p-3 font-medium">{j.jail_name}</td>
                      <td className="p-3 text-slate-400">{j.district}</td>
                      <td className="p-3 text-slate-400">{j.zone}</td>
                      <td className="p-3 font-mono">{j.capacity}</td>
                    </tr>
                  ))}
                  {jailsByDistrict.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No jails found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Organizations */}
        {activeTab === "organizations" &&
          renderTable(organizations, [
            { key: "org_id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "ideology", label: "Ideology" },
            { key: "threat_level", label: "Threat" },
          ])}

        {/* Locations */}
        {activeTab === "locations" &&
          renderTable(locations, [
            { key: "location_id", label: "ID" },
            { key: "district", label: "District" },
            { key: "zone", label: "Zone" },
            { key: "address", label: "Address" },
          ])}

        {/* Criminal Relations */}
        {activeTab === "criminal-relations" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">Relation ID</th>
                  <th className="text-left p-3">Criminal A ID</th>
                  <th className="text-left p-3">Criminal A Name</th>
                  <th className="text-left p-3">Criminal B ID</th>
                  <th className="text-left p-3">Criminal B Name</th>
                  <th className="text-left p-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {criminalRelations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">No data found</td>
                  </tr>
                ) : (
                  criminalRelations.map((r, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-3 text-slate-200">{r?.relation_id ?? "—"}</td>
                      <td className="p-3 text-slate-200">
                        <button onClick={() => openCriminalProfileById(r?.criminal_id_1)} className="text-blue-300 hover:text-blue-200 hover:underline font-mono text-xs">
                          {r?.criminal_id_1 ?? "—"}
                        </button>
                      </td>
                      <td className="p-3 text-slate-200">
                        <button onClick={() => openCriminalProfileById(r?.criminal_id_1)} className="text-blue-300 hover:text-blue-200 hover:underline text-left">
                          {r?.criminal_1_name ?? "—"}
                        </button>
                      </td>
                      <td className="p-3 text-slate-200">
                        <button onClick={() => openCriminalProfileById(r?.criminal_id_2)} className="text-blue-300 hover:text-blue-200 hover:underline font-mono text-xs">
                          {r?.criminal_id_2 ?? "—"}
                        </button>
                      </td>
                      <td className="p-3 text-slate-200">
                        <button onClick={() => openCriminalProfileById(r?.criminal_id_2)} className="text-blue-300 hover:text-blue-200 hover:underline text-left">
                          {r?.criminal_2_name ?? "—"}
                        </button>
                      </td>
                      <td className="p-3 text-slate-200">{r?.relation_type ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Criminal Organization Links */}
        {activeTab === "criminal-org-links" &&
          renderTable(criminalOrgLinks, [
            { key: "criminal_id", label: "Criminal ID" },
            { key: "criminal_name", label: "Criminal Name" },
            { key: "org_id", label: "Org ID" },
            { key: "organization_name", label: "Organization" },
            { key: "threat_level", label: "Threat" },
            { key: "role", label: "Role" },
          ])}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Analytics Hub</h2>
                  <p className="text-sm text-slate-400 mt-1">Open the criminal analytics modal or jump to the officer analytics view.</p>
                </div>
                <button
                  onClick={() => openAdminModal("/admin/dashboard/analytics")}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
                >
                  Open Criminal Analytics
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setActiveAnalyticsTab("criminal");
                    openAdminModal("/admin/dashboard/analytics");
                  }}
                  className={`rounded-xl border px-4 py-4 text-left transition-all ${activeAnalyticsTab === "criminal" ? "bg-blue-600/15 border-blue-400/30 text-blue-200" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] font-bold">Criminal</p>
                  <p className="text-sm text-slate-400 mt-1">Districts, crime types, peak years, wanted areas, rankings</p>
                </button>

                <button
                  onClick={() => {
                    setActiveAnalyticsTab("officer");
                    openAdminModal("/analytics/officer");
                  }}
                  className={`rounded-xl border px-4 py-4 text-left transition-all ${activeAnalyticsTab === "officer" ? "bg-blue-600/15 border-blue-400/30 text-blue-200" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] font-bold">Officer</p>
                  <p className="text-sm text-slate-400 mt-1">Uses the existing officer analytics layout</p>
                </button>

                <button
                  onClick={() => {
                    setActiveAnalyticsTab("thana");
                    openAdminModal("/analytics/thana");
                  }}
                  className={`rounded-xl border px-4 py-4 text-left transition-all ${activeAnalyticsTab === "thana" ? "bg-blue-600/15 border-blue-400/30 text-blue-200" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] font-bold">Thana</p>
                  <p className="text-sm text-slate-400 mt-1">Open thana analytics in modal</p>
                </button>

                <button
                  onClick={() => {
                    setActiveAnalyticsTab("jail");
                    openAdminModal("/analytics/jail");
                  }}
                  className={`rounded-xl border px-4 py-4 text-left transition-all ${activeAnalyticsTab === "jail" ? "bg-blue-600/15 border-blue-400/30 text-blue-200" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] font-bold">Jail</p>
                  <p className="text-sm text-slate-400 mt-1">Open jail analytics in modal</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Case Files By Thana */}
        {activeTab === "case-files-by-thana" && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 uppercase block mb-2">District</label>
                <select
                  value={selectedCaseDistrict}
                  onChange={(e) => {
                    setSelectedCaseDistrict(e.target.value);
                    setSelectedCaseThanaId("");
                  }}
                  className={inputCls}
                >
                  <option value="">Select district</option>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase block mb-2">Thana</label>
                <select
                  value={selectedCaseThanaId}
                  onChange={(e) => setSelectedCaseThanaId(e.target.value)}
                  className={inputCls}
                  disabled={!selectedCaseDistrict}
                >
                  <option value="">Select thana</option>
                  {thanaOptionsByDistrict.map((t) => (
                    <option key={t.thana_id} value={t.thana_id}>
                      {t.thana_name} ({t.thana_id})
                    </option>
                  ))}
                </select>
              </div>
              {selectedCaseDistrict && selectedCaseThanaId && (
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-500 uppercase block mb-2">Sort by case type</label>
                  <select
                    value={caseTypeSort}
                    onChange={(e) => setCaseTypeSort(e.target.value)}
                    className={`${inputCls} max-w-xs`}
                  >
                    <option value="none">Default order</option>
                    <option value="asc">Type A-Z</option>
                    <option value="desc">Type Z-A</option>
                  </select>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">Case ID</th>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Criminal</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedCaseThanaId ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        Select district and thana to view case files.
                      </td>
                    </tr>
                  ) : caseFilesForSelectedThana.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        No case files found under selected thana.
                      </td>
                    </tr>
                  ) : (
                    caseFilesForSelectedThana.map((c) => (
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
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-slate-400">
                          {c.filed_at ? new Date(c.filed_at).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ranks */}
        {activeTab === "ranks" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Police Ranks</h2>
              <button
                onClick={() => setShowAddRank(!showAddRank)}
                className={`${btnCls} bg-blue-600 hover:bg-blue-500 text-white`}
              >
                + Add Rank
              </button>
            </div>
            {showAddRank && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addRankMut.mutate({
                    ...rankForm,
                    level: Number(rankForm.level),
                  });
                }}
                className="bg-gray-900 border border-white/5 rounded-xl p-5 grid grid-cols-3 gap-3"
              >
                <input
                  placeholder="Rank Code (e.g. inspector)"
                  value={rankForm.rank_code}
                  onChange={(e) =>
                    setRankForm({ ...rankForm, rank_code: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Rank Name (e.g. Inspector)"
                  value={rankForm.rank_name}
                  onChange={(e) =>
                    setRankForm({ ...rankForm, rank_name: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Level (1-10)"
                  type="number"
                  value={rankForm.level}
                  onChange={(e) =>
                    setRankForm({ ...rankForm, level: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <div className="col-span-3 flex gap-2">
                  <button
                    type="submit"
                    className={`${btnCls} bg-green-600 hover:bg-green-500 text-white`}
                  >
                    Add Rank
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRank(false)}
                    className={`${btnCls} bg-gray-700 text-slate-300`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">Code</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((r) => (
                    <tr key={r.rank_code} className="border-b border-white/5">
                      <td className="p-3 font-mono">{r.rank_code}</td>
                      <td className="p-3">{r.rank_name}</td>
                      <td className="p-3">{r.level}</td>
                    </tr>
                  ))}
                  {ranks.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-6 text-center text-slate-500"
                      >
                        No ranks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedUser(u)}>
                    <td className="p-3 font-mono text-xs">{u.user_id}</td>
                    <td className="p-3">{u.full_name}</td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3 text-slate-400">{u.phone}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* GD Reports */}
        {activeTab === "gd-reports" && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 uppercase block mb-2">District</label>
                <select
                  value={selectedGdDistrict}
                  onChange={(e) => {
                    setSelectedGdDistrict(e.target.value);
                    setSelectedGdThanaId("");
                  }}
                  className={inputCls}
                >
                  <option value="">Select district</option>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase block mb-2">Thana</label>
                <select
                  value={selectedGdThanaId}
                  onChange={(e) => setSelectedGdThanaId(e.target.value)}
                  className={inputCls}
                  disabled={!selectedGdDistrict}
                >
                  <option value="">Select thana</option>
                  {thanaOptionsByGdDistrict.map((t) => (
                    <option key={t.thana_id} value={t.thana_id}>
                      {t.thana_name} ({t.thana_id})
                    </option>
                  ))}
                </select>
              </div>
              {selectedGdDistrict && selectedGdThanaId && (
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-500 uppercase block mb-2">Sort by GD type</label>
                  <select
                    value={gdTypeSort}
                    onChange={(e) => setGdTypeSort(e.target.value)}
                    className={`${inputCls} max-w-xs`}
                  >
                    <option value="none">Default order</option>
                    <option value="asc">Type A-Z</option>
                    <option value="desc">Type Z-A</option>
                  </select>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Thana</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Description</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedGdThanaId ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        Select district and thana to view GD reports.
                      </td>
                    </tr>
                  ) : gdReportsForSelectedThana.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        No GD reports found under selected thana.
                      </td>
                    </tr>
                  ) : (
                    gdReportsForSelectedThana.map((g) => (
                      <tr
                        key={g.gd_id}
                        className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                        onClick={() => setSelectedGDReport(g)}
                      >
                        <td className="p-3 font-mono text-xs">{g.gd_id}</td>
                        <td className="p-3">{g.thana_name || g.thana_id}</td>
                        <td className="p-3 text-xs capitalize">
                          {g.gd_type?.replace("_", " ") || "—"}
                        </td>
                        <td className="p-3 text-slate-400 truncate max-w-xs">
                          {g.description}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(g.status)}`}>
                            {g.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-xs">
                          {g.submitted_at
                            ? new Date(g.submitted_at).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
              <Info label="Case ID" value={selectedCaseFile.case_id} mono />
              <Info label="Case Type" value={selectedCaseFile.case_type} />
              <Info label="Status" value={selectedCaseFile.status} />
              <Info
                label="Registered At"
                value={selectedCaseFile.filed_at ? new Date(selectedCaseFile.filed_at).toLocaleString() : "—"}
              />
              <Info label="Criminal" value={selectedCaseFile.criminal_name || "—"} />
              <Info label="Criminal ID" value={selectedCaseFile.criminal_id} mono />
              <Info label="Thana" value={selectedCaseFile.thana_name || "—"} />
              <Info label="Thana ID" value={selectedCaseFile.thana_id || "—"} mono />
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
              <Info label="Thana" value={selectedGDReport.thana_name || selectedGDReport.thana_id || "—"} />
              <Info label="Thana ID" value={selectedGDReport.thana_id || "—"} mono />
              <Info label="District" value={selectedGDReport.district || "—"} />
              <Info label="Incident Location" value={selectedGDReport.incident_location || "—"} />
              <Info label="Assigned Officer" value={selectedGDReport.assigned_officer_id || "—"} mono />
              <Info label="Approved By" value={selectedGDReport.approved_by_officer_id || "—"} mono />
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

      {selectedJailId && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedJailId("")}
        >
          <div
            className="w-full max-w-3xl bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Jail Details</p>
                <h3 className="text-xl font-bold text-slate-100 mt-1">
                  {selectedJailDetails?.jail?.jail_name || selectedJailId}
                </h3>
              </div>
              <button onClick={() => setSelectedJailId("")} className="text-slate-400 hover:text-slate-200 text-sm">
                Close
              </button>
            </div>

            {selectedJailDetailsLoading ? (
              <p className="text-sm text-slate-400">Loading jail details...</p>
            ) : !selectedJailDetails?.jail ? (
              <p className="text-sm text-slate-400">No details found.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <Info label="Jail ID" value={selectedJailDetails.jail.jail_id} mono />
                  <Info label="District" value={selectedJailDetails.jail.district} />
                  <Info label="Zone" value={selectedJailDetails.jail.zone} />
                  <Info label="Address" value={selectedJailDetails.jail.address} />
                  <Info label="Capacity" value={selectedJailDetails.jail.capacity} />
                  <Info label="Email" value={selectedJailDetails.jail.email} />
                  <Info label="Total Blocks" value={selectedJailDetails.summary?.total_blocks ?? 0} />
                  <Info label="Total Cells" value={selectedJailDetails.summary?.total_cells ?? 0} />
                  <Info label="Total Criminals" value={selectedJailDetails.summary?.total_criminals ?? 0} />
                  <Info label="Cell Capacity" value={selectedJailDetails.summary?.total_cell_capacity ?? 0} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Active Criminal List</p>
                  <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden max-h-72 overflow-y-auto">
                    {(selectedJailDetails.criminals || []).length === 0 ? (
                      <p className="p-4 text-sm text-slate-400">No active criminals in this jail.</p>
                    ) : (
                      <ul className="divide-y divide-white/5">
                        {selectedJailDetails.criminals.map((c) => (
                          <li key={c.incarceration_id} className="p-3 text-sm text-slate-200">
                            {c.full_name} <span className="text-slate-400">({c.criminal_id})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">User Details</p>
                <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedUser.full_name || "Unknown User"}</h3>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-200 text-sm">
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="User ID" value={selectedUser.user_id} mono />
              <Info label="NID" value={selectedUser.nid_number} mono />
              <Info label="Email" value={selectedUser.email} />
              <Info label="Phone" value={selectedUser.phone} />
              <Info label="Gender" value={selectedUser.gender} />
              <Info label="Birth Date" value={selectedUser.birth_date ? new Date(selectedUser.birth_date).toLocaleDateString() : "—"} />
              <Info label="Address" value={selectedUser.address} />
            </div>
          </div>
        </div>
      )}

      {selectedOfficerProfile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedOfficerProfile(null)}
        >
          <div
            className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-600">
                  {selectedOfficerProfile.image_url ? (
                    <button
                      type="button"
                      className="w-full h-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedOfficerImage({
                          src: selectedOfficerProfile.image_url,
                          name: selectedOfficerProfile.full_name || selectedOfficerProfile.officer_id || "Officer",
                        });
                      }}
                      aria-label="Expand officer photo"
                    >
                      <img
                        src={selectedOfficerProfile.image_url}
                        alt={selectedOfficerProfile.full_name}
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
                  <p className="text-xs uppercase tracking-widest text-slate-500">Officer Details</p>
                  <h3 className="text-xl font-bold text-slate-100 mt-1">
                    {selectedOfficerProfile.full_name || "Unknown Officer"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedOfficerProfile(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <Info label="Officer ID" value={selectedOfficerProfile.officer_id} mono />
              <Info label="Badge No" value={selectedOfficerProfile.badge_no} mono />
              <Info label="Rank" value={selectedOfficerProfile.rank_code} />
              <Info label="Thana" value={selectedOfficerProfile.thana_name || "—"} />
              <Info label="Thana ID" value={selectedOfficerProfile.thana_id || "—"} mono />
              <Info label="District" value={selectedOfficerProfile.district || "—"} />
              <Info label="Zone" value={selectedOfficerProfile.zone || "—"} />
              <Info label="Email" value={selectedOfficerProfile.email} />
              <Info label="Phone" value={selectedOfficerProfile.phone} />
              <Info label="NID" value={selectedOfficerProfile.nid_number} mono />
              <Info label="Age" value={selectedOfficerProfile.age ?? "—"} />
              <Info
                label="Birth Date"
                value={selectedOfficerProfile.birth_date ? new Date(selectedOfficerProfile.birth_date).toLocaleDateString() : "—"}
              />
              <Info label="Gender" value={selectedOfficerProfile.gender} />
              <Info label="Father's Name" value={selectedOfficerProfile.father_name} />
              <Info label="Mother's Name" value={selectedOfficerProfile.mother_name} />
            </div>
          </div>
        </div>
      )}

      {selectedCriminalProfile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedCriminalProfile(null)}
        >
          <div
            className="w-full max-w-4xl bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-red-400 via-amber-300 to-red-600">
                  {(selectedCriminalProfile.image_url || selectedCriminalFullProfile?.image_url) ? (
                    <button
                      type="button"
                      className="w-full h-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCriminalImage({
                          src: selectedCriminalProfile.image_url || selectedCriminalFullProfile?.image_url,
                          name: selectedCriminalProfile.full_name || selectedCriminalProfile.criminal_id || "Criminal",
                        });
                      }}
                      aria-label="Expand criminal photo"
                    >
                      <img
                        src={selectedCriminalProfile.image_url || selectedCriminalFullProfile?.image_url}
                        alt={selectedCriminalProfile.full_name}
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
                    {selectedCriminalProfile.full_name || "Unknown Criminal"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCriminalProfile(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Close
              </button>
            </div>

            {(isLoadingCriminalProfile || isLoadingCriminalTimeline || isLoadingCriminalCaseHistory) && (
              <p className="text-sm text-slate-400 mb-4">Loading full legal history...</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <Info label="Criminal ID" value={selectedCriminalProfile.criminal_id} mono />
              <Info label="NID" value={selectedCriminalProfile.nid} mono />
              <Info label="Gender" value={selectedCriminalProfile.gender} />
              <Info label="Age" value={selectedCriminalProfile.age ?? selectedCriminalFullProfile?.age ?? "—"} />
              <Info
                label="Birth Date"
                value={selectedCriminalProfile.birth_date ? new Date(selectedCriminalProfile.birth_date).toLocaleDateString() : "—"}
              />
              <Info label="Father's Name" value={selectedCriminalProfile.father_name} />
              <Info label="Mother's Name" value={selectedCriminalProfile.mother_name} />
              <Info label="Aliases" value={selectedCriminalProfile.aliases} />
              <Info label="Nationality" value={selectedCriminalProfile.nationality} />
              <Info label="Status" value={selectedCriminalProfile.status} />
              <Info
                label="Risk Level"
                value={selectedCriminalProfile.risk_level != null ? `${selectedCriminalProfile.risk_level}/10` : "—"}
              />
              <Info
                label="Registered Thana"
                value={selectedCriminalFullProfile?.registered_thana || selectedCriminalProfile.registered_thana_id || "—"}
              />
              <Info label="Open Cases" value={selectedCriminalFullProfile?.open_cases ?? "—"} />
              <Info label="Closed Cases" value={selectedCriminalFullProfile?.closed_cases ?? "—"} />
              <Info label="Total Arrests" value={selectedCriminalFullProfile?.total_arrests ?? "—"} />
              <Info label="Organizations" value={selectedCriminalFullProfile?.organizations || "None"} />
              <Info label="Current Address" value={selectedCriminalProfile.current_address} />
              <Info label="Permanent Address" value={selectedCriminalProfile.permanent_address} />
              <Info label="Identifying Marks" value={selectedCriminalProfile.identifying_marks} />
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
                          setSelectedCriminalProfile(null);
                          setSelectedCaseFile({
                            case_id: caseItem.case_id,
                            case_title: caseItem.case_title,
                            case_type: caseItem.case_type,
                            status: caseItem.status,
                            filed_at: caseItem.filed_at,
                            description: caseItem.description,
                            criminal_id: selectedCriminalProfile?.criminal_id,
                            criminal_name: selectedCriminalProfile?.full_name,
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

function Info({ label, value, mono = false }) {
  return (
    <div className="bg-gray-800/70 border border-white/5 rounded-lg p-3">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-slate-200 ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</p>
    </div>
  );
}

export default AdminDashboard;
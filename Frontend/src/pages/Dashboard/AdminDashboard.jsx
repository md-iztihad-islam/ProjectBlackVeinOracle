import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignoutApi } from "@/services/authServices/signoutApi";
import {
  getAllThanas,
  getAllOfficers,
  getAllCriminals,
  getAllRanks,
  getAllJails,
  getAllUsers,
  getAllGDReports,
  getDashboardOverview,
  addThana,
  addJail,
  addRank,
  addHeadOfficer as _addHeadOfficer,
  deleteThana,
} from "@/services/Admin/adminApi";
import {
  getAllCriminalLocations,
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
} from "@/services/Analytics/analyticsApi";
import { getUnreadNotificationCount } from "@/services/Notification/notificationApi";
import userStore from "@/state/userStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function AdminDashboard() {
  const navigate = useNavigate();
  const { clearUser, user } = userStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddThana, setShowAddThana] = useState(false);
  const [showAddJail, setShowAddJail] = useState(false);
  const [showAddRank, setShowAddRank] = useState(false);

  // Form states
  
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

  const id = user?.admin_id || user?.thana_id || user?.officer_id || user?.jail_id || user?.user_id;

  useEffect(() => {
    const id = user?.admin_id || user?.thana_id || user?.officer_id || user?.jail_id || user?.user_id;
    if (!id) return;

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

  const [thanaForm, setThanaForm] = useState({
    thana_name: "",
    district: "",
    zone: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    created_by_admin_id: id,
  });

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
  const { data: criminalLocationLinksData } = useQuery({
    queryKey: ["allCriminalLocationLinks"],
    queryFn: getAllCriminalLocations,
  });
  const { data: _overviewData } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: getDashboardOverview,
  });
  const { data: districtStatsData } = useQuery({
    queryKey: ["admin-district-stats"],
    queryFn: getDistrictCrimeStats,
  });
  const { data: officerWorkloadData } = useQuery({
    queryKey: ["admin-officer-workload"],
    queryFn: getOfficerWorkload,
  });
  const { data: criminalRankingData } = useQuery({
    queryKey: ["admin-criminal-ranking"],
    queryFn: getCriminalRanking,
  });
  const { data: thanaPerformanceData } = useQuery({
    queryKey: ["admin-thana-performance"],
    queryFn: getThanaPerformance,
  });
  const { data: unreadNotificationData } = useQuery({
    queryKey: ["admin-unread-notification-count"],
    queryFn: getUnreadNotificationCount,
  });

  const thanas = thanasData?.data || [];
  const officers = officersData?.data || [];
  const criminals = criminalsData?.data || [];
  const ranks = ranksData?.data || [];
  const jails = jailsData?.data || [];
  const users = usersData?.data || [];
  const gdReports = gdData?.data || [];
  const organizations = organizationsData?.data || [];
  const locations = locationsData?.data || [];
  const criminalOrgLinks = criminalOrgLinksData?.data || [];
  const criminalRelations = criminalRelationsData?.data || [];
  const criminalLocationLinks = criminalLocationLinksData?.data || [];
  const districtStats = districtStatsData?.data || [];
  const officerWorkload = officerWorkloadData?.data || [];
  const criminalRanking = criminalRankingData?.data || [];
  const thanaPerformance = thanaPerformanceData?.data || [];
  const unreadNotificationCount = Number(
    unreadNotificationData?.data?.unread_count || 0,
  );

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
          created_by_admin_id: "",
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
    { id: "criminal-location-links", label: `Location Links (${criminalLocationLinks.length})` },
    { id: "ranks", label: `Ranks (${ranks.length})` },
    { id: "users", label: `Users (${users.length})` },
    { id: "gd-reports", label: `GD Reports (${gdReports.length})` },
    { id: "analytics", label: "Analytics" },
  ];

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
              onClick={() => navigate("/admin/dashboard/notifications")}
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
              onClick={() => setActiveTab(t.id)}
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
                <input
                  placeholder="Admin ID (e.g. ADM-0000001)"
                  value={thanaForm.created_by_admin_id}
                  onChange={(e) =>
                    setThanaForm({
                      ...thanaForm,
                      created_by_admin_id: e.target.value,
                    })
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
                  {thanas.map((t) => (
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
                  {thanas.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-slate-500"
                      >
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
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Badge</th>
                  <th className="text-left p-3">Rank</th>
                  <th className="text-left p-3">Thana</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((o) => (
                  <tr
                    key={o.officer_id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="p-3 font-mono text-xs">{o.officer_id}</td>
                    <td className="p-3 font-medium">{o.full_name}</td>
                    <td className="p-3 text-slate-400 font-mono text-xs">
                      {o.badge_no}
                    </td>
                    <td className="p-3 text-slate-400">{o.rank_code}</td>
                    <td className="p-3 text-slate-400">{o.thana_id}</td>
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

        {/* Criminals */}
        {activeTab === "criminals" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">NID</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Risk</th>
                  <th className="text-left p-3">Thana</th>
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
                    <td className="p-3 text-slate-400 font-mono text-xs">
                      {c.nid}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{c.risk_level}/10</td>
                    <td className="p-3 text-slate-400">
                      {c.registered_thana_id}
                    </td>
                  </tr>
                ))}
                {criminals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No criminals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                  {jails.map((j) => (
                    <tr
                      key={j.jail_id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="p-3 font-mono text-xs">{j.jail_id}</td>
                      <td className="p-3 font-medium">{j.jail_name}</td>
                      <td className="p-3 text-slate-400">{j.district}</td>
                      <td className="p-3 text-slate-400">{j.zone}</td>
                      <td className="p-3 font-mono">{j.capacity}</td>
                    </tr>
                  ))}
                  {jails.length === 0 && (
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
        {activeTab === "criminal-relations" &&
          renderTable(criminalRelations, [
            { key: "relation_id", label: "Relation ID" },
            { key: "criminal_id_1", label: "Criminal A ID" },
            { key: "criminal_1_name", label: "Criminal A Name" },
            { key: "criminal_id_2", label: "Criminal B ID" },
            { key: "criminal_2_name", label: "Criminal B Name" },
            { key: "relation_type", label: "Type" },
          ])}

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

        {/* Criminal Location Links */}
        {activeTab === "criminal-location-links" &&
          renderTable(criminalLocationLinks, [
            { key: "criminal_location_id", label: "Link ID" },
            { key: "criminal_id", label: "Criminal ID" },
            { key: "criminal_name", label: "Criminal Name" },
            { key: "location_id", label: "Location ID" },
            { key: "district", label: "District" },
            { key: "zone", label: "Zone" },
            { key: "address", label: "Address" },
            { key: "noted_at", label: "Noted At" },
          ])}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold mb-2">District Crime Stats</h2>
              {renderTable(districtStats, [
                { key: "district", label: "District" },
                { key: "total_criminals", label: "Total Criminals" },
                { key: "high_risk_criminals", label: "High Risk" },
                { key: "total_cases", label: "Total Cases" },
                { key: "open_cases", label: "Open Cases" },
                { key: "total_arrests", label: "Arrests" },
                { key: "active_thanas", label: "Active Thanas" },
              ])}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Officer Workload</h2>
              {renderTable(officerWorkload, [
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

            <div>
              <h2 className="text-lg font-semibold mb-2">Criminal Ranking</h2>
              {renderTable(criminalRanking, [
                { key: "criminal_id", label: "Criminal ID" },
                { key: "full_name", label: "Name" },
                { key: "status", label: "Status" },
                { key: "arrest_count", label: "Arrests" },
                { key: "case_count", label: "Case Count" },
                { key: "overall_rank", label: "Overall Rank" },
                { key: "status_rank", label: "Status Rank" },
              ])}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Thana Performance</h2>
              {renderTable(thanaPerformance, [
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
              ])}
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
                  <tr key={u.user_id} className="border-b border-white/5">
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
                {gdReports.map((g) => (
                  <tr key={g.gd_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{g.gd_id}</td>
                    <td className="p-3">{g.thana_id}</td>
                    <td className="p-3 text-xs capitalize">
                      {g.gd_type?.replace("_", " ") || "—"}
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-xs">
                      {g.description}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(g.status)}`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {g.submitted_at
                        ? new Date(g.submitted_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
                {gdReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No GD reports found
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

export default AdminDashboard;
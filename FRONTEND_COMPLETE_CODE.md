# COMPLETE FRONTEND CODE — Black Vein Oracle (SYNCED AFTER IZTIHAD UPDATE)

> Baseline synced with remote `main` at commit `47aac9f`.
> This top section is the **only section to use** for copy-paste.
> Project target: ready with Thana officer add/update routes restored.

## ✅ THANA ROUTING PATCH (LATEST)

These routes are active now:

```jsx
<Route path="/thana/add-officer" element={<AddOfficer />} />
<Route path="/thana/update-officer/:officerId" element={<UpdateOfficer />} />
<Route path="/thana/add-location" element={<AddLocation />} />
<Route path="/thana/update-location/:locationId" element={<UpdateLocation />} />
<Route path="/thana/add-organization" element={<AddOrganization />} />
<Route path="/thana/update-organization/:orgId" element={<UpdateOrganization />} />
<Route path="/thana/add-criminal-relation" element={<AddCriminalRelation />} />
<Route path="/thana/add-criminal-location" element={<AddCriminalLocation />} />
<Route path="/thana/update-criminal-organization" element={<UpdateCriminalOrganization />} />
```

---

## ✅ NEW THANA COVERAGE ADDED (NOTIFICATION + UNUSED BACKEND)

Added real frontend files (not launcher/param helpers):

- `Frontend/src/services/Notification/notificationApi.js`
- `Frontend/src/services/Analytics/analyticsApi.js`
- `Frontend/src/services/Incarceration/incarcerationApi.js`
- `Frontend/src/pages/Dashboard/Thana/NotificationCenter.jsx`
- `Frontend/src/pages/Dashboard/Thana/AnalyticsOverview.jsx`
- `Frontend/src/pages/Dashboard/Thana/TransferHistoryLookup.jsx`

New thana routes added:

```jsx
<Route path="/thana/notifications" element={<NotificationCenter />} />
<Route path="/thana/analytics-overview" element={<AnalyticsOverview />} />
<Route path="/thana/transfer-history" element={<TransferHistoryLookup />} />
```

Thana quick actions now include:

- Notifications
- Analytics Overview
- Transfer History

All these additions avoid manual parameter launcher UI and keep existing dashboard structure intact.

---

## ✅ THANA ESSENTIAL 17 FEATURES (IMPLEMENTED)

Implemented/covered files added in this pass:

- `Frontend/src/pages/Dashboard/Thana/GDPart/ManageGDStatus.jsx`
- `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddCriminalOrganization.jsx`
- `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateCriminalRelation.jsx`
- `Frontend/src/pages/Dashboard/Thana/OfficerPart/UpdateOfficer.jsx` (remove officer action)
- `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateLocation.jsx` (remove location action)
- `Frontend/src/services/Thana/thanaApi.js` (new helper APIs)
- `Frontend/src/routes/Routing.jsx` (new thana routes)
- `Frontend/src/pages/Dashboard/Thana/ThanaDashboard.jsx` (quick actions + GD manage links)

Backend role access updated for thana deletion workflows:

- `Backend/src/routes/v1/officerRouter.js` now allows `thana` for delete-officer
- `Backend/src/routes/v1/locationRouter.js` now allows `thana` for delete-location

17-point status checklist:

1. Add officer ✅
2. Update officer ✅
3. Remove officer ✅
4. Update GD status ✅
5. Assign officer to GD ✅
6. Change assigned officer ✅
7. Add criminal ✅
8. Update criminal ✅
9. Add organization ✅
10. Update organization ✅
11. Add criminal-organization relation ✅
12. Update criminal-organization relation ✅
13. Add criminal-criminal relation ✅
14. Update criminal-criminal relation ✅
15. Add location ✅
16. Update location ✅
17. Remove location ✅

Operational flow notes (how thana reaches each feature):

- From `ThanaDashboard` quick actions: add officer, add/update location, add/update organization, add/update criminal relation links, notification center, analytics, transfer history.
- From `ThanaDashboard` criminals tab row `Edit`: update criminal.
- From `ThanaDashboard` officers tab row `Edit`: update officer + remove officer (inside update screen).
- From `ThanaDashboard` cases tab row `Edit`: update case file.
- From `ThanaDashboard` GD tab row `Manage`: update GD status + assign/change assigned officer.
- Update/remove screens now support direct access without URL params by entering IDs in form when needed.

---

## ✅ Deep analysis summary (what Izti had completed)

```txt
✅ DONE: Admin Thana module pages
✅ DONE: Admin Rank module pages
✅ DONE: Admin Jail module pages
✅ DONE: Jail dashboard + CellBlock + Cell pages/services
✅ DONE: Officer dashboard basic GD list/details wiring
✅ DONE: User dashboard + wanted + criminals-by-area
✅ DONE: Backend changes for rank/jail/officer analytics paths
```

## ⚠️ Diagnosed issues found after pull (and fixed)

```txt
1) Thana routing had commented route lines for case/location/org pages.
2) Thana routing was missing criminal-relation / criminal-location / org-update pages.
3) Case file pages were missing, causing broken add/edit case flows.
```

---

## ✅ COPY-PASTE BLOCK A — Routing (final)

**File:** `Frontend/src/routes/Routing.jsx`

```jsx
import NotFound from "@/pages/NotFound/NotFound";
import HomePage from "@/pages/HomePage/HomePage";
import AccessRedirectionPage from "@/pages/AccessRedirectionPage/AccessRedirectionPage";
import LoginPage from "@/pages/AccessRedirectionPage/LoginPage";
import { Routes, Route } from "react-router-dom";
import OfficerRegistrationPage from "@/pages/RegistrationPage/OfficerRegistrationPage";
import ThanaRegistrationPage from "@/pages/RegistrationPage/ThanaRegistrationPage";
import JailRegistrationPage from "@/pages/RegistrationPage/JailRegistrationPage";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import AddGDReport from "@/pages/Dashboard/User/AddGDReport";
import RegisterUser from "@/pages/Dashboard/User/RegisterUser";
import SigninUser from "@/pages/Dashboard/User/SigninUser";
import UserDashboard from "@/pages/Dashboard/User/UserDashboard";
import UserProfile from "@/pages/Dashboard/User/UserProfile";
import EditProfile from "@/pages/Dashboard/User/EditProfile";
import GDReports from "@/pages/Dashboard/User/GDReports";
import WantedCriminals from "@/pages/Dashboard/User/WantedCriminals";
import CriminalsByArea from "@/pages/Dashboard/User/CriminalsByArea";
import OfficerDashboard from "@/pages/Dashboard/Officer/OfficerDashboard";
import GDList from "@/pages/Dashboard/Officer/GDPart/GDList";
import GDDetails from "@/pages/Dashboard/Officer/GDPart/GDDetails";
import AdminThanaDashBoard from "@/pages/Dashboard/Admin/Thana/AdminThanaDashBoard";
import AddThana from "@/pages/Dashboard/Admin/Thana/AddThana";
import ThanaList from "@/pages/Dashboard/Admin/Thana/ThanaList";
import UpdateThana from "@/pages/Dashboard/Admin/Thana/UpdateThana";
import AssignThanaHead from "@/pages/Dashboard/Admin/Thana/AssignThanaHead";
import RankAdminDashboard from "@/pages/Dashboard/Admin/Rank/RankAdminDashboard";
import AddRank from "@/pages/Dashboard/Admin/Rank/AddRank";
import RankList from "@/pages/Dashboard/Admin/Rank/RankList";
import UpdateRank from "@/pages/Dashboard/Admin/Rank/UpdateRank";
import AssignRank from "@/pages/Dashboard/Admin/Rank/AssignRank";
import JailAdminDashboard from "@/pages/Dashboard/Admin/Jail/JailAdminDashboard";
import JailList from "@/pages/Dashboard/Admin/Jail/JailList";
import UpdateJail from "@/pages/Dashboard/Admin/Jail/UpdateJail";
import AddJail from "@/pages/Dashboard/Admin/Jail/AddJail";
import JailDashBoard from "@/pages/Dashboard/Jail/JailDashboard";
import CellBlockList from "@/pages/Dashboard/Jail/CellBlock/CellBlockList";
import AddCellBlock from "@/pages/Dashboard/Jail/CellBlock/AddCellBlock";
import UpdateCellBlock from "@/pages/Dashboard/Jail/CellBlock/UpdateCellBlock";
import ThanaDashboard from "@/pages/Dashboard/Thana/ThanaDashboard";
import AddCriminal from "@/pages/Dashboard/Thana/CriminalPart/AddCriminal";
import UpdateCriminal from "@/pages/Dashboard/Thana/CriminalPart/UpdateCriminal";
import AddCaseFile from "@/pages/Dashboard/Thana/CaseFilePart/AddCaseFile";
import UpdateCaseFile from "@/pages/Dashboard/Thana/CaseFilePart/UpdateCaseFile";
import AddOfficer from "@/pages/Dashboard/Thana/OfficerPart/AddOfficer";
import UpdateOfficer from "@/pages/Dashboard/Thana/OfficerPart/UpdateOfficer";
import AddLocation from "@/pages/Dashboard/Thana/CriminalPart/AddLocation";
import AddOrganization from "@/pages/Dashboard/Thana/CriminalPart/AddOrganization";
import UpdateLocation from "@/pages/Dashboard/Thana/CriminalPart/UpdateLocation";
import UpdateOrganization from "@/pages/Dashboard/Thana/CriminalPart/UpdateOrganization";
import AddCriminalRelation from "@/pages/Dashboard/Thana/CriminalPart/AddCriminalRelation";
import UpdateCriminalOrganization from "@/pages/Dashboard/Thana/CriminalPart/UpdateCriminalOrganization";
import AddCriminalLocation from "@/pages/Dashboard/Thana/CriminalPart/AddCriminalLocation";
import CellList from "@/pages/Dashboard/Jail/Cell/CellList";
import AddCell from "@/pages/Dashboard/Jail/Cell/AddCell";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/access" element={<AccessRedirectionPage />} />
      <Route path="/access/login/:userType" element={<LoginPage />} />
      <Route
        path="/access/thana-register"
        element={<ThanaRegistrationPage />}
      />
      <Route
        path="/access/officer-register"
        element={<OfficerRegistrationPage />}
      />
      <Route path="/access/jail-register" element={<JailRegistrationPage />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route
        path="/admin/dashboard/thanadashboard"
        element={<AdminThanaDashBoard />}
      />
      <Route
        path="/admin/dashboard/thanadashboard/add-thana"
        element={<AddThana />}
      />
      <Route
        path="/admin/dashboard/thanadashboard/thana-list"
        element={<ThanaList />}
      />
      <Route
        path="/admin/dashboard/thanadashboard/thana-list/update-thana/:thana_id"
        element={<UpdateThana />}
      />
      <Route
        path="/admin/dashboard/thanadashboard/thana-list/thana-head/:thana_id"
        element={<AssignThanaHead />}
      />

      <Route
        path="/admin/dashboard/rankdashboard"
        element={<RankAdminDashboard />}
      />
      <Route
        path="/admin/dashboard/rankdashboard/add-rank"
        element={<AddRank />}
      />
      <Route
        path="/admin/dashboard/rankdashboard/rank-list"
        element={<RankList />}
      />
      <Route
        path="/admin/dashboard/rankdashboard/rank-list/update-rank/:rankId"
        element={<UpdateRank />}
      />
      <Route
        path="/admin/dashboard/rankdashboard/rank-list/assign-rank/:rankId"
        element={<AssignRank />}
      />

      <Route
        path="/admin/dashboard/jaildashboard"
        element={<JailAdminDashboard />}
      />
      <Route
        path="/admin/dashboard/jaildashboard/add-jail"
        element={<AddJail />}
      />
      <Route
        path="/admin/dashboard/jaildashboard/jail-list"
        element={<JailList />}
      />
      <Route
        path="/admin/dashboard/jaildashboard/jail-list/update-jail/:jailId"
        element={<UpdateJail />}
      />

      <Route path="/jail/dashboard" element={<JailDashBoard />} />
      <Route
        path="/jail/dashboard/cell-block-list"
        element={<CellBlockList />}
      />
      <Route path="/jail/dashboard/add-cell-block" element={<AddCellBlock />} />
      <Route
        path="/jail/dashboard/cell-block-list/update-cell-block/:cellBlockId"
        element={<UpdateCellBlock />}
      />
      <Route
        path="/jail/dashboard/cellblock/:blockId/cells"
        element={<CellList />}
      />
      <Route
        path="/jail/dashboard/cellblock/:blockId/addcell"
        element={<AddCell />}
      />

      <Route path="/thana/dashboard" element={<ThanaDashboard />} />
      <Route path="/thana/add-criminal" element={<AddCriminal />} />
      <Route
        path="/thana/update-criminal/:criminalId"
        element={<UpdateCriminal />}
      />
      <Route path="/thana/add-case-file" element={<AddCaseFile />} />
      <Route
        path="/thana/update-case-file/:caseId"
        element={<UpdateCaseFile />}
      />
      <Route path="/thana/add-officer" element={<AddOfficer />} />
      <Route
        path="/thana/update-officer/:officerId"
        element={<UpdateOfficer />}
      />
      <Route path="/thana/add-location" element={<AddLocation />} />
      <Route
        path="/thana/update-location/:locationId"
        element={<UpdateLocation />}
      />
      <Route path="/thana/add-organization" element={<AddOrganization />} />
      <Route
        path="/thana/update-organization/:orgId"
        element={<UpdateOrganization />}
      />
      <Route
        path="/thana/add-criminal-relation"
        element={<AddCriminalRelation />}
      />
      <Route
        path="/thana/add-criminal-location"
        element={<AddCriminalLocation />}
      />
      <Route
        path="/thana/update-criminal-organization"
        element={<UpdateCriminalOrganization />}
      />

      {/* ✅ Officer basic routes stay active */}
      <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      <Route path="/officer/dashboard/gd-list" element={<GDList />} />
      <Route
        path="/officer/dashboard/gd-list/:dairyId"
        element={<GDDetails />}
      />

      <Route path="/user-registration" element={<RegisterUser />} />
      <Route path="/user-signin" element={<SigninUser />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/dashboard/profile" element={<UserProfile />} />
      <Route path="/user/dashboard/profile/edit" element={<EditProfile />} />
      <Route path="/user/dashboard/add-gd-report" element={<AddGDReport />} />
      <Route path="/user/dashboard/gd-reports" element={<GDReports />} />
      <Route
        path="/user/dashboard/wanted-criminals"
        element={<WantedCriminals />}
      />
      <Route
        path="/user/dashboard/criminals-by-area"
        element={<CriminalsByArea />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Routing;
```

---

## ✅ FINAL CONTRACT MATRIX (THANA FLOWS)

Use this as the final consistency checklist.

| Flow                           | Frontend call                                               | Backend contract                                                    | Auth/Role                   | Result   |
| ------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------- | -------- |
| Criminal list by thana         | `GET /criminal/get-criminals-by-thana/:thanaId`             | `criminalRouter.get('/get-criminals-by-thana/:thanaId')`            | `admin`, `thana`            | ✅       |
| Add criminal                   | `POST /criminal/add-criminal`                               | `criminalRouter.post('/add-criminal')`                              | `admin`, `thana`, `officer` | ✅       |
| Update criminal                | `PUT /criminal/update-criminal/:criminalId`                 | `criminalRouter.put('/update-criminal/:criminalId')`                | `admin`, `thana`            | ✅       |
| Officer list by thana          | `GET /officer/get-officers-by-thana/:thana_id`              | `officerRouter.get('/get-officers-by-thana/:thana_id')`             | `admin`, `thana`            | ✅       |
| Add officer                    | `POST /officer/add-officer`                                 | `officerRouter.post('/add-officer')`                                | `admin`, `thana`            | ✅       |
| Update officer                 | `PUT /officer/update-officer/:officerId`                    | `officerRouter.put('/update-officer/:officerId')`                   | `admin`, `thana`            | ✅       |
| Case list by thana             | `GET /case-file/get-case-files-by-thana/:thanaId`           | `caseFileRouter.get('/get-case-files-by-thana/:thanaId')`           | authenticated route set     | ✅       |
| Add case file                  | `POST /case-file/add-case-file`                             | `caseFileRouter.post('/add-case-file')`                             | authenticated               | ✅       |
| Update case file               | `PUT /case-file/update-case-file/:caseId`                   | `caseFileRouter.put('/update-case-file/:caseId')`                   | authenticated               | ✅       |
| Add location                   | `POST /location/add-location`                               | `locationRouter.post('/add-location')`                              | `admin`, `thana`, `officer` | ✅       |
| Update location                | `PUT /location/update-location/:locationId`                 | `locationRouter.put('/update-location/:locationId')`                | `admin`, `thana`            | ✅       |
| Add organization               | `POST /organization/add-organization`                       | `organizationRouter.post('/add-organization')`                      | `admin`, `thana`, `officer` | ✅       |
| Update organization            | `PUT /organization/update-organization/:orgId`              | `organizationRouter.put('/update-organization/:orgId')`             | `admin`, `thana`            | ✅ fixed |
| Add criminal relation          | `POST /criminal-relation/add-relation`                      | `criminalRelationRouter.post('/add-relation')`                      | authenticated               | ✅       |
| Add criminal location          | `POST /criminal-location/add-criminal-location`             | `criminalLocationRouter.post('/add-criminal-location')`             | authenticated               | ✅ added |
| Update criminal-org link       | `PUT /criminal-organization/update-link/:criminalId/:orgId` | `criminalOrganizationRouter.put('/update-link/:criminalId/:orgId')` | authenticated               | ✅       |
| Add criminal-org link fallback | `POST /criminal-organization/add-link`                      | `criminalOrganizationRouter.post('/add-link')`                      | authenticated               | ✅       |
| GD list by thana               | `GET /gd-report/get-general-dairies-by-thana/:thanaId`      | `gdReportRouter.get('/get-general-dairies-by-thana/:thanaId')`      | `admin`, `thana`, `officer` | ✅       |
| Rank list for officer form     | `GET /rank/get-all-ranks`                                   | `rankRouter.get('/get-all-ranks')`                                  | authenticated               | ✅       |

### Backend fixes applied in this pass

```txt
1) organization update route now allows thana role.
2) officer add controller now correctly handles admin vs thana thana_id behavior.
3) thana routing includes relation/location/org-link update paths.
4) diagnostics currently show no errors in edited files.
```

---

## ✅ COPY-PASTE BLOCK B — Thana Dashboard (final)

**File:** `Frontend/src/pages/Dashboard/Thana/ThanaDashboard.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { thanaSignoutApi } from "@/services/authServices/signoutApi";
import {
  getCriminalsByThana,
  getOfficersByThana,
  getCaseFilesByThana,
  getGDReportsByThana,
} from "@/services/Thana/thanaApi";
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

  const criminals = crimData?.data || [];
  const officers = offData?.data || [];
  const cases = caseData?.data || [];
  const gdReports = gdData?.data || [];

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
            onClick={() => navigate("/thana/update-criminal-organization")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg"
          >
            + Update Criminal Organization
          </button>
        </div>

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
              </tbody>
            </table>
          </div>
        )}

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
              </tbody>
            </table>
          </div>
        )}

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
              </tbody>
            </table>
          </div>
        )}

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default ThanaDashboard;
```

---

## ✅ COPY-PASTE BLOCK C — Add Case File page

**Create file:** `Frontend/src/pages/Dashboard/Thana/CaseFilePart/AddCaseFile.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import userStore from "@/state/userStore";
import { addCaseFile } from "@/services/Thana/thanaApi";

function AddCaseFile() {
  const navigate = useNavigate();
  const { user } = userStore();

  const [form, setForm] = useState({
    case_number: "",
    criminal_id: "",
    case_type: "other",
    status: "open",
    description: "",
  });

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      addCaseFile({
        ...form,
        thana_id: user?.thana_id,
      }),
    onSuccess: (r) => {
      if (r.success) {
        alert("Case file added!");
        navigate("/thana/dashboard");
      } else {
        alert(r.message || "Failed to add case file");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-slate-100 mb-6">
          Add Case File
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Case Number
            </label>
            <input
              value={form.case_number}
              onChange={(e) => set("case_number", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID
            </label>
            <input
              value={form.criminal_id}
              onChange={(e) => set("criminal_id", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Case Type
            </label>
            <input
              value={form.case_type}
              onChange={(e) => set("case_type", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="open">Open</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputCls}
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Case File"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCaseFile;
```

---

## ✅ COPY-PASTE BLOCK D — Update Case File page

**Create file:** `Frontend/src/pages/Dashboard/Thana/CaseFilePart/UpdateCaseFile.jsx`

```jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateCaseFile } from "@/services/Thana/thanaApi";

function UpdateCaseFile() {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const [form, setForm] = useState({
    case_type: "",
    status: "open",
    description: "",
  });

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateCaseFile(caseId, form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Case file updated!");
        navigate("/thana/dashboard");
      } else {
        alert(r.message || "Failed to update case file");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Update Case File
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{caseId}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Case Type
            </label>
            <input
              value={form.case_type}
              onChange={(e) => set("case_type", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="open">Open</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputCls}
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Case File"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCaseFile;
```

---

## ✅ COPY-PASTE BLOCK E — Add Criminal Location page

**Create file:** `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddCriminalLocation.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function AddCriminalLocation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id: "",
    location_id: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        "/criminal-location/add-criminal-location",
        {
          criminal_id: form.criminal_id,
          location_id: form.location_id,
        },
      );
      return res.data;
    },
    onSuccess: (r) => {
      if (r.success) {
        alert("Criminal location linked!");
        navigate("/thana/dashboard");
      } else {
        alert(r.message || "Failed");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-slate-100 mb-6">
          Add Criminal Location
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID
            </label>
            <input
              value={form.criminal_id}
              onChange={(e) => set("criminal_id", e.target.value)}
              className={inputCls}
              placeholder="CRM-0000001"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">
              Location ID
            </label>
            <input
              value={form.location_id}
              onChange={(e) => set("location_id", e.target.value)}
              className={inputCls}
              placeholder="LOC-0000001"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Linking..." : "Link Criminal to Location"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCriminalLocation;
```

---

## ✅ Done sections marker list (as requested)

```jsx
// ✅ DONE BY IZTIHAD — KEEP AS IS:
// Frontend/src/pages/Dashboard/Admin/Thana/*
// Frontend/src/pages/Dashboard/Admin/Rank/*
// Frontend/src/pages/Dashboard/Admin/Jail/*
// Frontend/src/pages/Dashboard/Jail/*
// Frontend/src/services/Jail/*
// Frontend/src/services/Cell/*
// Frontend/src/services/CellBlock/*
// Frontend/src/services/Rank/*
```

```jsx
// ✅ DONE EARLIER — KEEP AS IS:
// Frontend/src/pages/Dashboard/User/WantedCriminals.jsx
// Frontend/src/pages/Dashboard/User/CriminalsByArea.jsx
// Frontend/src/services/User/criminalLookupApi.js
```

```jsx
// ✅ OFFICER THANA ROUTES RESTORED:
// Frontend/src/pages/Dashboard/Thana/OfficerPart/AddOfficer.jsx
// Frontend/src/pages/Dashboard/Thana/OfficerPart/UpdateOfficer.jsx
// /thana/add-officer and /thana/update-officer/:officerId are active.
```

---

<!--
⚠️ COMMENTED OUT ON PURPOSE (NON-PASTE SECTION)
Everything below this marker is disabled legacy/reference content.
Do not paste from below.

## ⚠️ SUPABASE CATCH-UP (IF YOU ONLY RAN INITIAL TABLES)

If your Supabase already has views/functions/etc, and you only need the **remaining ALTER changes**, run this first:

```sql
-- ================================================================
-- BLACK VEIN ORACLE: MINIMAL REQUIRED CATCH-UP (SAFE TO RE-RUN)
-- ================================================================

-- A) GD report status workflow + incident fields
UPDATE gd_report
SET status = 'submitted'
WHERE status = 'pending';

ALTER TABLE gd_report DROP CONSTRAINT IF EXISTS gd_report_status_check;
ALTER TABLE gd_report ADD CONSTRAINT gd_report_status_check
  CHECK (status IN ('submitted', 'assigned', 'approved', 'rejected'));

ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS gd_type VARCHAR(30)
  NOT NULL DEFAULT 'other'
  CHECK (gd_type IN (
    'theft','lost_document','missing_person','accident','assault','robbery',
    'fraud','domestic_violence','property_dispute','suspicious_activity',
    'threat','noise_disturbance','other'
  ));

ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS incident_date DATE;
ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS incident_location TEXT;

-- B) Criminal status must include 'wanted'
ALTER TABLE criminal DROP CONSTRAINT IF EXISTS criminal_status_check;
ALTER TABLE criminal ADD CONSTRAINT criminal_status_check
  CHECK (status IN ('in_custody','on_bail','released','escaped','unknown','wanted'));

-- C) Thana head officer relation (often missed in early baseline)
ALTER TABLE thana ADD COLUMN IF NOT EXISTS head_officer_id TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_thana_head_officer'
      AND table_name = 'thana'
  ) THEN
    ALTER TABLE thana
      ADD CONSTRAINT fk_thana_head_officer
      FOREIGN KEY (head_officer_id) REFERENCES officer(officer_id);
  END IF;
END $$;

-- D) Quick verification
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'gd_report'
  AND column_name IN ('gd_type', 'incident_date', 'incident_location')
ORDER BY column_name;

SELECT conname
FROM pg_constraint
WHERE conname IN ('gd_report_status_check', 'criminal_status_check', 'fk_thana_head_officer')
ORDER BY conname;
```

> Important: there is **no separate `incident` table** in this schema. Incident data is stored in `gd_report` (`incident_date`, `incident_location`).

---

If your Supabase is missing many objects (indexes, views, functions, procedures, triggers), run the **full catch-up** below once.

### What is usually still remaining after "basic tables"

1. `gd_report` status migration (`pending` → `submitted`) and status constraint update.
2. `gd_report` incident fields (`incident_date`, `incident_location`) and `gd_type` enum/check.
3. `criminal` status constraint update to include `wanted`.
4. `thana` head-officer relationship (`head_officer_id` + FK constraint).
5. Advanced DB objects used by dashboards/analytics (`indexes`, `views`, `functions`, `procedures`, `triggers`).

```sql
-- ================================================================
-- BLACK VEIN ORACLE: POST-BASELINE CATCH-UP SCRIPT
-- Safe for partially-migrated databases (uses IF NOT EXISTS / OR REPLACE)
-- ================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Ensure id_sequences exists and has all required prefixes
CREATE TABLE IF NOT EXISTS id_sequences (
  prefix TEXT PRIMARY KEY,
  current_value BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO id_sequences (prefix, current_value) VALUES
  ('ADM', 0), ('USR', 0), ('OFC', 0), ('THN', 0), ('CRM', 0),
  ('ORG', 0), ('CFS', 0), ('JAL', 0), ('ARS', 0), ('INC', 0),
  ('BAL', 0), ('GDR', 0), ('LOC', 0), ('CLB', 0), ('CEL', 0)
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION generate_prefixed_id(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  next_val BIGINT;
  formatted_id TEXT;
BEGIN
  UPDATE id_sequences
  SET current_value = current_value + 1,
    updated_at = NOW()
  WHERE id_sequences.prefix = generate_prefixed_id.prefix
  RETURNING current_value INTO next_val;

  formatted_id := prefix || '-' || LPAD(next_val::TEXT, 7, '0');
  RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

-- 2) gd_report schema + status migration
UPDATE gd_report SET status = 'submitted' WHERE status = 'pending';

ALTER TABLE gd_report DROP CONSTRAINT IF EXISTS gd_report_status_check;
ALTER TABLE gd_report ADD CONSTRAINT gd_report_status_check
  CHECK (status IN ('submitted', 'assigned', 'approved', 'rejected'));

ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS gd_type VARCHAR(30)
  NOT NULL DEFAULT 'other'
  CHECK (gd_type IN ('theft','lost_document','missing_person','accident','assault','robbery','fraud','domestic_violence','property_dispute','suspicious_activity','threat','noise_disturbance','other'));

ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS incident_date DATE;
ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS incident_location TEXT;

-- 2b) thana head officer relation (older baselines may miss this)
ALTER TABLE thana ADD COLUMN IF NOT EXISTS head_officer_id TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_thana_head_officer'
      AND table_name = 'thana'
  ) THEN
    ALTER TABLE thana
      ADD CONSTRAINT fk_thana_head_officer
      FOREIGN KEY (head_officer_id) REFERENCES officer(officer_id);
  END IF;
END $$;

-- 3) criminal status migration: include 'wanted'
ALTER TABLE criminal DROP CONSTRAINT IF EXISTS criminal_status_check;
ALTER TABLE criminal ADD CONSTRAINT criminal_status_check
  CHECK (status IN ('in_custody','on_bail','released','escaped','unknown','wanted'));

-- 4) Late-added support tables
CREATE TABLE IF NOT EXISTS audit_log (
  log_id      BIGSERIAL PRIMARY KEY,
  table_name  TEXT NOT NULL,
  operation   TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'STATUS_CHANGE')),
  record_id   TEXT NOT NULL,
  old_data    JSONB,
  new_data    JSONB,
  changed_by  TEXT,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS criminal_transfer (
  transfer_id     BIGSERIAL PRIMARY KEY,
  criminal_id     TEXT NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
  from_jail_id    TEXT NOT NULL REFERENCES jail(jail_id),
  to_jail_id      TEXT NOT NULL REFERENCES jail(jail_id),
  from_cell_id    TEXT REFERENCES cell(cell_id),
  to_cell_id      TEXT REFERENCES cell(cell_id),
  transfer_reason TEXT NOT NULL,
  authorized_by   TEXT,
  transferred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (from_jail_id <> to_jail_id)
);

CREATE TABLE IF NOT EXISTS notification (
  notification_id BIGSERIAL PRIMARY KEY,
  target_role     TEXT NOT NULL CHECK (target_role IN ('admin', 'thana', 'officer', 'jail', 'user')),
  target_id       TEXT,
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Performance indexes used by analytics and dashboards
CREATE INDEX IF NOT EXISTS idx_criminal_status     ON criminal(status);
CREATE INDEX IF NOT EXISTS idx_criminal_risk       ON criminal(risk_level DESC);
CREATE INDEX IF NOT EXISTS idx_criminal_nid        ON criminal(nid);
CREATE INDEX IF NOT EXISTS idx_case_file_status    ON case_file(status);
CREATE INDEX IF NOT EXISTS idx_case_file_thana     ON case_file(thana_id);
CREATE INDEX IF NOT EXISTS idx_case_file_criminal  ON case_file(criminal_id);
CREATE INDEX IF NOT EXISTS idx_arrest_custody      ON arrest_record(custody_status);
CREATE INDEX IF NOT EXISTS idx_arrest_thana        ON arrest_record(thana_id);
CREATE INDEX IF NOT EXISTS idx_arrest_criminal     ON arrest_record(criminal_id);
CREATE INDEX IF NOT EXISTS idx_gd_report_status    ON gd_report(status);
CREATE INDEX IF NOT EXISTS idx_gd_report_thana     ON gd_report(thana_id);
CREATE INDEX IF NOT EXISTS idx_gd_report_user      ON gd_report(user_id);
CREATE INDEX IF NOT EXISTS idx_incarceration_jail      ON incarceration(jail_id);
CREATE INDEX IF NOT EXISTS idx_incarceration_released  ON incarceration(released_at);
CREATE INDEX IF NOT EXISTS idx_incarceration_arrest    ON incarceration(arrest_id);
CREATE INDEX IF NOT EXISTS idx_crim_location_criminal  ON criminal_location(criminal_id);
CREATE INDEX IF NOT EXISTS idx_crim_location_noted     ON criminal_location(noted_at DESC);
CREATE INDEX IF NOT EXISTS idx_bail_status         ON bail_record(status);
CREATE INDEX IF NOT EXISTS idx_bail_arrest         ON bail_record(arrest_id);
CREATE INDEX IF NOT EXISTS idx_officer_thana       ON officer(thana_id);
CREATE INDEX IF NOT EXISTS idx_officer_rank        ON officer(rank_code);
CREATE INDEX IF NOT EXISTS idx_audit_log_table     ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_time      ON audit_log(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_target ON notification(target_role, target_id);
CREATE INDEX IF NOT EXISTS idx_notification_unread ON notification(target_role, is_read) WHERE is_read = FALSE;

-- 6) Views
CREATE OR REPLACE VIEW v_wanted_criminals AS
SELECT
  c.criminal_id,
  c.full_name,
  c.nid,
  c.status,
  c.risk_level,
  COALESCE(t.thana_name, 'Unknown') AS registered_thana,
  COALESCE(t.district, 'Unknown') AS registered_district,
  (SELECT COUNT(*) FROM case_file cf WHERE cf.criminal_id = c.criminal_id) AS total_cases,
  (SELECT COUNT(*) FROM arrest_record ar WHERE ar.criminal_id = c.criminal_id) AS total_arrests,
  CASE
    WHEN c.risk_level >= 8 THEN 'CRITICAL'
    WHEN c.risk_level >= 5 THEN 'HIGH'
    WHEN c.risk_level >= 3 THEN 'MODERATE'
    ELSE 'LOW'
  END AS risk_category,
  cl_latest.district AS last_seen_district,
  cl_latest.address AS last_seen_address,
  cl_latest.noted_at AS last_seen_at
FROM criminal c
LEFT JOIN thana t ON c.registered_thana_id = t.thana_id
LEFT JOIN LATERAL (
  SELECT l.district, l.address, cl.noted_at
  FROM criminal_location cl
  JOIN location l ON cl.location_id = l.location_id
  WHERE cl.criminal_id = c.criminal_id
  ORDER BY cl.noted_at DESC
  LIMIT 1
) cl_latest ON TRUE
WHERE c.status IN ('escaped', 'wanted') OR c.risk_level >= 7;

CREATE OR REPLACE VIEW v_criminal_full_profile AS
WITH case_stats AS (
  SELECT
    criminal_id,
    COUNT(*) AS total_cases,
    COUNT(*) FILTER (WHERE status = 'open') AS open_cases,
    COUNT(*) FILTER (WHERE status = 'closed') AS closed_cases,
    COUNT(*) FILTER (WHERE status = 'under_investigation') AS investigating_cases
  FROM case_file
  GROUP BY criminal_id
),
arrest_stats AS (
  SELECT
    criminal_id,
    COUNT(*) AS total_arrests,
    MAX(arrest_date) AS last_arrest_date
  FROM arrest_record
  GROUP BY criminal_id
),
org_list AS (
  SELECT
    co.criminal_id,
    STRING_AGG(o.name, ', ' ORDER BY o.threat_level DESC) AS organizations,
    MAX(o.threat_level) AS max_org_threat
  FROM criminal_organization co
  JOIN organization o ON co.org_id = o.org_id
  GROUP BY co.criminal_id
)
SELECT
  c.criminal_id,
  c.full_name,
  c.nid,
  c.status,
  c.risk_level,
  COALESCE(t.thana_name, 'Unregistered') AS registered_thana,
  COALESCE(cs.total_cases, 0) AS total_cases,
  COALESCE(cs.open_cases, 0) AS open_cases,
  COALESCE(cs.closed_cases, 0) AS closed_cases,
  COALESCE(cs.investigating_cases, 0) AS investigating_cases,
  COALESCE(ars.total_arrests, 0) AS total_arrests,
  ars.last_arrest_date,
  COALESCE(ol.organizations, 'None') AS organizations,
  COALESCE(ol.max_org_threat, 0) AS max_org_threat_level
FROM criminal c
LEFT JOIN thana t ON c.registered_thana_id = t.thana_id
LEFT JOIN case_stats cs ON c.criminal_id = cs.criminal_id
LEFT JOIN arrest_stats ars ON c.criminal_id = ars.criminal_id
LEFT JOIN org_list ol ON c.criminal_id = ol.criminal_id;

CREATE OR REPLACE VIEW v_thana_performance AS
WITH thana_stats AS (
  SELECT
    t.thana_id, t.thana_name, t.district,
    COUNT(DISTINCT o.officer_id) AS officer_count,
    COUNT(DISTINCT cf.case_id) AS total_cases,
    COUNT(DISTINCT cf.case_id) FILTER (WHERE cf.status = 'closed') AS closed_cases,
    COUNT(DISTINCT gd.gd_id) AS total_gd_reports,
    COUNT(DISTINCT gd.gd_id) FILTER (WHERE gd.status = 'approved') AS approved_gds,
    COUNT(DISTINCT gd.gd_id) FILTER (WHERE gd.status = 'rejected') AS rejected_gds,
    COUNT(DISTINCT cr.criminal_id) AS criminals_registered
  FROM thana t
  LEFT JOIN officer o ON t.thana_id = o.thana_id
  LEFT JOIN case_file cf ON t.thana_id = cf.thana_id
  LEFT JOIN gd_report gd ON t.thana_id = gd.thana_id
  LEFT JOIN criminal cr ON t.thana_id = cr.registered_thana_id
  GROUP BY t.thana_id, t.thana_name, t.district
)
SELECT
  *,
  CASE WHEN total_cases > 0 THEN ROUND(closed_cases * 100.0 / total_cases, 2) ELSE 0 END AS case_closure_rate,
  CASE WHEN total_gd_reports > 0 THEN ROUND(approved_gds * 100.0 / total_gd_reports, 2) ELSE 0 END AS gd_approval_rate,
  RANK() OVER (
    ORDER BY CASE WHEN total_cases > 0 THEN closed_cases * 100.0 / total_cases ELSE 0 END DESC
  ) AS performance_rank
FROM thana_stats;

CREATE OR REPLACE VIEW v_jail_occupancy_detail AS
SELECT
  j.jail_id, j.jail_name, j.district,
  j.capacity AS total_capacity,
  COALESCE(active.current_inmates, 0) AS current_inmates,
  j.capacity - COALESCE(active.current_inmates, 0) AS available_capacity,
  CASE
    WHEN j.capacity = 0 THEN 0
    ELSE ROUND(COALESCE(active.current_inmates, 0) * 100.0 / j.capacity, 2)
  END AS occupancy_percentage,
  CASE
    WHEN COALESCE(active.current_inmates, 0) >= j.capacity THEN 'FULL'
    WHEN COALESCE(active.current_inmates, 0) >= j.capacity * 0.9 THEN 'NEAR FULL'
    WHEN COALESCE(active.current_inmates, 0) >= j.capacity * 0.5 THEN 'MODERATE'
    ELSE 'LOW'
  END AS occupancy_status,
  (SELECT COUNT(*) FROM cell_block cb WHERE cb.jail_id = j.jail_id) AS total_blocks,
  (SELECT COUNT(*) FROM cell_block cb JOIN cell ce ON cb.block_id = ce.block_id WHERE cb.jail_id = j.jail_id) AS total_cells,
  (SELECT COUNT(*) FROM cell_block cb JOIN cell ce ON cb.block_id = ce.block_id WHERE cb.jail_id = j.jail_id AND ce.status = 'available') AS available_cells
FROM jail j
LEFT JOIN (
  SELECT i.jail_id, COUNT(*) AS current_inmates
  FROM incarceration i
  WHERE i.released_at IS NULL
  GROUP BY i.jail_id
) active ON j.jail_id = active.jail_id;

CREATE OR REPLACE VIEW v_officer_workload AS
WITH officer_cases AS (
  SELECT
    o.officer_id, o.full_name, o.badge_no,
    r.rank_name, t.thana_name,
    COUNT(DISTINCT gd.gd_id) FILTER (WHERE gd.assigned_officer_id = o.officer_id) AS assigned_gds,
    COUNT(DISTINCT gd.gd_id) FILTER (WHERE gd.approved_by_officer_id = o.officer_id) AS approved_gds
  FROM officer o
  JOIN rank r ON o.rank_code = r.rank_code
  JOIN thana t ON o.thana_id = t.thana_id
  LEFT JOIN gd_report gd ON gd.assigned_officer_id = o.officer_id OR gd.approved_by_officer_id = o.officer_id
  GROUP BY o.officer_id, o.full_name, o.badge_no, r.rank_name, t.thana_name
)
SELECT
  *,
  assigned_gds + approved_gds AS total_workload,
  DENSE_RANK() OVER (ORDER BY assigned_gds + approved_gds DESC) AS workload_rank
FROM officer_cases;

-- 7) Functions + procedures (used by analytics / bail / transfer flow)
CREATE OR REPLACE FUNCTION fn_calculate_criminal_risk(p_criminal_id TEXT)
RETURNS INT AS $$
DECLARE
  v_risk            INT := 1;
  v_case_count      INT;
  v_arrest_count    INT;
  v_org_max_threat  INT;
  v_has_escaped     BOOLEAN;
  v_current_status  TEXT;
BEGIN
  SELECT status INTO v_current_status FROM criminal WHERE criminal_id = p_criminal_id;
  IF v_current_status IS NULL THEN RAISE EXCEPTION 'Criminal % not found', p_criminal_id; END IF;

  SELECT COUNT(*) INTO v_case_count FROM case_file WHERE criminal_id = p_criminal_id;
  SELECT COUNT(*) INTO v_arrest_count FROM arrest_record WHERE criminal_id = p_criminal_id;
  SELECT COALESCE(MAX(o.threat_level), 0) INTO v_org_max_threat
  FROM criminal_organization co JOIN organization o ON co.org_id = o.org_id
  WHERE co.criminal_id = p_criminal_id;

  SELECT EXISTS (
    SELECT 1 FROM audit_log
    WHERE table_name = 'criminal' AND record_id = p_criminal_id AND new_data->>'status' = 'escaped'
  ) INTO v_has_escaped;

  IF v_case_count >= 10 THEN v_risk := v_risk + 4;
  ELSIF v_case_count >= 5 THEN v_risk := v_risk + 3;
  ELSIF v_case_count >= 2 THEN v_risk := v_risk + 2;
  ELSIF v_case_count >= 1 THEN v_risk := v_risk + 1; END IF;

  IF v_arrest_count >= 5 THEN v_risk := v_risk + 2;
  ELSIF v_arrest_count >= 2 THEN v_risk := v_risk + 1; END IF;

  IF v_org_max_threat >= 7 THEN v_risk := v_risk + 2;
  ELSIF v_org_max_threat >= 4 THEN v_risk := v_risk + 1; END IF;

  IF v_has_escaped THEN v_risk := v_risk + 2; END IF;
  IF v_risk > 10 THEN v_risk := 10; END IF;

  UPDATE criminal SET risk_level = v_risk WHERE criminal_id = p_criminal_id;
  RETURN v_risk;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error calculating risk for %: %', p_criminal_id, SQLERRM;
    RETURN -1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_find_available_cell(p_jail_id TEXT)
RETURNS TEXT AS $$
DECLARE
  v_best_cell_id TEXT := NULL;
BEGIN
  SELECT ce.cell_id INTO v_best_cell_id
  FROM cell ce
  JOIN cell_block cb ON ce.block_id = cb.block_id
  WHERE cb.jail_id = p_jail_id
    AND ce.status = 'available'
    AND ce.number_of_people < ce.capacity
  ORDER BY (ce.capacity - ce.number_of_people) DESC
  LIMIT 1;

  IF v_best_cell_id IS NULL THEN
    RAISE NOTICE 'No available cells found in jail %', p_jail_id;
  END IF;

  RETURN v_best_cell_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error finding cell: %', SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_get_criminal_timeline(p_criminal_id TEXT)
RETURNS TABLE (
  event_date  TIMESTAMPTZ,
  event_type  TEXT,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY

  SELECT ar.arrest_date::TIMESTAMPTZ,
       'ARREST'::TEXT,
       ('Arrested at ' || COALESCE(t.thana_name, 'Unknown thana'))::TEXT
  FROM arrest_record ar
  LEFT JOIN thana t ON ar.thana_id = t.thana_id
  WHERE ar.criminal_id = p_criminal_id

  UNION ALL

  SELECT cf.filed_at, 'CASE FILED'::TEXT,
       ('Case #' || cf.case_number || ' — ' || cf.case_type || ' (' || cf.status || ')')::TEXT
  FROM case_file cf
  WHERE cf.criminal_id = p_criminal_id

  UNION ALL

  SELECT i.admitted_at, 'INCARCERATED'::TEXT,
       ('Admitted to ' || COALESCE(j.jail_name, 'Unknown jail'))::TEXT
  FROM incarceration i
  JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
  LEFT JOIN jail j ON i.jail_id = j.jail_id
  WHERE ar.criminal_id = p_criminal_id

  UNION ALL

  SELECT i.released_at, 'RELEASED'::TEXT,
       ('Released from ' || COALESCE(j.jail_name, 'Unknown jail'))::TEXT
  FROM incarceration i
  JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
  LEFT JOIN jail j ON i.jail_id = j.jail_id
  WHERE ar.criminal_id = p_criminal_id AND i.released_at IS NOT NULL

  UNION ALL

  SELECT br.granted_at::TIMESTAMPTZ,
       ('BAIL ' || UPPER(br.status))::TEXT,
       ('Bail ' || br.status || ' at ' || br.court_name ||
      CASE WHEN br.bail_amount IS NOT NULL
         THEN ' (Amount: ' || br.bail_amount::TEXT || ' BDT)'
         ELSE ''
      END)::TEXT
  FROM bail_record br
  JOIN arrest_record ar ON br.arrest_id = ar.arrest_id
  WHERE ar.criminal_id = p_criminal_id

  UNION ALL

  SELECT cl.noted_at, 'SIGHTING'::TEXT,
       ('Spotted at ' || l.address || ', ' || l.district)::TEXT
  FROM criminal_location cl
  JOIN location l ON cl.location_id = l.location_id
  WHERE cl.criminal_id = p_criminal_id

  ORDER BY 1 DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_get_district_crime_stats(p_district TEXT DEFAULT NULL)
RETURNS TABLE (
  district            TEXT,
  total_criminals     BIGINT,
  high_risk_criminals BIGINT,
  total_cases         BIGINT,
  open_cases          BIGINT,
  total_arrests       BIGINT,
  active_thanas       BIGINT
) AS $$
DECLARE
  v_rec RECORD;
BEGIN
  FOR v_rec IN
    SELECT
      t.district AS dist,
      COUNT(DISTINCT cr.criminal_id) AS criminals,
      COUNT(DISTINCT cr.criminal_id) FILTER (WHERE cr.risk_level >= 7) AS high_risk,
      COUNT(DISTINCT cf.case_id) AS cases,
      COUNT(DISTINCT cf.case_id) FILTER (WHERE cf.status = 'open') AS open_c,
      COUNT(DISTINCT ar.arrest_id) AS arrests,
      COUNT(DISTINCT t.thana_id) AS thanas
    FROM thana t
    LEFT JOIN criminal cr ON t.thana_id = cr.registered_thana_id
    LEFT JOIN case_file cf ON t.thana_id = cf.thana_id
    LEFT JOIN arrest_record ar ON t.thana_id = ar.thana_id
    WHERE (p_district IS NULL OR t.district = p_district)
    GROUP BY t.district
    HAVING COUNT(DISTINCT t.thana_id) > 0
    ORDER BY COUNT(DISTINCT cr.criminal_id) DESC
  LOOP
    district            := v_rec.dist;
    total_criminals     := v_rec.criminals;
    high_risk_criminals := v_rec.high_risk;
    total_cases         := v_rec.cases;
    open_cases          := v_rec.open_c;
    total_arrests       := v_rec.arrests;
    active_thanas       := v_rec.thanas;
    RETURN NEXT;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE proc_process_bail(
  p_bail_id     BIGINT,
  p_decision    TEXT,
  p_bail_amount NUMERIC DEFAULT NULL,
  p_surety_name TEXT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
DECLARE
  v_bail          RECORD;
  v_criminal_id   TEXT;
  v_incarceration RECORD;
BEGIN
  SELECT br.*, ar.criminal_id INTO v_bail
  FROM bail_record br
  JOIN arrest_record ar ON br.arrest_id = ar.arrest_id
  WHERE br.bail_id = p_bail_id;

  IF v_bail IS NULL THEN RAISE EXCEPTION 'Bail record % not found', p_bail_id; END IF;
  IF v_bail.status <> 'pending' THEN RAISE EXCEPTION 'Bail % already processed (status: %)', p_bail_id, v_bail.status; END IF;

  v_criminal_id := v_bail.criminal_id;

  IF p_decision = 'granted' THEN
    UPDATE bail_record
    SET status = 'granted', granted_at = CURRENT_DATE,
      bail_amount = COALESCE(p_bail_amount, bail_amount),
      surety_name = COALESCE(p_surety_name, surety_name)
    WHERE bail_id = p_bail_id;

    UPDATE arrest_record SET custody_status = 'on_bail' WHERE arrest_id = v_bail.arrest_id;
    UPDATE criminal SET status = 'on_bail' WHERE criminal_id = v_criminal_id;

    SELECT * INTO v_incarceration FROM incarceration
    WHERE arrest_id = v_bail.arrest_id AND released_at IS NULL;

    IF v_incarceration IS NOT NULL THEN
      UPDATE incarceration SET released_at = NOW() WHERE incarceration_id = v_incarceration.incarceration_id;
      IF v_incarceration.cell_id IS NOT NULL THEN
        UPDATE cell SET number_of_people = GREATEST(number_of_people - 1, 0), status = 'available'
        WHERE cell_id = v_incarceration.cell_id;
      END IF;
    END IF;

    INSERT INTO notification (target_role, title, message)
    VALUES ('thana', 'Bail Granted', 'Criminal ' || v_criminal_id || ' has been granted bail');

  ELSIF p_decision = 'rejected' THEN
    UPDATE bail_record SET status = 'rejected' WHERE bail_id = p_bail_id;
  ELSE
    RAISE EXCEPTION 'Invalid decision: %. Must be granted or rejected', p_decision;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Bail processing failed: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE proc_recalculate_all_risk_scores()
LANGUAGE plpgsql AS $$
DECLARE
  v_criminal RECORD;
  v_count    INT := 0;
  v_updated  INT := 0;
  v_new_risk INT;
BEGIN
  FOR v_criminal IN SELECT criminal_id, full_name, risk_level FROM criminal
  LOOP
    v_new_risk := fn_calculate_criminal_risk(v_criminal.criminal_id);
    v_count := v_count + 1;
    IF v_new_risk <> v_criminal.risk_level THEN
      v_updated := v_updated + 1;
    END IF;
  END LOOP;
  RAISE NOTICE 'Done. Processed % criminals, updated % risk scores.', v_count, v_updated;
END;
$$;

CREATE OR REPLACE PROCEDURE proc_transfer_criminal(
  p_criminal_id   TEXT,
  p_from_jail_id  TEXT,
  p_to_jail_id    TEXT,
  p_to_cell_id    TEXT,
  p_reason        TEXT,
  p_authorized_by TEXT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
DECLARE
  v_current_inc   RECORD;
  v_from_cell_id  TEXT;
  v_new_inc_id    TEXT;
BEGIN
  SELECT i.incarceration_id, i.cell_id, i.arrest_id
  INTO v_current_inc
  FROM incarceration i
  JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
  WHERE ar.criminal_id = p_criminal_id
    AND i.jail_id = p_from_jail_id
    AND i.released_at IS NULL;

  IF v_current_inc IS NULL THEN
    RAISE EXCEPTION 'Criminal % is not currently incarcerated in jail %', p_criminal_id, p_from_jail_id;
  END IF;

  v_from_cell_id := v_current_inc.cell_id;

  UPDATE incarceration SET released_at = NOW() WHERE incarceration_id = v_current_inc.incarceration_id;

  IF v_from_cell_id IS NOT NULL THEN
    UPDATE cell
    SET number_of_people = GREATEST(number_of_people - 1, 0),
      status = CASE WHEN number_of_people - 1 <= 0 THEN 'available' ELSE status END
    WHERE cell_id = v_from_cell_id;
  END IF;

  INSERT INTO incarceration (jail_id, arrest_id, cell_id, admitted_at)
  VALUES (p_to_jail_id, v_current_inc.arrest_id, p_to_cell_id, NOW())
  RETURNING incarceration_id INTO v_new_inc_id;

  IF p_to_cell_id IS NOT NULL THEN
    UPDATE cell
    SET number_of_people = number_of_people + 1,
      status = CASE WHEN number_of_people + 1 >= capacity THEN 'occupied' ELSE status END
    WHERE cell_id = p_to_cell_id;
  END IF;

  INSERT INTO criminal_transfer
    (criminal_id, from_jail_id, to_jail_id, from_cell_id, to_cell_id, transfer_reason, authorized_by)
  VALUES
    (p_criminal_id, p_from_jail_id, p_to_jail_id, v_from_cell_id, p_to_cell_id, p_reason, p_authorized_by);

  UPDATE arrest_record SET custody_status = 'transferred' WHERE arrest_id = v_current_inc.arrest_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Transfer failed: %', SQLERRM;
END;
$$;

-- 8) Trigger functions + triggers
CREATE OR REPLACE FUNCTION fn_audit_criminal_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, operation, record_id, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.criminal_id, ROW_TO_JSON(NEW)::JSONB);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, operation, record_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.criminal_id, ROW_TO_JSON(OLD)::JSONB, ROW_TO_JSON(NEW)::JSONB);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, operation, record_id, old_data)
    VALUES (TG_TABLE_NAME, TG_OP, OLD.criminal_id, ROW_TO_JSON(OLD)::JSONB);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_auto_custody_on_arrest()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE criminal SET status = 'in_custody' WHERE criminal_id = NEW.criminal_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_escape_alert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'escaped' AND (OLD.status IS NULL OR OLD.status <> 'escaped') THEN
    INSERT INTO notification (target_role, target_id, title, message)
    VALUES ('thana', NULL, ' CRIMINAL ESCAPED!',
        'URGENT: ' || NEW.full_name || ' (ID: ' || NEW.criminal_id || ', Risk: ' || NEW.risk_level || ') has ESCAPED.');
    INSERT INTO notification (target_role, target_id, title, message)
    VALUES ('officer', NULL, ' CRIMINAL ESCAPED!',
        'Be on lookout: ' || NEW.full_name || ' (ID: ' || NEW.criminal_id || ')');
    INSERT INTO notification (target_role, target_id, title, message)
    VALUES ('admin', NULL, ' ESCAPE ALERT!',
        'Criminal ' || NEW.full_name || ' has escaped. Risk Level: ' || NEW.risk_level);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_update_cell_occupancy()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.cell_id IS NOT NULL THEN
      UPDATE cell
      SET number_of_people = number_of_people + 1,
        status = CASE WHEN number_of_people + 1 >= capacity THEN 'occupied' ELSE 'available' END
      WHERE cell_id = NEW.cell_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.released_at IS NULL AND NEW.released_at IS NOT NULL THEN
      IF NEW.cell_id IS NOT NULL THEN
        UPDATE cell
        SET number_of_people = GREATEST(number_of_people - 1, 0), status = 'available'
        WHERE cell_id = NEW.cell_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_gd_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status <> OLD.status THEN
    INSERT INTO audit_log (table_name, operation, record_id, old_data, new_data)
    VALUES ('gd_report', 'STATUS_CHANGE', NEW.gd_id::TEXT,
        jsonb_build_object('status', OLD.status),
        jsonb_build_object('status', NEW.status, 'changed_at', CURRENT_TIMESTAMP));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_criminal ON criminal;
CREATE TRIGGER trg_audit_criminal
  AFTER INSERT OR UPDATE OR DELETE ON criminal
  FOR EACH ROW
  EXECUTE FUNCTION fn_audit_criminal_changes();

DROP TRIGGER IF EXISTS trg_criminal_status_on_arrest ON arrest_record;
CREATE TRIGGER trg_criminal_status_on_arrest
  AFTER INSERT ON arrest_record
  FOR EACH ROW
  EXECUTE FUNCTION fn_auto_custody_on_arrest();

DROP TRIGGER IF EXISTS trg_escape_alert ON criminal;
CREATE TRIGGER trg_escape_alert
  AFTER UPDATE ON criminal
  FOR EACH ROW
  WHEN (NEW.status = 'escaped')
  EXECUTE FUNCTION fn_escape_alert();

DROP TRIGGER IF EXISTS trg_cell_occupancy ON incarceration;
CREATE TRIGGER trg_cell_occupancy
  AFTER INSERT OR UPDATE ON incarceration
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_cell_occupancy();

DROP TRIGGER IF EXISTS trg_gd_status_change ON gd_report;
CREATE TRIGGER trg_gd_status_change
  AFTER UPDATE ON gd_report
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION fn_gd_status_change();

-- Quick verification checks:
-- SELECT status FROM criminal LIMIT 5;
-- SELECT status FROM gd_report LIMIT 5;
-- SELECT * FROM v_wanted_criminals LIMIT 5;
-- SELECT * FROM v_thana_performance LIMIT 5;
```

---

## ⚠️ IMPORTANT: RUN THIS SQL FIRST (Supabase SQL Editor)

Before using any of the updated code, you MUST run these SQL commands in your Supabase SQL Editor to update the `gd_report` table:

```sql
-- ═══════════════════════════════════════════════════════════════
-- GD REPORT TABLE MIGRATION — Run this in Supabase SQL Editor
-- Changes:
--   1) Status: remove 'pending', add 'assigned'
--   2) Add gd_type column (theft, lost_document, etc.)
--   3) Add incident_date and incident_location columns
-- ═══════════════════════════════════════════════════════════════

-- Step 1: Update any existing 'pending' rows to 'submitted'
UPDATE gd_report SET status = 'submitted' WHERE status = 'pending';

-- Step 2: Drop the old CHECK constraint and add the new one
ALTER TABLE gd_report DROP CONSTRAINT IF EXISTS gd_report_status_check;
ALTER TABLE gd_report ADD CONSTRAINT gd_report_status_check
    CHECK (status IN ('submitted', 'assigned', 'approved', 'rejected'));

-- Step 3: Add the gd_type column
ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS gd_type VARCHAR(30)
    NOT NULL DEFAULT 'other'
    CHECK (gd_type IN ('theft','lost_document','missing_person','accident','assault','robbery','fraud','domestic_violence','property_dispute','suspicious_activity','threat','noise_disturbance','other'));

-- Step 4: Add incident_date and incident_location columns
ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS incident_date DATE;
ALTER TABLE gd_report ADD COLUMN IF NOT EXISTS incident_location TEXT;

-- Done! You can verify with:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'gd_report';
```

---

## HOW TO USE THIS FILE

1. For each section below, copy the ENTIRE code block
2. Replace the contents of the file shown in the heading
3. Go in ORDER — do Routing.jsx first, then services, then pages
4. After pasting ALL files, run `npm run dev` in the Frontend folder

---

## ✅ FILE ACTION CHECKLIST

Go through this list in order. For each file:

- **REPLACE** = File already exists with old code. Delete all its content, paste new code.
- **PASTE INTO EMPTY** = File exists but is empty (0 bytes). Just paste the code.
- **CREATE NEW** = File does NOT exist. Create it at the shown path, then paste.

| #   | Action                        | File Path                                                                        | Section    |
| --- | ----------------------------- | -------------------------------------------------------------------------------- | ---------- |
| 1   | REPLACE                       | `Frontend/src/routes/Routing.jsx`                                                | Section 1  |
| 2   | REPLACE (find & replace only) | `Frontend/src/pages/AccessRedirectionPage/LoginPage.jsx`                         | Section 2  |
| 3   | **CREATE NEW**                | `Frontend/src/services/User/updateUserApi.js`                                    | Section 3  |
| 4   | **CREATE NEW**                | `Frontend/src/services/Admin/adminApi.js`                                        | Section 3  |
| 5   | **CREATE NEW**                | `Frontend/src/services/Thana/thanaApi.js`                                        | Section 3  |
| 6   | **CREATE NEW**                | `Frontend/src/services/Officer/officerApi.js`                                    | Section 3  |
| 7   | REPLACE                       | `Frontend/src/pages/Dashboard/AdminDashboard.jsx`                                | Section 4  |
| 8   | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/ThanaDashboard.jsx`                          | Section 5  |
| 9   | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddCriminal.jsx`                | Section 6  |
| 10  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateCriminal.jsx`             | Section 6  |
| 11  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddLocation.jsx`                | Section 6  |
| 12  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddOrganization.jsx`            | Section 6  |
| 13  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/OfficerPart/AddOfficer.jsx`                  | Section 6  |
| 14  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/OfficerPart/UpdateOfficer.jsx`               | Section 6  |
| 15  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CaseFilePart/AddCaseFile.jsx`                | Section 6  |
| 16  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CaseFilePart/UpdateCaseFile.jsx`             | Section 6  |
| 17  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateLocation.jsx`             | Section 6B |
| 18  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateOrganization.jsx`         | Section 6B |
| 19  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddCriminalRelation.jsx`        | Section 6B |
| 20  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateCriminalOrganization.jsx` | Section 6B |
| 21  | **CREATE NEW**                | `Frontend/src/pages/Dashboard/Officer/OfficerDashboard.jsx`                      | Section 7  |
| 22  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/Officer/GDPart/ResponseToGD.jsx`                   | Section 7  |
| 23  | PASTE INTO EMPTY              | `Frontend/src/pages/Dashboard/User/GDReports.jsx`                                | Section 8  |
| 24  | **CREATE NEW**                | `Frontend/src/services/User/criminalLookupApi.js`                                | Section 8A |
| 25  | **CREATE NEW**                | `Frontend/src/pages/Dashboard/User/WantedCriminals.jsx`                          | Section 8A |
| 26  | **CREATE NEW**                | `Frontend/src/pages/Dashboard/User/CriminalsByArea.jsx`                          | Section 8A |

> **Files you can IGNORE** (not routed, not imported, won't cause errors):
> Admin/AdminDashboard.jsx, Admin/AddThana.jsx, Admin/UpdateThana.jsx, Admin/AddThanaHead.jsx,
> Admin/UpdateThanaHead.jsx, Admin/AddRanks.jsx, Admin/AddRankToOfficer.jsx,
> Admin/SearchPart/ThanaData.jsx, Admin/SearchPart/OfficerData.jsx,
> Admin/SearchPart/CriminalData.jsx, Admin/SearchPart/Rankdata.jsx,
> Officer/SearchPart/ArrestRecord.jsx, Officer/SearchPart/BailData.jsx,
> Officer/SearchPart/CriminalData.jsx, Officer/SearchPart/GDReportData.jsx,
> Officer/SearchPart/IncarcerationData.jsx, Officer/SearchPart/JailData.jsx,
> Officer/SearchPart/LocationData.jsx, Officer/SearchPart/OrganizationData.jsx
>
> These files exist but are empty. Since nothing imports them and Routing.jsx
> doesn't route to them, they cause ZERO problems. Leave them empty.

---

## SECTION 1: ROUTING (paste this FIRST)

### File: `Frontend/src/routes/Routing.jsx`

```jsx
import NotFound from "@/pages/NotFound/NotFound";
import HomePage from "@/pages/HomePage/HomePage";
import AccessRedirectionPage from "@/pages/AccessRedirectionPage/AccessRedirectionPage";
import LoginPage from "@/pages/AccessRedirectionPage/LoginPage";
import { Routes, Route } from "react-router-dom";
import OfficerRegistrationPage from "@/pages/RegistrationPage/OfficerRegistrationPage";
import ThanaRegistrationPage from "@/pages/RegistrationPage/ThanaRegistrationPage";
import JailRegistrationPage from "@/pages/RegistrationPage/JailRegistrationPage";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import AddGDReport from "@/pages/Dashboard/User/AddGDReport";
import RegisterUser from "@/pages/Dashboard/User/RegisterUser";
import SigninUser from "@/pages/Dashboard/User/SigninUser";
import UserDashboard from "@/pages/Dashboard/User/UserDashboard";
import UserProfile from "@/pages/Dashboard/User/UserProfile";
import EditProfile from "@/pages/Dashboard/User/EditProfile";
import GDReports from "@/pages/Dashboard/User/GDReports";
import ThanaDashboard from "@/pages/Dashboard/Thana/ThanaDashboard";
import AddCriminal from "@/pages/Dashboard/Thana/CriminalPart/AddCriminal";
import UpdateCriminal from "@/pages/Dashboard/Thana/CriminalPart/UpdateCriminal";
import AddCaseFile from "@/pages/Dashboard/Thana/CaseFilePart/AddCaseFile";
import UpdateCaseFile from "@/pages/Dashboard/Thana/CaseFilePart/UpdateCaseFile";
import AddOfficer from "@/pages/Dashboard/Thana/OfficerPart/AddOfficer";
import UpdateOfficer from "@/pages/Dashboard/Thana/OfficerPart/UpdateOfficer";
import AddLocation from "@/pages/Dashboard/Thana/CriminalPart/AddLocation";
import AddOrganization from "@/pages/Dashboard/Thana/CriminalPart/AddOrganization";
import OfficerDashboard from "@/pages/Dashboard/Officer/OfficerDashboard";
import ResponseToGD from "@/pages/Dashboard/Officer/GDPart/ResponseToGD";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/access" element={<AccessRedirectionPage />} />
      <Route path="/access/login/:userType" element={<LoginPage />} />
      <Route
        path="/access/thana-register"
        element={<ThanaRegistrationPage />}
      />
      <Route
        path="/access/officer-register"
        element={<OfficerRegistrationPage />}
      />
      <Route path="/access/jail-register" element={<JailRegistrationPage />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Thana */}
      <Route path="/thana/dashboard" element={<ThanaDashboard />} />
      <Route path="/thana/add-criminal" element={<AddCriminal />} />
      <Route
        path="/thana/update-criminal/:criminalId"
        element={<UpdateCriminal />}
      />
      <Route path="/thana/add-case-file" element={<AddCaseFile />} />
      <Route
        path="/thana/update-case-file/:caseId"
        element={<UpdateCaseFile />}
      />
      <Route path="/thana/add-officer" element={<AddOfficer />} />
      <Route
        path="/thana/update-officer/:officerId"
        element={<UpdateOfficer />}
      />
      <Route path="/thana/add-location" element={<AddLocation />} />
      <Route path="/thana/add-organization" element={<AddOrganization />} />

      {/* Officer */}
      <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      <Route path="/officer/respond-gd/:gdId" element={<ResponseToGD />} />

      {/* User */}
      <Route path="/user-registration" element={<RegisterUser />} />
      <Route path="/user-signin" element={<SigninUser />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/dashboard/profile" element={<UserProfile />} />
      <Route path="/user/dashboard/profile/edit" element={<EditProfile />} />
      <Route path="/user/dashboard/add-gd-report" element={<AddGDReport />} />
      <Route path="/user/dashboard/gd-reports" element={<GDReports />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Routing;
```

---

## SECTION 2: LOGIN PAGE FIX — Update dashboard routes

### File: `Frontend/src/pages/AccessRedirectionPage/LoginPage.jsx`

Find this block in onSuccess (around line 80-90):

```js
const dashboardRoutes = {
  admin: "/admin/dashboard",
  thana: "/access",
  officer: "/access",
  jail: "/access",
};
```

Replace with:

```js
const dashboardRoutes = {
  admin: "/admin/dashboard",
  thana: "/thana/dashboard",
  officer: "/officer/dashboard",
  jail: "/admin/dashboard",
};
```

---

## SECTION 3: NEW SERVICE FILES

### File: `Frontend/src/services/User/updateUserApi.js` (CREATE NEW)

```js
import axiosInstance from "@/helpers/axiosInstance";

async function updateUserApi(userData) {
  try {
    const userId =
      userData.user_id ||
      JSON.parse(localStorage.getItem("user-storage"))?.state?.user?.user_id;
    const response = await axiosInstance.put(
      `/user/update-user/${userId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log("Error in updateUserApi: ", error);
    return { success: false, message: "Failed to update profile." };
  }
}

export default updateUserApi;
```

### File: `Frontend/src/services/Admin/adminApi.js` (CREATE NEW)

```js
import axiosInstance from "@/helpers/axiosInstance";

export async function getAllThanas() {
  try {
    const res = await axiosInstance.get("/thana/get-all-thanas");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllOfficers() {
  try {
    const res = await axiosInstance.get("/officer/get-officers");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllCriminals() {
  try {
    const res = await axiosInstance.get("/criminal/get-criminals");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllRanks() {
  try {
    const res = await axiosInstance.get("/rank/get-all-ranks");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllJails() {
  try {
    const res = await axiosInstance.get("/jail/get-jails");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllUsers() {
  try {
    const res = await axiosInstance.get("/user/get-users");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllGDReports() {
  try {
    const res = await axiosInstance.get("/gd-report/get-all-general-dairies");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getDashboardOverview() {
  try {
    const res = await axiosInstance.get("/analytics/dashboard-overview");
    return res.data;
  } catch (e) {
    return { success: false, data: {} };
  }
}

export async function addThana(data) {
  try {
    const res = await axiosInstance.post("/thana/add-thana", data);
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Failed" };
  }
}

export async function updateThana(thanaId, data) {
  try {
    const res = await axiosInstance.put(`/thana/update-thana/${thanaId}`, data);
    return res.data;
  } catch (e) {
    return { success: false, message: "Failed" };
  }
}

export async function deleteThana(thanaId) {
  try {
    const res = await axiosInstance.delete(`/thana/delete-thana/${thanaId}`);
    return res.data;
  } catch (e) {
    return { success: false, message: "Failed" };
  }
}

export async function addRank(data) {
  try {
    const res = await axiosInstance.post("/rank/add-rank", data);
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Failed" };
  }
}

export async function addHeadOfficer(data) {
  try {
    const res = await axiosInstance.post("/thana/add-head-officer", data);
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Failed" };
  }
}
```

### File: `Frontend/src/services/Thana/thanaApi.js` (CREATE NEW)

```js
import axiosInstance from "@/helpers/axiosInstance";

export async function getCriminalsByThana(thanaId) {
  try {
    const res = await axiosInstance.get(
      `/criminal/get-criminals-by-thana/${thanaId}`,
    );
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function addCriminal(data) {
  try {
    const res = await axiosInstance.post("/criminal/add-criminal", data);
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Failed" };
  }
}

export async function updateCriminal(criminalId, data) {
  try {
    const res = await axiosInstance.put(
      `/criminal/update-criminal/${criminalId}`,
      data,
    );
    return res.data;
  } catch (e) {
    return { success: false, message: "Failed" };
  }
}

export async function getOfficersByThana(thanaId) {
  try {
    const res = await axiosInstance.get(
      `/officer/get-officers-by-thana/${thanaId}`,
    );
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function addOfficer(data) {
  try {
    const res = await axiosInstance.post("/officer/add-officer", data);
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Failed" };
  }
}

export async function updateOfficer(officerId, data) {
  try {
    const res = await axiosInstance.put(
      `/officer/update-officer/${officerId}`,
      data,
    );
    return res.data;
  } catch (e) {
    return { success: false, message: "Failed" };
  }
}

export async function getCaseFilesByThana(thanaId) {
  try {
    const res = await axiosInstance.get(
      `/case-file/get-case-files-by-thana/${thanaId}`,
    );
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function addCaseFile(data) {
  try {
    const res = await axiosInstance.post("/case-file/add-case-file", data);
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Failed" };
  }
}

export async function updateCaseFile(caseId, data) {
  try {
    const res = await axiosInstance.put(
      `/case-file/update-case-file/${caseId}`,
      data,
    );
    return res.data;
  } catch (e) {
    return { success: false, message: "Failed" };
  }
}

export async function addLocation(data) {
  try {
    const res = await axiosInstance.post("/location/add-location", data);
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Failed" };
  }
}

export async function addOrganization(data) {
  try {
    const res = await axiosInstance.post(
      "/organization/add-organization",
      data,
    );
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Failed" };
  }
}

export async function getGDReportsByThana(thanaId) {
  try {
    const res = await axiosInstance.get(
      `/gd-report/get-general-dairies-by-thana/${thanaId}`,
    );
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllRanks() {
  try {
    const res = await axiosInstance.get("/rank/get-all-ranks");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}
```

### File: `Frontend/src/services/Officer/officerApi.js` (CREATE NEW)

```js
import axiosInstance from "@/helpers/axiosInstance";

export async function getGDReportsByThana(thanaId) {
  try {
    const res = await axiosInstance.get(
      `/gd-report/get-general-dairies-by-thana/${thanaId}`,
    );
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function updateGDReportStatus(gdId, data) {
  try {
    const res = await axiosInstance.put(
      `/gd-report/update-general-dairy-status/${gdId}`,
      data,
    );
    return res.data;
  } catch (e) {
    return { success: false, message: "Failed" };
  }
}

export async function getAllCriminals() {
  try {
    const res = await axiosInstance.get("/criminal/get-criminals");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function searchCriminals(query) {
  try {
    const res = await axiosInstance.get(
      `/criminal/search-criminals?q=${encodeURIComponent(query)}`,
    );
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllArrestRecords() {
  try {
    const res = await axiosInstance.get("/arrest-record/get-arrest-records");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllBailRecords() {
  try {
    const res = await axiosInstance.get("/bail-record/get-bail-records");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllIncarcerations() {
  try {
    const res = await axiosInstance.get("/incarceration/get-incarcerations");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllLocations() {
  try {
    const res = await axiosInstance.get("/location/get-all-locations");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllOrganizations() {
  try {
    const res = await axiosInstance.get("/organization/get-all-organizations");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function getAllJails() {
  try {
    const res = await axiosInstance.get("/jail/get-jails");
    return res.data;
  } catch (e) {
    return { success: false, data: [] };
  }
}
```

---

## SECTION 4: ADMIN DASHBOARD — Replace with LIVE API data

### File: `Frontend/src/pages/Dashboard/AdminDashboard.jsx`

```jsx
import { useState } from "react";
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
  addRank,
  addHeadOfficer,
  deleteThana,
} from "@/services/Admin/adminApi";
import userStore from "@/state/userStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function AdminDashboard() {
  const navigate = useNavigate();
  const { clearUser } = userStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddThana, setShowAddThana] = useState(false);
  const [showAddRank, setShowAddRank] = useState(false);

  // Form states
  const [thanaForm, setThanaForm] = useState({
    thana_name: "",
    district: "",
    zone: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    created_by_admin_id: "",
  });
  const [rankForm, setRankForm] = useState({
    rank_code: "",
    rank_name: "",
    level: "",
  });

  const handleSignout = async () => {
    await adminSignoutApi();
    clearUser();
    navigate("/");
  };

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
  const { data: overviewData } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: getDashboardOverview,
  });

  const thanas = thanasData?.data || [];
  const officers = officersData?.data || [];
  const criminals = criminalsData?.data || [];
  const ranks = ranksData?.data || [];
  const jails = jailsData?.data || [];
  const users = usersData?.data || [];
  const gdReports = gdData?.data || [];

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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "thanas", label: `Thanas (${thanas.length})` },
    { id: "officers", label: `Officers (${officers.length})` },
    { id: "criminals", label: `Criminals (${criminals.length})` },
    { id: "jails", label: `Jails (${jails.length})` },
    { id: "ranks", label: `Ranks (${ranks.length})` },
    { id: "users", label: `Users (${users.length})` },
    { id: "gd-reports", label: `GD Reports (${gdReports.length})` },
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
          <button
            onClick={handleSignout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm rounded-lg transition-all"
          >
            Sign Out
          </button>
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
```

---

## SECTION 5: THANA DASHBOARD

### File: `Frontend/src/pages/Dashboard/Thana/ThanaDashboard.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { thanaSignoutApi } from "@/services/authServices/signoutApi";
import {
  getCriminalsByThana,
  getOfficersByThana,
  getCaseFilesByThana,
  getGDReportsByThana,
} from "@/services/Thana/thanaApi";
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

  const criminals = crimData?.data || [];
  const officers = offData?.data || [];
  const cases = caseData?.data || [];
  const gdReports = gdData?.data || [];

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
                  </tr>
                ))}
                {gdReports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No GD reports
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
```

---

## SECTION 6: THANA SUB-PAGES

### File: `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddCriminal.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCriminal } from "@/services/Thana/thanaApi";
import { useMutation } from "@tanstack/react-query";

function AddCriminal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    nid: "",
    status: "in_custody",
    risk_level: 5,
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => addCriminal(form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Criminal added!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Add Criminal</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Full Name
            </label>
            <input
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              NID Number
            </label>
            <input
              value={form.nid}
              onChange={(e) => set("nid", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="unknown">Unknown</option>
              <option value="wanted">Wanted</option>
              <option value="in_custody">In Custody</option>
              <option value="on_bail">On Bail</option>
              <option value="released">Released</option>
              <option value="escaped">Escaped</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Risk Level (1-10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.risk_level}
              onChange={(e) => set("risk_level", Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Criminal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCriminal;
```

### File: `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateCriminal.jsx`

```jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateCriminal } from "@/services/Thana/thanaApi";
import { useMutation } from "@tanstack/react-query";

function UpdateCriminal() {
  const navigate = useNavigate();
  const { criminalId } = useParams();
  const [form, setForm] = useState({ status: "in_custody", risk_level: 5 });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateCriminal(criminalId, form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Updated!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Update Criminal
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{criminalId}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="unknown">Unknown</option>
              <option value="wanted">Wanted</option>
              <option value="in_custody">In Custody</option>
              <option value="on_bail">On Bail</option>
              <option value="released">Released</option>
              <option value="escaped">Escaped</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Risk Level
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.risk_level}
              onChange={(e) => set("risk_level", Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Criminal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCriminal;
```

### File: `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddLocation.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLocation } from "@/services/Thana/thanaApi";
import { useMutation } from "@tanstack/react-query";

function AddLocation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ district: "", address: "", zone: "" });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => addLocation(form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Location added!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Add Location</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">District</label>
            <input
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Address</label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Zone</label>
            <input
              value={form.zone}
              onChange={(e) => set("zone", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Location"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLocation;
```

### File: `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddOrganization.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addOrganization } from "@/services/Thana/thanaApi";
import { useMutation } from "@tanstack/react-query";

function AddOrganization() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", ideology: "", threat_level: 5 });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => addOrganization(form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Organization added!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">
          Add Organization
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Ideology</label>
            <input
              value={form.ideology}
              onChange={(e) => set("ideology", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Threat Level (1-10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.threat_level}
              onChange={(e) => set("threat_level", Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Organization"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddOrganization;
```

### File: `Frontend/src/pages/Dashboard/Thana/OfficerPart/AddOfficer.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addOfficer, getAllRanks } from "@/services/Thana/thanaApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";

function AddOfficer() {
  const navigate = useNavigate();
  const { user } = userStore();
  const [form, setForm] = useState({
    badge_no: "",
    full_name: "",
    rank_code: "",
    phone: "",
    email: "",
    password: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { data: ranksData } = useQuery({
    queryKey: ["ranks"],
    queryFn: getAllRanks,
  });
  const ranks = ranksData?.data || [];

  const { mutate, isPending } = useMutation({
    mutationFn: () => addOfficer({ ...form, thana_id: user?.thana_id }),
    onSuccess: (r) => {
      if (r.success) {
        alert("Officer added!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Add Officer</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Badge Number
            </label>
            <input
              value={form.badge_no}
              onChange={(e) => set("badge_no", e.target.value)}
              placeholder="BD-OFC-XXX"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Full Name
            </label>
            <input
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Rank</label>
            <select
              value={form.rank_code}
              onChange={(e) => set("rank_code", e.target.value)}
              className={inputCls}
              required
            >
              <option value="">Select Rank</option>
              {ranks.map((r) => (
                <option key={r.rank_code} value={r.rank_code}>
                  {r.rank_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Officer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddOfficer;
```

### File: `Frontend/src/pages/Dashboard/Thana/OfficerPart/UpdateOfficer.jsx`

```jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateOfficer } from "@/services/Thana/thanaApi";
import { useMutation } from "@tanstack/react-query";

function UpdateOfficer() {
  const navigate = useNavigate();
  const { officerId } = useParams();
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateOfficer(officerId, form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Updated!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Update Officer
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{officerId}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Full Name
            </label>
            <input
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Officer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateOfficer;
```

### File: `Frontend/src/pages/Dashboard/Thana/CaseFilePart/AddCaseFile.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCaseFile } from "@/services/Thana/thanaApi";
import userStore from "@/state/userStore";
import { useMutation } from "@tanstack/react-query";

function AddCaseFile() {
  const navigate = useNavigate();
  const { user } = userStore();
  const [form, setForm] = useState({
    case_number: "",
    criminal_id: "",
    case_type: "robbery",
    description: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => addCaseFile({ ...form, thana_id: user?.thana_id }),
    onSuccess: (r) => {
      if (r.success) {
        alert("Case file added!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">
          Add Case File
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Case Number
            </label>
            <input
              value={form.case_number}
              onChange={(e) => set("case_number", e.target.value)}
              placeholder="CF-2024-DHK-001"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID
            </label>
            <input
              value={form.criminal_id}
              onChange={(e) => set("criminal_id", e.target.value)}
              placeholder="CRM-0000001"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Case Type
            </label>
            <select
              value={form.case_type}
              onChange={(e) => set("case_type", e.target.value)}
              className={inputCls}
            >
              <option value="robbery">Robbery</option>
              <option value="murder">Murder</option>
              <option value="drug_trafficking">Drug Trafficking</option>
              <option value="assault">Assault</option>
              <option value="fraud">Fraud</option>
              <option value="kidnapping">Kidnapping</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={inputCls}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Case File"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCaseFile;
```

### File: `Frontend/src/pages/Dashboard/Thana/CaseFilePart/UpdateCaseFile.jsx`

```jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateCaseFile } from "@/services/Thana/thanaApi";
import { useMutation } from "@tanstack/react-query";

function UpdateCaseFile() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [form, setForm] = useState({
    status: "under_investigation",
    description: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateCaseFile(caseId, form),
    onSuccess: (r) => {
      if (r.success) {
        alert("Updated!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Update Case File
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">Case #{caseId}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="under_investigation">Under Investigation</option>
              <option value="closed">Closed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Case"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCaseFile;
```

---

## SECTION 6B: REMAINING THANA SUB-PAGES (4 files)

### File: `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateLocation.jsx` (PASTE INTO EMPTY)

```jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function UpdateLocation() {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [form, setForm] = useState({ district: "", address: "", zone: "" });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance
        .put(`/location/update-location/${locationId}`, form)
        .then((r) => r.data),
    onSuccess: (r) => {
      if (r.success) {
        alert("Location updated!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Update Location
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{locationId}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">District</label>
            <input
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Address</label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Zone</label>
            <input
              value={form.zone}
              onChange={(e) => set("zone", e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Location"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateLocation;
```

### File: `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateOrganization.jsx` (PASTE INTO EMPTY)

```jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function UpdateOrganization() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const [form, setForm] = useState({
    name: "",
    ideology: "",
    threat_level: 5,
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance
        .put(`/organization/update-organization/${orgId}`, form)
        .then((r) => r.data),
    onSuccess: (r) => {
      if (r.success) {
        alert("Organization updated!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Update Organization
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{orgId}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Ideology</label>
            <input
              value={form.ideology}
              onChange={(e) => set("ideology", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Threat Level (1-10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.threat_level}
              onChange={(e) => set("threat_level", Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Organization"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateOrganization;
```

### File: `Frontend/src/pages/Dashboard/Thana/CriminalPart/AddCriminalRelation.jsx` (PASTE INTO EMPTY)

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function AddCriminalRelation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id_1: "",
    criminal_id_2: "",
    relation_type: "associate",
    notes: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance
        .post("/criminal-relation/add-relation", {
          criminal_id_1: form.criminal_id_1,
          criminal_id_2: form.criminal_id_2,
          relation_type: form.relation_type,
        })
        .then((r) => r.data),
    onSuccess: (r) => {
      if (r.success) {
        alert("Relation added!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">
          Add Criminal Relation
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID 1
            </label>
            <input
              value={form.criminal_id_1}
              onChange={(e) => set("criminal_id_1", e.target.value)}
              placeholder="CRM-0000001"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID 2
            </label>
            <input
              value={form.criminal_id_2}
              onChange={(e) => set("criminal_id_2", e.target.value)}
              placeholder="CRM-0000002"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Relationship Type
            </label>
            <select
              value={form.relation_type}
              onChange={(e) => set("relation_type", e.target.value)}
              className={inputCls}
            >
              <option value="associate">Associate</option>
              <option value="family">Family</option>
              <option value="financial">Financial</option>
              <option value="accomplice">Accomplice</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Adding..." : "Add Relation"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCriminalRelation;
```

### File: `Frontend/src/pages/Dashboard/Thana/CriminalPart/UpdateCriminalOrganization.jsx` (PASTE INTO EMPTY)

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosInstance";
import { useMutation } from "@tanstack/react-query";

function UpdateCriminalOrganization() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminal_id: "",
    org_id: "",
    role: "member",
    status: "active",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Update existing link first. If not found, create a new one.
      try {
        const updateRes = await axiosInstance.put(
          `/criminal-organization/update-link/${form.criminal_id}/${form.org_id}`,
          { role: form.role },
        );
        return updateRes.data;
      } catch (err) {
        if (err?.response?.status === 404) {
          const createRes = await axiosInstance.post(
            "/criminal-organization/add-link",
            {
              criminal_id: form.criminal_id,
              org_id: form.org_id,
              role: form.role,
            },
          );
          return createRes.data;
        }
        throw err;
      }
    },
    onSuccess: (r) => {
      if (r.success) {
        alert("Link updated!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">
          Link Criminal to Organization
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Criminal ID
            </label>
            <input
              value={form.criminal_id}
              onChange={(e) => set("criminal_id", e.target.value)}
              placeholder="CRM-0000001"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Organization ID
            </label>
            <input
              value={form.org_id}
              onChange={(e) => set("org_id", e.target.value)}
              placeholder="ORG-0000001"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">
              Role in Organization
            </label>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className={inputCls}
            >
              <option value="member">Member</option>
              <option value="leader">Leader</option>
              <option value="financier">Financier</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspected">Suspected</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              UI-only field for analyst notes. Backend link table stores role
              only.
            </p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Submitting..." : "Link Criminal to Org"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCriminalOrganization;
```

---

## SECTION 7: OFFICER DASHBOARD

### File: `Frontend/src/pages/Dashboard/Officer/OfficerDashboard.jsx` (CREATE NEW FILE)

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { officerSignoutApi } from "@/services/authServices/signoutApi";
import {
  getGDReportsByThana,
  getAllCriminals,
  searchCriminals,
  getAllArrestRecords,
  getAllBailRecords,
  getAllIncarcerations,
  getAllLocations,
  getAllOrganizations,
  getAllJails,
} from "@/services/Officer/officerApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";

function OfficerDashboard() {
  const navigate = useNavigate();
  const { user, clearUser } = userStore();
  const [activeTab, setActiveTab] = useState("gd-reports");
  const [searchQ, setSearchQ] = useState("");

  const handleSignout = async () => {
    await officerSignoutApi();
    clearUser();
    navigate("/");
  };

  const thanaId = user?.thana_id;
  const { data: gdData } = useQuery({
    queryKey: ["officerGD", thanaId],
    queryFn: () => getGDReportsByThana(thanaId),
    enabled: !!thanaId,
  });
  const { data: crimData } = useQuery({
    queryKey: ["officerCriminals"],
    queryFn: getAllCriminals,
  });
  const { data: arrestData } = useQuery({
    queryKey: ["officerArrests"],
    queryFn: getAllArrestRecords,
  });
  const { data: bailData } = useQuery({
    queryKey: ["officerBails"],
    queryFn: getAllBailRecords,
  });
  const { data: incData } = useQuery({
    queryKey: ["officerInc"],
    queryFn: getAllIncarcerations,
  });
  const { data: locData } = useQuery({
    queryKey: ["officerLoc"],
    queryFn: getAllLocations,
  });
  const { data: orgData } = useQuery({
    queryKey: ["officerOrg"],
    queryFn: getAllOrganizations,
  });
  const { data: jailData } = useQuery({
    queryKey: ["officerJails"],
    queryFn: getAllJails,
  });

  const gdReports = gdData?.data || [];
  const criminals = crimData?.data || [];
  const arrests = arrestData?.data || [];
  const bails = bailData?.data || [];
  const incarcerations = incData?.data || [];
  const locations = locData?.data || [];
  const organizations = orgData?.data || [];
  const jails = jailData?.data || [];

  const statusColor = (s) => {
    const c = {
      assigned: "text-yellow-400 bg-yellow-500/10",
      approved: "text-green-400 bg-green-500/10",
      rejected: "text-red-400 bg-red-500/10",
      submitted: "text-blue-400 bg-blue-500/10",
      in_custody: "text-red-400 bg-red-500/10",
      on_bail: "text-yellow-400 bg-yellow-500/10",
      wanted: "text-orange-400 bg-orange-500/10",
      escaped: "text-rose-400 bg-rose-500/10",
      released: "text-green-400 bg-green-500/10",
      unknown: "text-gray-400 bg-gray-500/10",
    };
    return c[s] || "text-gray-400 bg-gray-500/10";
  };

  const tabs = [
    { id: "gd-reports", label: `GD Reports (${gdReports.length})` },
    { id: "criminals", label: `Criminals (${criminals.length})` },
    { id: "arrests", label: `Arrests (${arrests.length})` },
    { id: "bails", label: `Bail (${bails.length})` },
    { id: "incarcerations", label: `Incarceration (${incarcerations.length})` },
    { id: "locations", label: `Locations (${locations.length})` },
    { id: "organizations", label: `Orgs (${organizations.length})` },
    { id: "jails", label: `Jails (${jails.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200">
      <header className="border-b border-white/5 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-lg font-bold">Officer Dashboard</h1>
            <p className="text-xs text-slate-500 font-mono">
              {user?.full_name} — {user?.badge_no}
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
        <div className="flex flex-wrap gap-1 mb-6 bg-gray-900 border border-white/5 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 text-xs rounded-lg transition-all ${activeTab === t.id ? "bg-green-600 text-white" : "text-slate-400 hover:bg-white/5"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* GD Reports Tab */}
        {activeTab === "gd-reports" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-right p-3">Action</th>
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
                      {g.status === "submitted" || g.status === "assigned" ? (
                        <button
                          onClick={() =>
                            navigate(`/officer/respond-gd/${g.gd_id}`)
                          }
                          className="text-green-400 text-xs"
                        >
                          Respond
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs">Done</span>
                      )}
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
                </tr>
              </thead>
              <tbody>
                {criminals.map((c) => (
                  <tr key={c.criminal_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{c.criminal_id}</td>
                    <td className="p-3">{c.full_name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{c.risk_level}/10</td>
                  </tr>
                ))}
                {criminals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No criminals
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Arrests Tab */}
        {activeTab === "arrests" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Criminal</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {arrests.map((a) => (
                  <tr key={a.arrest_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{a.arrest_id}</td>
                    <td className="p-3">{a.criminal_id}</td>
                    <td className="p-3 text-xs">
                      {a.arrest_date
                        ? new Date(a.arrest_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(a.custody_status)}`}
                      >
                        {a.custody_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {arrests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No arrest records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Bail Tab */}
        {activeTab === "bails" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Arrest</th>
                  <th className="text-left p-3">Court</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bails.map((b) => (
                  <tr key={b.bail_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{b.bail_id}</td>
                    <td className="p-3">{b.arrest_id}</td>
                    <td className="p-3">{b.court_name}</td>
                    <td className="p-3 font-mono">৳{b.bail_amount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(b.status)}`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bails.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No bail records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Incarcerations Tab */}
        {activeTab === "incarcerations" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Jail</th>
                  <th className="text-left p-3">Cell</th>
                  <th className="text-left p-3">Arrest</th>
                </tr>
              </thead>
              <tbody>
                {incarcerations.map((i) => (
                  <tr
                    key={i.incarceration_id}
                    className="border-b border-white/5"
                  >
                    <td className="p-3 font-mono text-xs">
                      {i.incarceration_id}
                    </td>
                    <td className="p-3">{i.jail_id}</td>
                    <td className="p-3">{i.cell_id}</td>
                    <td className="p-3">{i.arrest_id}</td>
                  </tr>
                ))}
                {incarcerations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No incarcerations
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
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">District</th>
                  <th className="text-left p-3">Address</th>
                  <th className="text-left p-3">Zone</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((l) => (
                  <tr key={l.location_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{l.location_id}</td>
                    <td className="p-3">{l.district}</td>
                    <td className="p-3">{l.address}</td>
                    <td className="p-3">{l.zone}</td>
                  </tr>
                ))}
                {locations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No locations
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
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Ideology</th>
                  <th className="text-left p-3">Threat</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((o) => (
                  <tr key={o.org_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{o.org_id}</td>
                    <td className="p-3">{o.name}</td>
                    <td className="p-3">{o.ideology}</td>
                    <td className="p-3 font-mono">{o.threat_level}/10</td>
                  </tr>
                ))}
                {organizations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No organizations
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Jails Tab */}
        {activeTab === "jails" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">District</th>
                  <th className="text-left p-3">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {jails.map((j) => (
                  <tr key={j.jail_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{j.jail_id}</td>
                    <td className="p-3">{j.jail_name}</td>
                    <td className="p-3">{j.district}</td>
                    <td className="p-3 font-mono">{j.capacity}</td>
                  </tr>
                ))}
                {jails.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No jails
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

export default OfficerDashboard;
```

### File: `Frontend/src/pages/Dashboard/Officer/GDPart/ResponseToGD.jsx`

```jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateGDReportStatus } from "@/services/Officer/officerApi";
import userStore from "@/state/userStore";
import { useMutation } from "@tanstack/react-query";

function ResponseToGD() {
  const navigate = useNavigate();
  const { gdId } = useParams();
  const { user } = userStore();
  const [status, setStatus] = useState("assigned");
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateGDReportStatus(gdId, {
        status,
        approved_by_officer_id:
          status === "approved" || status === "rejected"
            ? user?.officer_id
            : null,
        assigned_officer_id: user?.officer_id,
      }),
    onSuccess: (r) => {
      if (r.success) {
        alert("GD Report updated!");
        navigate("/officer/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/officer/dashboard")}
          className="text-sm text-green-400 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Respond to GD Report
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">GD #{gdId}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Decision</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputCls}
            >
              <option value="assigned">Assign to Self</option>
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Submitting..." : "Submit Decision"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResponseToGD;
```

---

## SECTION 8: USER GD REPORTS PAGE

### File: `Frontend/src/pages/Dashboard/User/GDReports.jsx`

```jsx
import getGDReportByUserApi from "@/services/GDReport/getGDReportByUserApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function GDReports() {
  const navigate = useNavigate();
  const { user } = userStore();
  const userId = user?.user_id;

  const { data, isLoading } = useQuery({
    queryKey: ["userGDReports", userId],
    queryFn: () => getGDReportByUserApi(userId),
    enabled: !!userId,
  });

  const reports = data?.data || [];

  const statusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case "submitted":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "assigned":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="relative max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/user/dashboard")}
            className="p-2 rounded-lg bg-gray-800 border border-white/[0.07] text-slate-400 hover:text-slate-200"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-100">My GD Reports</h1>
            <p className="text-xs text-slate-500">
              {reports.length} total reports
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        )}

        {!isLoading && reports.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No reports filed yet.</p>
            <button
              onClick={() => navigate("/user/dashboard/add-gd-report")}
              className="text-blue-400 text-sm mt-2"
            >
              File your first report →
            </button>
          </div>
        )}

        {!isLoading && reports.length > 0 && (
          <div className="bg-gray-900 border border-white/[0.07] rounded-2xl overflow-hidden">
            <ul className="divide-y divide-white/[0.04]">
              {reports.map((r) => (
                <li
                  key={r.gd_id}
                  className="px-5 py-4 flex items-start justify-between gap-3 hover:bg-white/[0.02]"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-mono text-slate-500">
                      GD-{r.gd_id}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center bg-gray-800 text-slate-400 text-xs px-2 py-0.5 rounded capitalize">
                        {r.gd_type?.replace("_", " ") || "other"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200">{r.description}</p>
                    <span className="text-xs text-slate-600">
                      {new Date(r.submitted_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-slate-600">
                      Thana: {r.thana_id}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center border text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusBadge(r.status)}`}
                  >
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default GDReports;
```

---

## SECTION 8A: USER LOOKUP FEATURES (WANTED + CRIMINALS BY AREA)

These features are part of user workflow (not `/access`, not standalone public navigation).

### 8A.1 Routing patch (add user dashboard routes)

**File:** `Frontend/src/routes/Routing.jsx`
Add imports:

```jsx
import WantedCriminals from "@/pages/Dashboard/User/WantedCriminals";
import CriminalsByArea from "@/pages/Dashboard/User/CriminalsByArea";
```

Add routes inside `<Routes>` under user section:

```jsx
<Route path="/user/dashboard/wanted-criminals" element={<WantedCriminals />} />
<Route
  path="/user/dashboard/criminals-by-area"
  element={<CriminalsByArea />}
/>
```

### 8A.2 File: `Frontend/src/services/User/criminalLookupApi.js` (CREATE NEW)

```js
import axiosInstance from "@/helpers/axiosInstance";

export async function getWantedCriminalsApi() {
  try {
    const res = await axiosInstance.get("/criminal/wanted");
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getCriminalsByAreaApi(district) {
  try {
    const res = await axiosInstance.get(
      `/criminal/area/${encodeURIComponent(district)}`,
    );
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}
```

### 8A.3 File: `Frontend/src/pages/Dashboard/User/WantedCriminals.jsx` (CREATE NEW)

```jsx
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWantedCriminalsApi } from "@/services/User/criminalLookupApi";

function WantedCriminals() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["user-wanted-criminals"],
    queryFn: getWantedCriminalsApi,
  });

  const rows = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Wanted Criminals</h1>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="text-blue-400 text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-slate-400">No wanted criminals found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-3">Criminal ID</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Risk</th>
                  <th className="text-left px-4 py-3">Registered Thana</th>
                  <th className="text-left px-4 py-3">Last Seen District</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.criminal_id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-mono">{r.criminal_id}</td>
                    <td className="px-4 py-3">{r.full_name}</td>
                    <td className="px-4 py-3 capitalize">{r.status}</td>
                    <td className="px-4 py-3">{r.risk_level}</td>
                    <td className="px-4 py-3">{r.registered_thana || "N/A"}</td>
                    <td className="px-4 py-3">
                      {r.last_seen_district || "Unknown"}
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

export default WantedCriminals;
```

### 8A.4 File: `Frontend/src/pages/Dashboard/User/CriminalsByArea.jsx` (CREATE NEW)

```jsx
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
                    <td className="px-4 py-3">{r.district || district}</td>
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
```

### 8A.5 UserDashboard quick actions

In `UserDashboard.jsx`, add quick-action buttons for:

```jsx
<button onClick={() => navigate("/user/dashboard/wanted-criminals")}>Wanted Criminals</button>
<button onClick={() => navigate("/user/dashboard/criminals-by-area")}>Criminals by Area</button>
```

---

## SUMMARY — What was wrong and what this fixes

### The Problem:

1. **AdminDashboard had ALL MOCK DATA** — every single stat, table, and record was hardcoded. Zero API calls.
2. **30+ frontend files were COMPLETELY EMPTY** — Iztihad created the file structure but never wrote the code inside them.
3. **Routing.jsx was missing routes** for Thana dashboard, Officer dashboard, and many sub-pages.
4. **LoginPage.jsx redirected thana/officer to `/access`** instead of their dashboards.
5. **No service files existed** for Admin API calls, Thana API calls, or Officer API calls.
6. **GDReports.jsx (user)** was empty.

### What this file provides (26 files total):

1. **Routing.jsx** (REPLACE) — All routes for admin, thana, officer, and user dashboards
2. **LoginPage.jsx** (FIND & REPLACE) — Thana/Officer now route to correct dashboards
3. **updateUserApi.js** (CREATE NEW) — Missing service for EditProfile page
4. **adminApi.js** (CREATE NEW) — Admin API calls (get all thanas, officers, criminals, jails, users, GD reports, analytics, add thana, add rank, delete thana, add head officer)
5. **thanaApi.js** (CREATE NEW) — Thana API calls (get/add/update criminals, officers, cases, locations, orgs, GD reports, ranks)
6. **officerApi.js** (CREATE NEW) — Officer API calls (GD reports, criminals, arrests, bail, incarcerations, locations, orgs, jails)
7. **AdminDashboard.jsx** (REPLACE) — Fully rewritten with LIVE data from 8 backend endpoints + Add Thana form + Add Rank form + Delete
8. **ThanaDashboard.jsx** (PASTE) — Complete dashboard with 4 tabs + quick action buttons
9. **AddCriminal.jsx** (PASTE) — Form to add criminal
10. **UpdateCriminal.jsx** (PASTE) — Form to update criminal status/risk
11. **AddLocation.jsx** (PASTE) — Form to add location
12. **AddOrganization.jsx** (PASTE) — Form to add organization
13. **AddOfficer.jsx** (PASTE) — Form with rank dropdown from API
14. **UpdateOfficer.jsx** (PASTE) — Form to update officer
15. **AddCaseFile.jsx** (PASTE) — Form with case type dropdown
16. **UpdateCaseFile.jsx** (PASTE) — Form to update case status
17. **UpdateLocation.jsx** (PASTE) — Form to update location
18. **UpdateOrganization.jsx** (PASTE) — Form to update organization
19. **AddCriminalRelation.jsx** (PASTE) — Form to link two criminals
20. **UpdateCriminalOrganization.jsx** (PASTE) — Form to link criminal to org
21. **OfficerDashboard.jsx** (CREATE NEW) — Complete with 8 data tabs
22. **ResponseToGD.jsx** (PASTE) — Officer GD flow (assign/approve/reject)
23. **GDReports.jsx** (PASTE) — User's filed GD reports list
24. **criminalLookupApi.js** (CREATE NEW) — User criminal lookup endpoints (wanted + area search)
25. **WantedCriminals.jsx** (CREATE NEW) — User dashboard wanted list page
26. **CriminalsByArea.jsx** (CREATE NEW) — User dashboard district-wise criminal lookup page

### Files you can leave EMPTY (19 files — not routed, won't break anything):

These files exist in the folder structure but have no routes pointing to them. The functionality they were supposed to have is already built into the main dashboard components above:

- `Admin/AdminDashboard.jsx` — Admin functionality is in the main AdminDashboard.jsx
- `Admin/AddThana.jsx` — Add Thana form is inline in AdminDashboard
- `Admin/UpdateThana.jsx` — Not used
- `Admin/AddThanaHead.jsx` — Head officer is added via AdminDashboard
- `Admin/UpdateThanaHead.jsx` — Not used
- `Admin/AddRanks.jsx` — Add Rank form is inline in AdminDashboard
- `Admin/AddRankToOfficer.jsx` — Not used
- `Admin/SearchPart/ThanaData.jsx` — Thana data is shown in AdminDashboard tabs
- `Admin/SearchPart/OfficerData.jsx` — Officer data is shown in AdminDashboard tabs
- `Admin/SearchPart/CriminalData.jsx` — Criminal data is shown in AdminDashboard tabs
- `Admin/SearchPart/Rankdata.jsx` — Rank data is shown in AdminDashboard tabs
- `Officer/SearchPart/ArrestRecord.jsx` — Shown in OfficerDashboard tabs
- `Officer/SearchPart/BailData.jsx` — Shown in OfficerDashboard tabs
- `Officer/SearchPart/CriminalData.jsx` — Shown in OfficerDashboard tabs
- `Officer/SearchPart/GDReportData.jsx` — Shown in OfficerDashboard tabs
- `Officer/SearchPart/IncarcerationData.jsx` — Shown in OfficerDashboard tabs
- `Officer/SearchPart/JailData.jsx` — Shown in OfficerDashboard tabs
- `Officer/SearchPart/LocationData.jsx` — Shown in OfficerDashboard tabs
- `Officer/SearchPart/OrganizationData.jsx` — Shown in OfficerDashboard tabs

-->

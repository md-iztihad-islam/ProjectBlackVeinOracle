# 🔧 Frontend Developer Guide — Black Vein Oracle

> **For: Iztihad**  
> **By: Afnan (Backend Developer)**  
> **Project: Black Vein Oracle — PERN Stack Criminal Tracking System (Bangladesh)**

---

## PROJECT OVERVIEW

Black Vein Oracle is a criminal tracking and management system for Bangladesh law enforcement. The backend is **100% complete** — 175 API endpoints across 21 routers. Your job is to build the frontend pages that consume these endpoints.

### Tech Stack

| Layer    | Technology                                                                |
| -------- | ------------------------------------------------------------------------- |
| Backend  | Node.js + Express.js 5 + PostgreSQL (Supabase)                            |
| Frontend | React 19 + Vite 7 + TailwindCSS v4 + shadcn/ui + Zustand + TanStack Query |
| Auth     | JWT stored in HTTP-only cookies (backend sets them automatically)         |
| API Base | `http://localhost:6001/api/v1`                                            |
| Frontend | `http://localhost:5173` or `http://localhost:5174`                        |

### How Auth Works (Important!)

- Login endpoints return a JWT cookie automatically via `Set-Cookie` header
- Frontend uses `axios` with `withCredentials: true` — the cookie is sent on every request
- You do NOT manually handle tokens — the browser sends the cookie automatically
- The backend has middleware (`requireRole`) that reads the cookie and checks the user's role
- User state is stored in Zustand (`userStore`) and persisted in `localStorage` under key `user-storage`

### Existing Frontend Infrastructure (Already Written — DON'T touch)

These files already exist and work. You'll import from them:

| File                                                        | What it does                                                                                                               |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/helpers/axiosInstance.js`                              | Pre-configured axios with `baseURL: http://localhost:6001/api/v1` and `withCredentials: true`                              |
| `src/state/userStore.js`                                    | Zustand store — `{ user, setUser, clearUser }`. User object has: `user_id/admin_id/thana_id/officer_id`, `full_name`, etc. |
| `src/services/authServices/loginApi.js`                     | `adminLoginApi`, `thanaLoginApi`, `officerLoginApi`, `jailLoginApi` — POST login                                           |
| `src/services/authServices/signoutApi.js`                   | `adminSignoutApi`, `thanaSignoutApi`, `officerSignoutApi`, `jailSignoutApi`                                                |
| `src/services/registrationServices/registrationApi.js`      | `registerThana`, `registerOfficer`, `registerJail`                                                                         |
| `src/services/User/registerUserApi.js`                      | `registerUserApi` — POST `/user/add-user`                                                                                  |
| `src/services/User/signinUserApi.js`                        | `signinUserApi` — POST `/user/signin-user`                                                                                 |
| `src/services/User/signoutUserApi.js`                       | `signoutUserApi` — POST `/user/signout-user`                                                                               |
| `src/services/User/getUserApi.js`                           | `getUserApi` — GET `/user/get-user`                                                                                        |
| `src/services/GDReport/addGDReportApi.js`                   | `addGDReportApi` — POST `/gd-report/add-general-dairy`                                                                     |
| `src/services/GDReport/getGDReportByUserApi.js`             | `getGDReportByUserApi` — GET `/gd-report/get-general-dairies-by-user`                                                      |
| `src/services/Criminal/getCriminalsByThanaApi.js`           | `getCriminalsByThanaApi` — GET `/criminal/get-criminals-by-thana/:thanaId`                                                 |
| `src/pages/HomePage/HomePage.jsx`                           | Landing page                                                                                                               |
| `src/pages/AccessRedirectionPage/AccessRedirectionPage.jsx` | Role selection page (Admin/Thana/Officer/Jail cards)                                                                       |
| `src/pages/AccessRedirectionPage/LoginPage.jsx`             | Dynamic login page using `:userType` param                                                                                 |
| `src/pages/RegistrationPage/*`                              | Thana/Officer/Jail registration forms                                                                                      |
| `src/pages/NotFound/NotFound.jsx`                           | 404 page                                                                                                                   |
| `src/components/ui/*`                                       | shadcn/ui components (Button, Input, Card, etc.)                                                                           |

---

## PART 1: FILES YOU NEED TO CREATE / WRITE

Below is every file you need to implement, what it does, which endpoints it uses, and why those endpoints exist.

---

### 1.1 ROUTING — `src/routes/Routing.jsx`

**Action:** REPLACE the existing file content  
**What it does:** Defines all frontend routes using `react-router-dom`

The current Routing.jsx is **incomplete** — it only has admin, user, and registration routes. You need to add routes for Thana, Officer, and the missing user pages.

#### Complete Route Map:

| Route Path                           | Component                 | Who uses it                                        |
| ------------------------------------ | ------------------------- | -------------------------------------------------- |
| `/`                                  | `HomePage`                | Public — landing page                              |
| `/access`                            | `AccessRedirectionPage`   | Public — role selection (Admin/Thana/Officer/Jail) |
| `/access/login/:userType`            | `LoginPage`               | Public — dynamic login form                        |
| `/access/thana-register`             | `ThanaRegistrationPage`   | Public                                             |
| `/access/officer-register`           | `OfficerRegistrationPage` | Public                                             |
| `/access/jail-register`              | `JailRegistrationPage`    | Public                                             |
| `/admin/dashboard`                   | `AdminDashboard`          | Admin                                              |
| `/thana/dashboard`                   | `ThanaDashboard`          | Thana                                              |
| `/thana/add-criminal`                | `AddCriminal`             | Thana                                              |
| `/thana/update-criminal/:criminalId` | `UpdateCriminal`          | Thana                                              |
| `/thana/add-case-file`               | `AddCaseFile`             | Thana                                              |
| `/thana/update-case-file/:caseId`    | `UpdateCaseFile`          | Thana                                              |
| `/thana/add-officer`                 | `AddOfficer`              | Thana                                              |
| `/thana/update-officer/:officerId`   | `UpdateOfficer`           | Thana                                              |
| `/thana/add-location`                | `AddLocation`             | Thana                                              |
| `/thana/add-organization`            | `AddOrganization`         | Thana                                              |
| `/officer/dashboard`                 | `OfficerDashboard`        | Officer                                            |
| `/officer/respond-gd/:gdId`          | `ResponseToGD`            | Officer                                            |
| `/user-registration`                 | `RegisterUser`            | Public — user registration                         |
| `/user-signin`                       | `SigninUser`              | Public — user login                                |
| `/user/dashboard`                    | `UserDashboard`           | User                                               |
| `/user/dashboard/profile`            | `UserProfile`             | User                                               |
| `/user/dashboard/profile/edit`       | `EditProfile`             | User                                               |
| `/user/dashboard/add-gd-report`      | `AddGDReport`             | User                                               |
| `/user/dashboard/gd-reports`         | `GDReports`               | User                                               |
| `*`                                  | `NotFound`                | Catch-all 404                                      |

**Important:** `EditProfile` is currently commented out in the import. Uncomment it.

---

### 1.2 LOGIN PAGE FIX — `src/pages/AccessRedirectionPage/LoginPage.jsx`

**Action:** Find and replace ONE block (the `dashboardRoutes` object in the `onSuccess` callback)

**Current (broken):**

```js
const dashboardRoutes = {
  admin: "/admin/dashboard",
  thana: "/access", // ← WRONG
  officer: "/access", // ← WRONG
  jail: "/access",
};
```

**Must change to:**

```js
const dashboardRoutes = {
  admin: "/admin/dashboard",
  thana: "/thana/dashboard",
  officer: "/officer/dashboard",
  jail: "/admin/dashboard",
};
```

**Why:** After login, thana/officer were being redirected back to the access page instead of their dashboards.

---

## PART 2: NEW SERVICE FILES (API Layer)

These files go in `src/services/`. They wrap axios calls to backend endpoints. Every page imports from these.

---

### 2.1 `src/services/User/updateUserApi.js` (CREATE NEW)

**Purpose:** Lets users update their profile  
**Endpoint used:** `PUT /api/v1/user/update-user/:userId`  
**Why this endpoint exists:** Users need to edit their name, phone, email, address after registration

**Function to export:**
| Function | HTTP Method | Backend Endpoint | What it sends |
|---|---|---|---|
| `updateUserApi(userData)` | PUT | `/user/update-user/:userId` | `{ full_name, phone, email, address }` |

**Note:** The `userId` should come from `userData.user_id` or from Zustand store via localStorage.

---

### 2.2 `src/services/Admin/adminApi.js` (CREATE NEW)

**Purpose:** All API calls the Admin Dashboard needs  
**Why:** Admin oversees the entire system — manages thanas, views all officers/criminals/jails/users/GD reports, sees analytics

**Functions to export:**

| Function                     | HTTP   | Backend Endpoint                     | Purpose                                                                                  |
| ---------------------------- | ------ | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `getAllThanas()`             | GET    | `/thana/get-all-thanas`              | Admin sees list of all police stations                                                   |
| `getAllOfficers()`           | GET    | `/officer/get-officers`              | Admin sees all officers across all thanas                                                |
| `getAllCriminals()`          | GET    | `/criminal/get-criminals`            | Admin sees all registered criminals                                                      |
| `getAllRanks()`              | GET    | `/rank/get-all-ranks`                | Admin manages rank system                                                                |
| `getAllJails()`              | GET    | `/jail/get-jails`                    | Admin sees all correctional facilities                                                   |
| `getAllUsers()`              | GET    | `/user/get-users`                    | Admin sees all citizen users                                                             |
| `getAllGDReports()`          | GET    | `/gd-report/get-all-general-dairies` | Admin monitors all GD reports system-wide                                                |
| `getDashboardOverview()`     | GET    | `/analytics/dashboard-overview`      | Stats: total criminals, in_custody count, escaped count, wanted count, total cases, etc. |
| `addThana(data)`             | POST   | `/thana/add-thana`                   | Admin creates new police station                                                         |
| `updateThana(thanaId, data)` | PUT    | `/thana/update-thana/:thanaId`       | Admin edits police station info                                                          |
| `deleteThana(thanaId)`       | DELETE | `/thana/delete-thana/:thanaId`       | Admin removes police station                                                             |
| `addRank(data)`              | POST   | `/rank/add-rank`                     | Admin adds officer ranks (constable, SI, etc.)                                           |
| `addHeadOfficer(data)`       | POST   | `/thana/add-head-officer`            | Admin assigns a head officer to a thana                                                  |

---

### 2.3 `src/services/Thana/thanaApi.js` (CREATE NEW)

**Purpose:** All API calls the Thana Dashboard needs  
**Why:** A thana (police station) manages criminals, officers, case files, locations, organizations, and GD reports within their jurisdiction

**Functions to export:**

| Function                           | HTTP | Backend Endpoint                                   | Purpose                                                                                |
| ---------------------------------- | ---- | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `getCriminalsByThana(thanaId)`     | GET  | `/criminal/get-criminals-by-thana/:thanaId`        | Get criminals registered under this thana                                              |
| `addCriminal(data)`                | POST | `/criminal/add-criminal`                           | Register a new criminal (backend auto-sets `registered_thana_id` from the auth cookie) |
| `updateCriminal(criminalId, data)` | PUT  | `/criminal/update-criminal/:criminalId`            | Update criminal status/risk_level                                                      |
| `getOfficersByThana(thanaId)`      | GET  | `/officer/get-officers-by-thana/:thanaId`          | Get officers posted at this thana                                                      |
| `addOfficer(data)`                 | POST | `/officer/add-officer`                             | Register a new officer under this thana                                                |
| `updateOfficer(officerId, data)`   | PUT  | `/officer/update-officer/:officerId`               | Update officer details                                                                 |
| `getCaseFilesByThana(thanaId)`     | GET  | `/case-file/get-case-files-by-thana/:thanaId`      | Get case files for this thana                                                          |
| `addCaseFile(data)`                | POST | `/case-file/add-case-file`                         | Create a new case file                                                                 |
| `updateCaseFile(caseId, data)`     | PUT  | `/case-file/update-case-file/:caseId`              | Update case file details                                                               |
| `addLocation(data)`                | POST | `/location/add-location`                           | Add a location to the system (for criminal sightings)                                  |
| `addOrganization(data)`            | POST | `/organization/add-organization`                   | Add a criminal organization                                                            |
| `getGDReportsByThana(thanaId)`     | GET  | `/gd-report/get-general-dairies-by-thana/:thanaId` | Get GD reports filed at this thana                                                     |
| `getAllRanks()`                    | GET  | `/rank/get-all-ranks`                              | Needed when adding officers — to pick their rank                                       |

**Important fields for `addCriminal`:**

```
{ full_name, nid, status, risk_level }
```

- `status` must be one of: `unknown`, `wanted`, `in_custody`, `on_bail`, `released`, `escaped`
- `risk_level` must be 1-10
- `registered_thana_id` is auto-filled by backend from the logged-in thana's cookie

---

### 2.4 `src/services/Officer/officerApi.js` (CREATE NEW)

**Purpose:** All API calls the Officer Dashboard needs  
**Why:** Officers view GD reports, criminals, arrests, bail, incarcerations, locations, organizations, jails. They also assign/approve/reject GD reports.

**Functions to export:**

| Function                           | HTTP | Backend Endpoint                                   | Purpose                                |
| ---------------------------------- | ---- | -------------------------------------------------- | -------------------------------------- |
| `getGDReportsByThana(thanaId)`     | GET  | `/gd-report/get-general-dairies-by-thana/:thanaId` | Get GD reports for the officer's thana |
| `updateGDReportStatus(gdId, data)` | PUT  | `/gd-report/update-general-dairy-status/:gdId`     | Assign/Approve/Reject a GD report      |
| `getAllCriminals()`                | GET  | `/criminal/get-criminals`                          | Officer views all criminals            |
| `searchCriminals(query)`           | GET  | `/criminal/search-criminals?search=query`          | Search criminals by name or NID        |
| `getAllArrestRecords()`            | GET  | `/arrest-record/get-arrest-records`                | Officer views all arrest records       |
| `getAllBailRecords()`              | GET  | `/bail-record/get-bail-records`                    | Officer views all bail records         |
| `getAllIncarcerations()`           | GET  | `/incarceration/get-incarcerations`                | Officer views incarceration records    |
| `getAllLocations()`                | GET  | `/location/get-all-locations`                      | Officer views all locations            |
| `getAllOrganizations()`            | GET  | `/organization/get-all-organizations`              | Officer views criminal organizations   |
| `getAllJails()`                    | GET  | `/jail/get-jails`                                  | Officer views all jail facilities      |

**Important — GD Report Status Flow:**

```
submitted → assigned → approved
                    → rejected
```

- When assigning: send `{ status: "assigned", assigned_officer_id: "OFC-XXXXXXX" }`
- When approving: send `{ status: "approved", approved_by_officer_id: "OFC-XXXXXXX" }`
- When rejecting: send `{ status: "rejected", approved_by_officer_id: "OFC-XXXXXXX" }`

---

## PART 3: PAGE COMPONENTS

---

### 3.1 `src/pages/Dashboard/AdminDashboard.jsx` (REPLACE existing)

**Purpose:** Admin's main dashboard — overview stats, manage thanas/officers/criminals/ranks/jails/users/GD reports  
**Layout:** Tabbed interface with sections for each data type

**Endpoints used (via `adminApi.js`):**

- `getDashboardOverview()` → overview stats cards
- `getAllThanas()` → thana list tab
- `getAllOfficers()` → officers tab
- `getAllCriminals()` → criminals tab
- `getAllRanks()` → ranks tab
- `getAllJails()` → jails tab
- `getAllUsers()` → users tab
- `getAllGDReports()` → GD reports tab
- `addThana(data)` → add thana form
- `deleteThana(id)` → delete button on each thana row
- `addRank(data)` → add rank form
- `addHeadOfficer(data)` → assign head officer form

**Key behaviors:**

- Show stat cards at top: total criminals, in_custody, on_bail, escaped, wanted, high_risk, total thanas, total officers, total jails, total cases, open cases, total GD reports
- Each tab shows a table of that entity
- "Add Thana" button opens inline form
- "Add Rank" button opens inline form
- Delete button on thana rows
- Signout button calls `adminSignoutApi()` then `clearUser()` and navigates to `/`
- Use `useQuery` for data fetching, `useMutation` for create/delete operations
- `statusColor` helper function to color-code badges for criminal statuses (`in_custody`, `on_bail`, `wanted`, `escaped`, `released`, `unknown`) and GD statuses (`submitted`, `assigned`, `approved`, `rejected`)

---

### 3.2 `src/pages/Dashboard/Thana/ThanaDashboard.jsx` (PASTE INTO EMPTY)

**Purpose:** Thana's main dashboard — manage criminals, officers, cases, GD reports under their jurisdiction  
**Layout:** Tabbed interface (Criminals, Officers, Cases, GD Reports)

**Endpoints used (via `thanaApi.js`):**

- `getCriminalsByThana(thanaId)` — thanaId comes from `userStore.user.thana_id`
- `getOfficersByThana(thanaId)`
- `getCaseFilesByThana(thanaId)`
- `getGDReportsByThana(thanaId)`

**Key behaviors:**

- 4 tabs: Criminals, Officers, Cases, GD Reports
- Each tab shows a table with relevant data
- Criminals tab: "Add Criminal" button → navigates to `/thana/add-criminal`; each row has "Edit" → navigates to `/thana/update-criminal/:criminalId`
- Officers tab: "Add Officer" → `/thana/add-officer`; "Edit" → `/thana/update-officer/:officerId`
- Cases tab: "Add Case" → `/thana/add-case-file`; "Edit" → `/thana/update-case-file/:caseId`
- GD Reports tab: read-only table showing reports filed at this thana
- Signout button calls `thanaSignoutApi()`
- Status badges use same `statusColor` helper (covers both criminal AND GD statuses)

---

### 3.3 Thana Sub-Pages (all PASTE INTO EMPTY files)

#### `src/pages/Dashboard/Thana/CriminalPart/AddCriminal.jsx`

- Form to add a criminal
- Fields: `full_name` (text), `nid` (text), `status` (dropdown: unknown/wanted/in_custody/on_bail/released/escaped), `risk_level` (number 1-10)
- On submit: calls `addCriminal(formData)` from `thanaApi.js`
- On success: navigate back to `/thana/dashboard`
- **Endpoint:** `POST /criminal/add-criminal`

#### `src/pages/Dashboard/Thana/CriminalPart/UpdateCriminal.jsx`

- Form to update criminal's status and risk level
- Gets `criminalId` from URL params via `useParams()`
- Fields: `status` (dropdown: unknown/wanted/in_custody/on_bail/released/escaped), `risk_level` (number 1-10)
- On submit: calls `updateCriminal(criminalId, formData)` from `thanaApi.js`
- **Endpoint:** `PUT /criminal/update-criminal/:criminalId`

#### `src/pages/Dashboard/Thana/CaseFilePart/AddCaseFile.jsx`

- Form to create a case file
- Fields: `case_number` (text), `criminal_id` (text — ID of the criminal), `case_type` (text), `status` (dropdown: open/closed/under_investigation), `description` (textarea)
- `thana_id` is auto-filled from logged-in thana — send it in the body
- On submit: calls `addCaseFile(formData)` from `thanaApi.js`
- **Endpoint:** `POST /case-file/add-case-file`

#### `src/pages/Dashboard/Thana/CaseFilePart/UpdateCaseFile.jsx`

- Form to update a case file
- Gets `caseId` from URL params
- Fields: same as AddCaseFile
- On submit: calls `updateCaseFile(caseId, formData)` from `thanaApi.js`
- **Endpoint:** `PUT /case-file/update-case-file/:caseId`

#### `src/pages/Dashboard/Thana/OfficerPart/AddOfficer.jsx`

- Form to register a new officer under this thana
- Fields: `badge_no` (text), `full_name` (text), `rank_code` (dropdown — fetch from `getAllRanks()`), `phone` (text), `email` (text), `password` (text)
- `thana_id` is auto-filled from logged-in thana
- On submit: calls `addOfficer(formData)` from `thanaApi.js`
- **Endpoint:** `POST /officer/add-officer`
- **Also uses:** `GET /rank/get-all-ranks` to populate rank dropdown

#### `src/pages/Dashboard/Thana/OfficerPart/UpdateOfficer.jsx`

- Form to update officer details
- Gets `officerId` from URL params
- Fields: `badge_no`, `full_name`, `rank_code`, `phone`, `email`
- On submit: calls `updateOfficer(officerId, formData)` from `thanaApi.js`
- **Endpoint:** `PUT /officer/update-officer/:officerId`

#### `src/pages/Dashboard/Thana/CriminalPart/AddLocation.jsx`

- Form to add a location to the system
- Fields: `district` (text), `address` (text), `zone` (text)
- On submit: calls `addLocation(formData)` from `thanaApi.js`
- **Endpoint:** `POST /location/add-location`

#### `src/pages/Dashboard/Thana/CriminalPart/AddOrganization.jsx`

- Form to add a criminal organization
- Fields: `name` (text), `ideology` (text), `threat_level` (number 1-10)
- On submit: calls `addOrganization(formData)` from `thanaApi.js`
- **Endpoint:** `POST /organization/add-organization`

---

### 3.4 `src/pages/Dashboard/Officer/OfficerDashboard.jsx` (CREATE NEW — folder exists but file doesn't)

**Purpose:** Officer's main dashboard — view GD reports, criminals, arrests, bail, incarcerations, locations, organizations, jails  
**Layout:** Tabbed interface with 8+ tabs

**Endpoints used (via `officerApi.js`):**

- `getGDReportsByThana(thanaId)` — thanaId from `userStore.user.thana_id`
- `getAllCriminals()`
- `getAllArrestRecords()`
- `getAllBailRecords()`
- `getAllIncarcerations()`
- `getAllLocations()`
- `getAllOrganizations()`
- `getAllJails()`

**Key behaviors:**

- Tabs: GD Reports, Criminals, Arrests, Bail, Incarcerations, Locations, Organizations, Jails
- GD Reports tab: each report row has a "Respond" button → navigates to `/officer/respond-gd/:gdId`
- Other tabs: read-only tables showing data
- Signout button calls `officerSignoutApi()`
- Status badges for both criminal and GD statuses

---

### 3.5 `src/pages/Dashboard/Officer/GDPart/ResponseToGD.jsx` (PASTE INTO EMPTY)

**Purpose:** Officer views a single GD report and can assign/approve/reject it  
**Gets `gdId` from URL params**

**Endpoints used (via `officerApi.js`):**

- `getGDReportsByThana(thanaId)` — to find the specific GD report from the list
- `updateGDReportStatus(gdId, data)` — to update status

**Key behaviors:**

- Show GD report details (description, gd_type, user info, current status, incident_date, incident_location)
- Dropdown to select new status: `assigned`, `approved`, `rejected`
- When status is `assigned`: also send `assigned_officer_id` (the logged-in officer's ID from userStore)
- When status is `approved` or `rejected`: also send `approved_by_officer_id`
- On submit: calls `updateGDReportStatus(gdId, { status, assigned_officer_id?, approved_by_officer_id? })`
- On success: navigate back to `/officer/dashboard`

**GD Report `gd_type` values (for display):**
`theft`, `lost_document`, `missing_person`, `accident`, `assault`, `robbery`, `fraud`, `domestic_violence`, `property_dispute`, `suspicious_activity`, `threat`, `noise_disturbance`, `other`

---

### 3.6 User Pages (some need PASTE, some need REPLACE)

#### `src/pages/Dashboard/User/GDReports.jsx` (PASTE INTO EMPTY)

**Purpose:** User views all their filed GD reports  
**Endpoint:** `GET /gd-report/get-general-dairies-by-user` (via existing `getGDReportByUserApi`)

**Key behaviors:**

- Fetch user's GD reports on mount
- Display table with columns: GD Type, Description, Status, Submitted At
- Status badges colored: submitted (blue), assigned (yellow), approved (green), rejected (red)
- "File New GD" button → navigates to `/user/dashboard/add-gd-report`

#### `src/pages/Dashboard/User/EditProfile.jsx` (PASTE INTO EMPTY)

**Purpose:** User edits their profile  
**Endpoint:** `PUT /user/update-user/:userId` (via `updateUserApi` from `services/User/updateUserApi.js`)

**Key behaviors:**

- Pre-fill form with current user data from Zustand store
- Fields: `full_name`, `phone`, `email`, `address`
- On submit: calls `updateUserApi(formData)`
- On success: update Zustand store and navigate back to `/user/dashboard/profile`

---

### 3.7 Additional Thana Sub-Pages (PASTE INTO EMPTY — these are supplementary CRUD pages)

These files exist on disk as empty files. They provide additional management capabilities:

#### `src/pages/Dashboard/Thana/CriminalPart/UpdateLocation.jsx`

- Form to update an existing location
- **Endpoint:** `PUT /location/update-location/:locationId`
- Fields: `district`, `address`, `zone`

#### `src/pages/Dashboard/Thana/CriminalPart/UpdateOrganization.jsx`

- Form to update an existing organization
- **Endpoint:** `PUT /organization/update-organization/:orgId`
- Fields: `name`, `ideology`, `threat_level`

#### `src/pages/Dashboard/Thana/CriminalPart/AddCriminalRelation.jsx`

- Form to link two criminals as related
- **Endpoint:** `POST /criminal-relation/add-relation`
- Fields: `criminal_id_1`, `criminal_id_2`, `relation_type` (dropdown: associate/family/financial/accomplice)

#### `src/pages/Dashboard/Thana/CriminalPart/UpdateCriminalOrganization.jsx`

- Form to link a criminal to an organization (or update their role)
- **Endpoint for adding:** `POST /criminal-organization/add-link`
- **Endpoint for updating:** `PUT /criminal-organization/update-link/:criminalId/:orgId`
- Fields: `criminal_id`, `org_id`, `role` (text — their role in the organization)

**Note:** These 4 pages are NOT currently routed in Routing.jsx. If you want to use them, either:

- Add routes for them, OR
- Build them as modal/inline forms within ThanaDashboard

---

## PART 4: EMPTY FILES YOU CAN IGNORE

These files exist on disk but are empty. Nothing imports them. They cause ZERO errors. Leave them as-is unless you want to build them out:

**Admin sub-pages** (the AdminDashboard handles everything inline instead):

- `Admin/AdminDashboard.jsx` (in the Admin subfolder — NOT the same as the root `AdminDashboard.jsx`)
- `Admin/AddThana.jsx`, `Admin/UpdateThana.jsx`
- `Admin/AddThanaHead.jsx`, `Admin/UpdateThanaHead.jsx`
- `Admin/AddRanks.jsx`, `Admin/AddRankToOfficer.jsx`
- `Admin/SearchPart/ThanaData.jsx`, `Admin/SearchPart/OfficerData.jsx`
- `Admin/SearchPart/CriminalData.jsx`, `Admin/SearchPart/Rankdata.jsx`

**Officer search sub-pages** (OfficerDashboard shows data inline instead):

- `Officer/SearchPart/ArrestRecord.jsx`
- `Officer/SearchPart/BailData.jsx`
- `Officer/SearchPart/CriminalData.jsx`
- `Officer/SearchPart/GDReportData.jsx`
- `Officer/SearchPart/IncarcerationData.jsx`
- `Officer/SearchPart/JailData.jsx`
- `Officer/SearchPart/LocationData.jsx`
- `Officer/SearchPart/OrganizationData.jsx`

---

## PART 5: COMPLETE BACKEND ENDPOINT REFERENCE

All endpoints are prefixed with `/api/v1/`. Auth cookie is sent automatically.

### 5.1 Admin (`/admin`)

| Method | Endpoint                 | Auth       | Purpose                      |
| ------ | ------------------------ | ---------- | ---------------------------- |
| POST   | `/add-admin`             | None       | Create admin account         |
| POST   | `/signin-admin`          | None       | Admin login → sets cookie    |
| POST   | `/signout-admin`         | Cookie     | Admin logout → clears cookie |
| GET    | `/get-admin`             | Admin only | Get logged-in admin profile  |
| GET    | `/get-admins`            | Admin only | Get all admins               |
| PUT    | `/update-admin/:adminId` | Admin only | Update admin details         |
| DELETE | `/delete-admin/:adminId` | Admin only | Delete admin                 |

### 5.2 User (`/user`)

| Method | Endpoint               | Auth       | Purpose                    |
| ------ | ---------------------- | ---------- | -------------------------- |
| POST   | `/add-user`            | None       | User registration          |
| POST   | `/signin-user`         | None       | User login → sets cookie   |
| POST   | `/signout-user`        | Cookie     | User logout                |
| GET    | `/get-user`            | Cookie     | Get logged-in user profile |
| GET    | `/get-users`           | Admin only | Admin gets all users       |
| PUT    | `/update-user/:userId` | Cookie     | User updates own profile   |
| DELETE | `/delete-user/:userId` | Admin only | Admin deletes user         |

### 5.3 Thana (`/thana`)

| Method | Endpoint                            | Auth        | Purpose                                                        |
| ------ | ----------------------------------- | ----------- | -------------------------------------------------------------- |
| POST   | `/add-thana`                        | Admin only  | Admin creates police station                                   |
| POST   | `/signin-thana`                     | None        | Thana login                                                    |
| POST   | `/signout-thana`                    | Cookie      | Thana logout                                                   |
| POST   | `/add-head-officer`                 | Admin only  | Assign head officer to thana                                   |
| GET    | `/get-all-thanas`                   | Admin+User  | List all thanas (users need this to pick thana when filing GD) |
| GET    | `/get-thanas-by-district/:district` | Admin+User  | Get thanas in a district                                       |
| GET    | `/get-thana-by-id/:thanaId`         | Admin+Thana | Get single thana details                                       |
| PUT    | `/update-thana/:thanaId`            | Admin only  | Update thana info                                              |
| DELETE | `/delete-thana/:thanaId`            | Admin only  | Delete thana                                                   |

### 5.4 Officer (`/officer`)

| Method | Endpoint                          | Auth        | Purpose                       |
| ------ | --------------------------------- | ----------- | ----------------------------- |
| POST   | `/add-officer`                    | Admin+Thana | Register new officer          |
| POST   | `/signin-officer`                 | None        | Officer login                 |
| POST   | `/signout-officer`                | Cookie      | Officer logout                |
| GET    | `/get-officers`                   | Admin+Thana | List all officers             |
| GET    | `/get-officer-by-id/:officerId`   | Admin+Thana | Single officer details        |
| GET    | `/get-officers-by-thana/:thanaId` | Admin+Thana | Officers at a specific thana  |
| PUT    | `/update-officer/:officerId`      | Admin+Thana | Update officer                |
| DELETE | `/delete-officer/:officerId`      | Admin only  | Delete officer                |
| GET    | `/search-officers`                | Admin+Thana | Search officers by name/badge |

### 5.5 GD Report (`/gd-report`)

| Method | Endpoint                                 | Auth                | Purpose                          |
| ------ | ---------------------------------------- | ------------------- | -------------------------------- |
| POST   | `/add-general-dairy`                     | User only           | User files a GD report           |
| GET    | `/get-general-dairies-by-user`           | User only           | User sees their own GD reports   |
| GET    | `/get-general-dairy-by-id/:dairyId`      | Cookie              | Get single GD report details     |
| PUT    | `/update-general-dairy-status/:dairyId`  | Officer             | Officer assigns/approves/rejects |
| GET    | `/get-all-general-dairies`               | Admin               | Admin sees all GD reports        |
| GET    | `/get-general-dairies-by-thana/:thanaId` | Admin+Thana+Officer | GD reports for a specific thana  |
| DELETE | `/delete-general-dairy/:dairyId`         | Admin               | Admin deletes GD report          |

**GD Report Status Flow:**

```
User files → status = "submitted"
Officer assigns → status = "assigned" (sets assigned_officer_id)
Officer approves → status = "approved" (sets approved_by_officer_id)
Officer rejects → status = "rejected" (sets approved_by_officer_id)
```

**GD Type values:** `theft`, `lost_document`, `missing_person`, `accident`, `assault`, `robbery`, `fraud`, `domestic_violence`, `property_dispute`, `suspicious_activity`, `threat`, `noise_disturbance`, `other`

### 5.6 Criminal (`/criminal`)

| Method | Endpoint                           | Auth        | Purpose                                                       |
| ------ | ---------------------------------- | ----------- | ------------------------------------------------------------- |
| POST   | `/add-criminal`                    | Thana only  | Register criminal (auto-sets registered_thana_id from cookie) |
| GET    | `/get-criminals`                   | Admin+Thana | List all criminals                                            |
| GET    | `/get-criminal-by-id/:criminalId`  | Admin+Thana | Single criminal with org and arrest info                      |
| GET    | `/get-criminals-by-thana/:thanaId` | Admin+Thana | Criminals under a thana                                       |
| GET    | `/profile/:id`                     | Admin+Thana | Full criminal profile (view, cases, arrests, orgs)            |
| GET    | `/timeline/:id`                    | Admin+Thana | Criminal timeline (arrests, cases, incarcerations, sightings) |
| PUT    | `/recalculate-risk/:id`            | Admin+Thana | Recalculate risk level based on history                       |
| PUT    | `/update-criminal/:criminalId`     | Admin+Thana | Update criminal status/risk_level                             |
| DELETE | `/delete-criminal/:criminalId`     | Admin+Thana | Delete criminal                                               |
| GET    | `/get-criminals-by-status/:status` | Admin+Thana | Filter by status                                              |
| GET    | `/search-criminals?search=term`    | Public      | Search by name or NID                                         |
| GET    | `/wanted`                          | Public      | Get wanted + escaped criminals (for public safety page)       |
| GET    | `/area/:district`                  | Public      | Get criminals spotted in a district                           |

**Criminal status values:** `unknown`, `wanted`, `in_custody`, `on_bail`, `released`, `escaped`  
**Risk level:** Integer 1-10

### 5.7 Rank (`/rank`)

| Method | Endpoint               | Auth       | Purpose        |
| ------ | ---------------------- | ---------- | -------------- |
| POST   | `/add-rank`            | Admin only | Add new rank   |
| GET    | `/get-all-ranks`       | Cookie     | List all ranks |
| GET    | `/get-rank/:rankCode`  | Cookie     | Single rank    |
| PUT    | `/update-rank/:rankId` | Admin only | Update rank    |
| DELETE | `/delete-rank/:rankId` | Admin only | Delete rank    |

### 5.8 Jail (`/jail`)

| Method | Endpoint                           | Auth       | Purpose              |
| ------ | ---------------------------------- | ---------- | -------------------- |
| POST   | `/add-jail`                        | Admin only | Register new jail    |
| POST   | `/signin-jail`                     | None       | Jail login           |
| POST   | `/signout-jail`                    | Cookie     | Jail logout          |
| GET    | `/get-jails`                       | Admin+Jail | List all jails       |
| GET    | `/get-jail-by-id/:jailId`          | Admin+Jail | Single jail          |
| GET    | `/get-jails-by-district/:district` | Admin+Jail | Jails in a district  |
| GET    | `/get-jail-occupancy/:jailId`      | Admin+Jail | Jail occupancy stats |
| GET    | `/get-jail-inmates/:jailId`        | Admin+Jail | Current inmates      |
| PUT    | `/update-jail/:jailId`             | Admin+Jail | Update jail details  |
| DELETE | `/delete-jail/:jailId`             | Admin only | Delete jail          |

### 5.9 Case File (`/case-file`)

| Method | Endpoint                                  | Auth   | Purpose                |
| ------ | ----------------------------------------- | ------ | ---------------------- |
| POST   | `/add-case-file`                          | Cookie | Create case file       |
| GET    | `/get-case-files`                         | None   | List all case files    |
| GET    | `/get-case-file-by-id/:caseId`            | None   | Single case file       |
| GET    | `/get-case-files-by-thana/:thanaId`       | None   | Case files for a thana |
| GET    | `/get-case-files-by-criminal/:criminalId` | None   | Cases for a criminal   |
| PUT    | `/update-case-file/:caseId`               | Cookie | Update case file       |
| DELETE | `/delete-case-file/:caseId`               | Cookie | Delete case file       |

**Case status values:** `open`, `closed`, `under_investigation`

### 5.10 Location (`/location`)

| Method | Endpoint                               | Auth   | Purpose                 |
| ------ | -------------------------------------- | ------ | ----------------------- |
| POST   | `/add-location`                        | Cookie | Add location            |
| GET    | `/get-all-locations`                   | Cookie | List all locations      |
| GET    | `/get-location-by-id/:locationId`      | Cookie | Single location         |
| PUT    | `/update-location/:locationId`         | Cookie | Update location         |
| DELETE | `/delete-location/:locationId`         | Cookie | Delete location         |
| GET    | `/get-locations-by-district/:district` | Cookie | Locations in a district |

### 5.11 Organization (`/organization`)

| Method | Endpoint                            | Auth   | Purpose                   |
| ------ | ----------------------------------- | ------ | ------------------------- |
| POST   | `/add-organization`                 | Cookie | Add criminal organization |
| GET    | `/get-all-organizations`            | Cookie | List all organizations    |
| GET    | `/get-organization-by-id/:orgId`    | Cookie | Single org                |
| PUT    | `/update-organization/:orgId`       | Cookie | Update org                |
| DELETE | `/delete-organization/:orgId`       | Cookie | Delete org                |
| GET    | `/search-organizations?search=term` | Cookie | Search orgs               |

### 5.12 Arrest Record (`/arrest-record`)

| Method | Endpoint                                      | Auth   | Purpose                |
| ------ | --------------------------------------------- | ------ | ---------------------- |
| POST   | `/add-arrest-record`                          | Cookie | Record an arrest       |
| GET    | `/get-arrest-records`                         | None   | List all arrests       |
| GET    | `/get-arrest-record-by-id/:arrestId`          | None   | Single arrest          |
| GET    | `/get-arrest-records-by-thana/:thanaId`       | None   | Arrests at a thana     |
| GET    | `/get-arrest-records-by-criminal/:criminalId` | None   | Arrests for a criminal |
| PUT    | `/update-arrest-record/:arrestId`             | Cookie | Update arrest          |
| DELETE | `/delete-arrest-record/:arrestId`             | Cookie | Delete arrest          |

**Custody status values:** `in_custody`, `on_bail`, `released`, `transferred`

### 5.13 Bail Record (`/bail-record`)

| Method | Endpoint                                    | Auth   | Purpose                                          |
| ------ | ------------------------------------------- | ------ | ------------------------------------------------ |
| POST   | `/add-bail-record`                          | Cookie | File bail application                            |
| GET    | `/get-bail-records`                         | None   | List all bail records                            |
| GET    | `/get-bail-record-by-id/:bailId`            | None   | Single bail record                               |
| GET    | `/get-bail-records-by-arrest/:arrestId`     | None   | Bail records for an arrest                       |
| GET    | `/get-bail-records-by-criminal/:criminalId` | None   | Bail records for a criminal                      |
| PUT    | `/update-bail-record/:bailId`               | Cookie | Update bail record                               |
| DELETE | `/delete-bail-record/:bailId`               | Cookie | Delete bail record                               |
| POST   | `/process-decision`                         | Cookie | Grant or reject bail (triggers stored procedure) |

**Bail status values:** `pending`, `granted`, `rejected`

### 5.14 Incarceration (`/incarceration`)

| Method | Endpoint                                      | Auth   | Purpose                              |
| ------ | --------------------------------------------- | ------ | ------------------------------------ |
| POST   | `/add-incarceration`                          | Cookie | Admit criminal to jail               |
| GET    | `/get-incarcerations`                         | None   | List all incarcerations              |
| GET    | `/get-incarceration-by-id/:incId`             | None   | Single incarceration                 |
| GET    | `/get-incarcerations-by-jail/:jailId`         | None   | Inmates at a jail                    |
| GET    | `/get-incarcerations-by-criminal/:criminalId` | None   | Incarceration history for a criminal |
| PUT    | `/update-incarceration/:incarcerationId`      | Cookie | Update incarceration                 |
| PUT    | `/release-incarceration/:incarcerationId`     | Cookie | Release inmate (sets released_at)    |
| DELETE | `/delete-incarceration/:incId`                | Cookie | Delete incarceration                 |
| GET    | `/find-cell/:jailId`                          | Cookie | Find best available cell in a jail   |
| POST   | `/transfer`                                   | Cookie | Transfer criminal between jails      |
| GET    | `/transfers/:criminalId`                      | Cookie | Transfer history for a criminal      |

### 5.15 Cell Block (`/cell-block`)

| Method | Endpoint                           | Auth   | Purpose                |
| ------ | ---------------------------------- | ------ | ---------------------- |
| POST   | `/add-cell-block`                  | Cookie | Add cell block to jail |
| GET    | `/get-cell-blocks`                 | None   | List all cell blocks   |
| GET    | `/get-cell-block-by-id/:blockId`   | None   | Single cell block      |
| GET    | `/get-cell-blocks-by-jail/:jailId` | None   | Cell blocks in a jail  |
| PUT    | `/update-cell-block/:blockId`      | Cookie | Update cell block      |
| DELETE | `/delete-cell-block/:blockId`      | Cookie | Delete cell block      |

### 5.16 Cell (`/cell`)

| Method | Endpoint                               | Auth   | Purpose                   |
| ------ | -------------------------------------- | ------ | ------------------------- |
| POST   | `/add-cell`                            | Cookie | Add cell to a block       |
| GET    | `/get-cells`                           | None   | List all cells            |
| GET    | `/get-cell-by-id/:cellId`              | None   | Single cell               |
| GET    | `/get-cells-by-block/:blockId`         | None   | Cells in a block          |
| GET    | `/get-available-cells-by-jail/:jailId` | None   | Available cells in a jail |
| PUT    | `/update-cell/:cellId`                 | Cookie | Update cell               |
| DELETE | `/delete-cell/:cellId`                 | Cookie | Delete cell               |

### 5.17 Criminal-Organization (`/criminal-organization`)

| Method | Endpoint                          | Auth   | Purpose                    |
| ------ | --------------------------------- | ------ | -------------------------- |
| POST   | `/add-link`                       | Cookie | Link criminal to org       |
| GET    | `/get-by-criminal/:criminalId`    | None   | Orgs a criminal belongs to |
| GET    | `/get-by-organization/:orgId`     | None   | Criminals in an org        |
| GET    | `/get-all-links`                  | None   | All criminal-org links     |
| PUT    | `/update-link/:criminalId/:orgId` | Cookie | Update link (role)         |
| DELETE | `/delete-link/:criminalId/:orgId` | Cookie | Remove link                |

### 5.18 Criminal-Relation (`/criminal-relation`)

| Method | Endpoint                       | Auth   | Purpose                  |
| ------ | ------------------------------ | ------ | ------------------------ |
| POST   | `/add-relation`                | Cookie | Link two criminals       |
| GET    | `/get-by-criminal/:criminalId` | None   | Relations for a criminal |
| GET    | `/get-all-relations`           | None   | All criminal relations   |
| PUT    | `/update-relation/:relationId` | Cookie | Update relation          |
| DELETE | `/delete-relation/:relationId` | Cookie | Remove relation          |

**Relation types:** `associate`, `family`, `financial`, `accomplice`

### 5.19 Criminal-Location (`/criminal-location`)

| Method | Endpoint                       | Auth   | Purpose                                |
| ------ | ------------------------------ | ------ | -------------------------------------- |
| POST   | `/add-criminal-location`       | Cookie | Record criminal sighting at a location |
| GET    | `/get-by-criminal/:criminalId` | None   | Location history of a criminal         |
| GET    | `/get-by-location/:locationId` | None   | Criminals spotted at a location        |
| GET    | `/get-all-criminal-locations`  | None   | All sighting records                   |
| DELETE | `/delete/:criminalLocationId`  | Cookie | Delete sighting record                 |

### 5.20 Analytics (`/analytics`)

| Method | Endpoint                                 | Auth        | Purpose                               |
| ------ | ---------------------------------------- | ----------- | ------------------------------------- |
| GET    | `/dashboard-overview`                    | Admin+Thana | Overall system stats                  |
| GET    | `/criminal-full-profile/:criminalId`     | Admin+Thana | Complete criminal dossier             |
| GET    | `/high-risk-network`                     | Admin+Thana | High-risk criminal network analysis   |
| GET    | `/gd-report-analytics`                   | Admin+Thana | GD report statistics                  |
| GET    | `/bail-statistics`                       | Admin+Thana | Bail success/rejection rates          |
| GET    | `/criminal-movement-history/:criminalId` | Admin+Thana | Movement tracking                     |
| GET    | `/organization-threat-analysis`          | Admin+Thana | Org threat levels                     |
| GET    | `/custody-overview`                      | None        | Criminal count by custody status      |
| GET    | `/inmates-due-for-bail`                  | None        | Inmates approaching bail dates        |
| GET    | `/cell-occupancy-details/:jailId`        | None        | Cell-level occupancy                  |
| GET    | `/criminals-above-avg-cases`             | Admin+Thana | Criminals with above-average cases    |
| GET    | `/criminal-ranking`                      | Admin+Thana | Criminals ranked by risk              |
| GET    | `/free-org-members`                      | Admin+Thana | Org members not in custody            |
| GET    | `/monthly-arrest-trend`                  | Admin+Thana | Arrest trends by month                |
| GET    | `/thana-performance`                     | Admin+Thana | Thana performance metrics             |
| GET    | `/jail-occupancy-detail`                 | Admin+Thana | All jails occupancy                   |
| GET    | `/officer-workload`                      | Admin+Thana | Officer workload distribution         |
| GET    | `/district-crime-stats`                  | Admin+Thana | Crime stats by district               |
| GET    | `/audit-logs`                            | Admin+Thana | System audit trail                    |
| POST   | `/recalculate-all-risks`                 | Admin+Thana | Bulk recalculate criminal risk scores |

### 5.21 Notification (`/notification`)

| Method | Endpoint            | Auth   | Purpose                            |
| ------ | ------------------- | ------ | ---------------------------------- |
| GET    | `/my-notifications` | Cookie | Get logged-in user's notifications |
| GET    | `/unread-count`     | Cookie | Count of unread notifications      |
| PUT    | `/read/:id`         | Cookie | Mark one notification as read      |
| PUT    | `/read-all`         | Cookie | Mark all notifications as read     |

---

## PART 6: DATABASE SCHEMA REFERENCE (Key Tables)

You don't need to touch the database, but knowing the column names helps you build forms correctly.

### criminal

`criminal_id` (auto), `full_name`, `nid`, `status`, `risk_level`, `registered_thana_id`

### gd_report

`gd_id` (auto), `user_id`, `thana_id`, `gd_type`, `description`, `incident_date`, `incident_location`, `status`, `approved_by_officer_id`, `assigned_officer_id`, `submitted_at`

### officer

`officer_id` (auto), `badge_no`, `full_name`, `rank_code`, `thana_id`, `phone`, `email`, `image_url`, `password`

### case_file

`case_id` (auto), `case_number`, `criminal_id`, `thana_id`, `case_type`, `status`, `filed_at`, `description`

### arrest_record

`arrest_id` (auto), `criminal_id`, `arrest_date`, `bail_due_date`, `custody_status`, `thana_id`, `case_reference`

### bail_record

`bail_id` (auto), `arrest_id`, `court_name`, `bail_amount`, `granted_at`, `surety_name`, `status`

### incarceration

`incarceration_id` (auto), `jail_id`, `arrest_id`, `cell_id`, `admitted_at`, `released_at`

### location

`location_id` (auto), `district`, `address`, `zone`

### organization

`org_id` (auto), `name`, `ideology`, `threat_level`, `created_at`

### thana

`thana_id` (auto), `thana_name`, `district`, `zone`, `address`, `phone`, `email`, `password`, `created_by_admin_id`, `head_officer_id`

### jail

`jail_id` (auto), `jail_name`, `district`, `zone`, `address`, `capacity`, `email`, `password`

### user

`user_id` (auto), `full_name`, `nid_number`, `phone`, `email`, `address`, `password`

---

## PART 7: DESIGN GUIDELINES

- **Theme:** Dark mode (gray-950 backgrounds, slate-200 text)
- **UI Library:** shadcn/ui components (`Button`, `Input`, `Card` etc.) + raw TailwindCSS
- **Icons:** lucide-react
- **Data fetching:** TanStack Query (`useQuery` for GET, `useMutation` for POST/PUT/DELETE)
- **State:** Zustand (`userStore` — has `user`, `setUser`, `clearUser`)
- **Routing:** react-router-dom v7 (`useNavigate`, `useParams`, `Link`)
- **Forms:** Controlled components with `useState`
- **Notifications:** Simple `alert()` for success/error (can upgrade later)
- **Status badges:** Use a helper like:

```js
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
```

---

## PART 8: HOW TO RUN

1. `cd Frontend`
2. `npm install` (already done if node_modules exists)
3. `npm run dev` — starts on `http://localhost:5173`
4. Backend must be running on port 6001: `cd Backend && npm start`

---

## PART 9: ACCESS ARCHITECTURE — SEPARATE USER ENTRY POINT

### Why Users Don't Appear on the Main Access Page

The system has two separate entry points:

**1. Authority Portal** → `http://localhost:5173/access`

- This is the `AccessRedirectionPage` — shows 4 cards: Admin, Thana, Officer, Jail
- Clicking a card goes to `/access/login/:userType` (dynamic login form)
- This page is for **government/law enforcement staff only**
- Regular citizens should NOT see admin/thana/officer login options

**2. User Portal** → `http://localhost:5173/user-signin`

- This is the `SigninUser` page — a completely separate login form
- This page is for **regular citizens** who want to file GD reports
- Registration is at `/user-registration`

### Why This Design?

In real life, a citizen visiting a police system should NOT see buttons to log in as "Admin" or "Officer". Those are separate, restricted portals. The citizen only needs:

- A way to register → `/user-registration`
- A way to sign in → `/user-signin`
- Their dashboard → `/user/dashboard`
- File GD reports → `/user/dashboard/add-gd-report`
- View their GD reports → `/user/dashboard/gd-reports`

The main `/access` page is like an internal portal that only authorized personnel know about or have bookmarked.

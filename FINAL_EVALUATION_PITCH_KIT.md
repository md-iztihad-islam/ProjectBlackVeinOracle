# BLACK VEIN ORACLE — Final Evaluation Pitch Kit

## 0) 30-Second Opening (Memorize This)

**Black Vein Oracle is a national-level public safety operating platform, not just a CRUD app.**  
It connects citizen reporting, police thana operations, officer workload, criminal intelligence, custody workflows, bail decisions, incarceration transfers, jail cell management, analytics, and alerting in one integrated system.

---

## 1) Purpose of the Project (Slide-ready)

- Digitize fragmented law-enforcement workflows into one operational system.
- Reduce delay between report, investigation, arrest, custody, transfer, and monitoring.
- Give role-specific visibility:
  - **User**: file GD, track status, receive updates, view wanted/public safety data.
  - **Thana**: manage officers, criminals, cases, GD processing, transfers, links/relations.
  - **Officer**: execute assignments and workflow actions.
  - **Jail**: cell-block/cell management and incarceration operations.
  - **Admin**: governance, provisioning, cross-system analytics, oversight, notifications.

---

## 2) Why This Is Bigger than “E-commerce” or “Messenger” (Use this argument)

This project combines complexity from **multiple system types at once**:

1. **Identity + multi-role access control** (5+ roles, protected routes, role-level restrictions).
2. **Operational workflow engine** (GD lifecycle, assignment, approval, transfer, bail, release).
3. **Graph intelligence** (criminal↔organization, criminal↔criminal, criminal↔location).
4. **Custody logistics** (jails, cell blocks, cells, occupancy, transfer history).
5. **Public-safety alerting** (escape-trigger notifications, unread handling, role targeting).
6. **Analytics layer** (thana performance, officer workload, district crime stats, risk ranking).

A normal e-commerce app mainly handles cart/orders/payments.  
A normal messenger mainly handles chat/presence/messages.  
**Black Vein Oracle handles legal, operational, security, and intelligence pipelines together.**

## 2.1 Jaw-Dropping Reasons (Simple Language + Live Frontend Proof)

Use this format in viva: **"Say 1 line, then show 20 seconds."**

### A) "This is not one app. This is 5 systems running together."

- **Say:** "In one login ecosystem we run Admin, Thana, Officer, Jail, and User workflows end-to-end."
- **Show flow (Frontend):**
  1. Login as Admin → open Admin Dashboard.
  2. Sign out → login as Thana → open Thana Dashboard.
  3. Sign out → login as Officer/User/Jail quickly.
  4. Say: "Same platform, different power, different data, different actions."

### B) "A citizen report becomes an operational police task in minutes."

- **Say:** "User complaint is not static data; it becomes actionable assignment."
- **Show flow (Frontend):**
  1. User: Add GD report.
  2. Thana: Manage GD → assign officer.
  3. Officer: open assigned GD list.
  4. User: GD status updated view.
  5. Say: "One record travels across 3 roles with traceability."

### C) "We don’t just store criminals. We map criminal intelligence."

- **Say:** "We track relations, organizations, and locations as a connected intelligence graph."
- **Show flow (Frontend):**
  1. Thana: Add criminal relation.
  2. Thana: Add criminal-organization link.
  3. Thana: Add criminal-location link.
  4. User: open Wanted Criminals + Criminals by Area (`Dhaka`).
  5. Say: "This is intelligence-driven policing, not a static registry."

### D) "We handle custody logistics, not just profile records."

- **Say:** "Most projects stop at profile CRUD; we manage jail capacity and transfers."
- **Show flow (Frontend):**
  1. Admin: Add Jail.
  2. Jail: open cell blocks and cells.
  3. Thana: transfer criminal.
  4. Thana: open transfer history lookup.
  5. Say: "This is operational logistics with movement history."

### E) "Real-time alerting and command visibility are built-in."

- **Say:** "The system informs command roles with unread-tracked notifications and analytics."
- **Show flow (Frontend):**
  1. Open Admin/Thana/User notification centers (badge + unread count).
  2. Mark one notification read; unread count changes.
  3. Open Admin Analytics tab (district, workload, ranking).
  4. Say: "This is decision-support, not only data entry."

### F) "This project is bigger than 2 common projects combined."

- **Say exactly:**
  - "E-commerce gives product-to-order flow."
  - "Messenger gives message-to-message flow."
  - "Our system gives complaint-to-assignment-to-arrest-to-custody-to-transfer-to-intelligence-to-analytics flow."
  - "That is multiple mission-critical systems combined in one architecture."

### G) 25-second killer close

> "Sir, this is not a dashboard showcase. This is a coordinated public-safety operating system prototype where one event triggers role-specific actions, intelligence links, custody updates, notifications, and analytics across the platform."

---

## 3) Uniqueness Statement (country context)

Use this wording in viva:

> "Our uniqueness is not just UI or dashboard count. It is the integrated chain from citizen complaint to criminal intelligence to jail custody and transfer analytics in a single architecture. We are not aware of another student-built system in our context that unifies these workflows end-to-end with role-based controls, relationship intelligence, transfer history, and live notifications in one platform."

---

## 4) System Architecture (explain in 20 seconds)

- **Frontend**: React + routing + TanStack Query + Axios + Zustand.
- **Backend**: Express modular APIs (Router → Controller → Service → Repository).
- **Database**: PostgreSQL (Supabase-hosted), SQL functions/triggers/views.
- **Auth**: Cookie JWT (`token`) + middleware `isAuthenticated` + `requireRole`.

---

## 5) Demo Flow for Sir (strict order, low risk)

## 5.1 Admin Flow (start here)

1. Login as admin.
2. Open Admin Dashboard overview (show system scale).
3. Show Thana tab: add thana.
4. Show Rank tab: add rank.
5. Show Jail tab: add jail (newly added in dashboard).
6. Show Notifications (badge + center).
7. Show Analytics tab (district stats, officer workload, criminal ranking, thana performance).

## 5.2 User Flow

1. Login as user.
2. File GD report.
3. Open GD Reports (status changes visible).
4. Open Wanted Criminals.
5. Open Criminals by Area (type `Dhaka`, show data).
6. Open Notification Center (read/unread behavior).

## 5.3 Thana Flow

1. Login as thana.
2. Manage GD status + assignment to officer.
3. Add/update criminal, case file, officer, location, organization.
4. Add criminal relation + org link + location link.
5. Transfer criminal + transfer history lookup.
6. Open thana analytics and notifications.

## 5.4 Jail Flow

1. Login as jail.
2. Show cell block list and cells.
3. Show occupancy-related operations and incarceration visibility.

## 5.5 Officer Flow

1. Login as officer.
2. Show assigned GD list and details.
3. Show officer dashboard operational usage.

---

## 6) “If Sir asks where this logic is” — Quick Code Lookup

## 6.1 Global request pipeline

- Entry app mount: `Backend/src/index.js`
- API version mount: `Backend/src/routes/apiRouter.js`
- Domain mount: `Backend/src/routes/v1/v1Router.js`
- Auth middleware: `Backend/src/utils/isAuthenticated.js`
- Role middleware: `Backend/src/utils/requireRole.js`

## 6.2 Frontend route registry (all pages)

- `Frontend/src/routes/Routing.jsx`

## 6.3 Dashboard and role pages

- Admin main: `Frontend/src/pages/Dashboard/AdminDashboard.jsx`
- Thana main: `Frontend/src/pages/Dashboard/Thana/ThanaDashboard.jsx`
- Officer main: `Frontend/src/pages/Dashboard/Officer/OfficerDashboard.jsx`
- Jail main: `Frontend/src/pages/Dashboard/Jail/JailDashboard.jsx`
- User main: `Frontend/src/pages/Dashboard/User/UserDashboard.jsx`

---

## 7) Endpoint-to-Logic Map (complete, by domain)

All endpoints are under: `/api/v1`

## 7.1 Admin

Router: `Backend/src/routes/v1/adminRouter.js`  
Controller: `Backend/src/controllers/adminController.js`  
Service: `Backend/src/services/adminService.js`  
Repository: `Backend/src/repositories/adminRepository.js`

Endpoints:

- `POST /admin/add-admin`
- `POST /admin/signin-admin`
- `POST /admin/signout-admin`
- `GET /admin/get-admins`
- `GET /admin/get-admin/:adminId`
- `PUT /admin/update-admin/:adminId`
- `DELETE /admin/delete-admin/:adminId`

## 7.2 User

Router: `Backend/src/routes/v1/userRouter.js`  
Controller: `Backend/src/controllers/userController.js`  
Service: `Backend/src/services/userService.js`  
Repository: `Backend/src/repositories/userRepository.js`

Endpoints:

- `POST /user/add-user`
- `POST /user/signin-user`
- `POST /user/signout-user`
- `GET /user/get-user/:userId`
- `GET /user/get-users`
- `PUT /user/update-user/:userId`
- `DELETE /user/delete-user/:userId`

## 7.3 Thana

Router: `Backend/src/routes/v1/thanaRouter.js`  
Controller: `Backend/src/controllers/thanaControler.js`  
Service: `Backend/src/services/thanaService.js`  
Repository: `Backend/src/repositories/thanaRepository.js`

Endpoints:

- `POST /thana/add-thana`
- `POST /thana/signin-thana`
- `POST /thana/signout-thana`
- `POST /thana/add-head-officer`
- `GET /thana/get-thanas-by-district/:district`
- `GET /thana/get-all-thanas`
- `GET /thana/get-thana-by-id/:thanaId`
- `PUT /thana/update-thana/:thanaId`
- `DELETE /thana/delete-thana/:thanaId`

## 7.4 Officer

Router: `Backend/src/routes/v1/officerRouter.js`  
Controller: `Backend/src/controllers/officerController.js`  
Service: `Backend/src/services/officerService.js`  
Repository: `Backend/src/repositories/officerRepository.js`

Endpoints:

- `POST /officer/add-officer`
- `POST /officer/signin-officer`
- `POST /officer/signout-officer`
- `GET /officer/get-officers`
- `GET /officer/get-officer-by-id/:officerId`
- `GET /officer/get-officers-by-thana/:thana_id`
- `GET /officer/get-officers-by-rank/:rankId`
- `PUT /officer/update-officer/:officerId`
- `DELETE /officer/delete-officer/:officerId`
- `GET /officer/search-officers`

## 7.5 Rank

Router: `Backend/src/routes/v1/rankRouter.js`  
Controller: `Backend/src/controllers/rankController.js`  
Service: `Backend/src/services/rankService.js`  
Repository: `Backend/src/repositories/rankRepository.js`

Endpoints:

- `POST /rank/add-rank`
- `GET /rank/get-all-ranks`
- `GET /rank/get-rank/:rankId`
- `PUT /rank/update-rank/:rankId`
- `DELETE /rank/delete-rank/:rankId`

## 7.6 Location

Router: `Backend/src/routes/v1/locationRouter.js`  
Controller: `Backend/src/controllers/locationController.js`  
Service: `Backend/src/services/locationService.js`  
Repository: `Backend/src/repositories/locationRepository.js`

Endpoints:

- `POST /location/add-location`
- `GET /location/get-all-locations`
- `GET /location/get-location/:locationId`
- `PUT /location/update-location/:locationId`
- `DELETE /location/delete-location/:locationId`
- `GET /location/get-locations-by-district/:district`

## 7.7 Criminal

Router: `Backend/src/routes/v1/criminalRouter.js`  
Controller: `Backend/src/controllers/criminalController.js`  
Service: `Backend/src/services/criminalService.js`  
Repository: `Backend/src/repositories/criminalRepository.js`

Endpoints:

- `GET /criminal/wanted`
- `GET /criminal/area/:district`
- `POST /criminal/add-criminal`
- `GET /criminal/get-criminal/:criminalid`
- `GET /criminal/get-criminals-by-thana/:thanaId`
- `GET /criminal/profile/:id`
- `GET /criminal/timeline/:id`
- `PUT /criminal/recalculate-risk/:id`
- `GET /criminal/get-criminals`
- `PUT /criminal/update-criminal/:criminalId`
- `DELETE /criminal/delete-criminal/:criminalId`
- `GET /criminal/get-criminals-by-status/:status`
- `GET /criminal/search-criminals`

## 7.8 Organization

Router: `Backend/src/routes/v1/organizationRouter.js`  
Controller: `Backend/src/controllers/organizationController.js`  
Service: `Backend/src/services/organizationService.js`  
Repository: `Backend/src/repositories/organizationRepository.js`

Endpoints:

- `POST /organization/add-organization`
- `GET /organization/get-all-organizations`
- `GET /organization/get-organization/:orgId`
- `PUT /organization/update-organization/:orgId`
- `DELETE /organization/delete-organization/:orgId`
- `GET /organization/search-organizations`

## 7.9 Criminal-Organization

Router: `Backend/src/routes/v1/criminalOrganizationRouter.js`  
Controller: `Backend/src/controllers/criminalOrganizationController.js`  
Service: `Backend/src/services/criminalOrganizationService.js`  
Repository: `Backend/src/repositories/criminalOrganizationRepository.js`

Endpoints:

- `POST /criminal-organization/add-link`
- `GET /criminal-organization/get-all-links`
- `GET /criminal-organization/get-criminals-by-org/:orgId`
- `GET /criminal-organization/get-orgs-by-criminal/:criminalId`
- `PUT /criminal-organization/update-link/:criminalId/:orgId`
- `DELETE /criminal-organization/delete-link/:criminalId/:orgId`

## 7.10 Criminal Relation

Router: `Backend/src/routes/v1/criminalRelationRouter.js`  
Controller: `Backend/src/controllers/criminalRelationController.js`  
Service: `Backend/src/services/criminalRelationService.js`  
Repository: `Backend/src/repositories/criminalRelationRepository.js`

Endpoints:

- `POST /criminal-relation/add-relation`
- `GET /criminal-relation/get-all-relations`
- `GET /criminal-relation/get-relations/:criminalId`
- `PUT /criminal-relation/update-relation/:relationId`
- `DELETE /criminal-relation/delete-relation/:relationId`

## 7.11 Criminal Location

Router: `Backend/src/routes/v1/criminalLocationRouter.js`  
Controller: `Backend/src/controllers/criminalLocationController.js`  
Service: `Backend/src/services/criminalLocationService.js`  
Repository: `Backend/src/repositories/criminalLocationRepository.js`

Endpoints:

- `POST /criminal-location/add-criminal-location`
- `GET /criminal-location/get-all-criminal-locations`
- `GET /criminal-location/get-locations-by-criminal/:criminalId`
- `GET /criminal-location/get-criminals-by-location/:locationId`
- `DELETE /criminal-location/delete-criminal-location/:criminalLocationId`

## 7.12 GD Report

Router: `Backend/src/routes/v1/gdReportRouter.js`  
Controller: `Backend/src/controllers/gdReportController.js`  
Service: `Backend/src/services/gdReportService.js`  
Repository: `Backend/src/repositories/gdReportRepository.js`

Endpoints:

- `POST /gd-report/add-general-dairy`
- `GET /gd-report/get-general-dairies-by-user`
- `GET /gd-report/get-general-dairy-by-id/:dairyId`
- `PUT /gd-report/update-general-dairy-status/:dairyId`
- `GET /gd-report/get-all-general-dairies`
- `GET /gd-report/get-general-dairies-by-thana/:thanaId`
- `DELETE /gd-report/delete-general-dairy/:dairyId`

## 7.13 Case File

Router: `Backend/src/routes/v1/caseFileRouter.js`  
Controller: `Backend/src/controllers/caseFileController.js`  
Service: `Backend/src/services/caseFileService.js`  
Repository: `Backend/src/repositories/caseFileRepository.js`

Endpoints:

- `POST /case-file/add-case-file`
- `GET /case-file/get-case-files`
- `GET /case-file/get-case-file/:caseId`
- `GET /case-file/get-case-files-by-thana/:thanaId`
- `GET /case-file/get-case-files-by-criminal/:criminalId`
- `PUT /case-file/update-case-file/:caseId`
- `DELETE /case-file/delete-case-file/:caseId`

## 7.14 Jail

Router: `Backend/src/routes/v1/jailRouter.js`  
Controller: `Backend/src/controllers/jailController.js`  
Service: `Backend/src/services/jailService.js`  
Repository: `Backend/src/repositories/jailRepository.js`

Endpoints:

- `POST /jail/add-jail`
- `POST /jail/signin-jail`
- `POST /jail/signout-jail`
- `GET /jail/get-jails`
- `GET /jail/get-jail/:jailId`
- `GET /jail/get-jail-by-name/:jailName`
- `GET /jail/get-jail-by-zone/:zone`
- `GET /jail/get-jail-by-district/:district`
- `PUT /jail/update-jail/:jailId`
- `DELETE /jail/delete-jail/:jailId`

## 7.15 Cell Block

Router: `Backend/src/routes/v1/cellBlockRouter.js`  
Controller: `Backend/src/controllers/cellBlockController.js`  
Service: `Backend/src/services/cellBlockService.js`  
Repository: `Backend/src/repositories/cellBlockRepository.js`

Endpoints:

- `POST /cell-block/add-cell-block`
- `GET /cell-block/get-all-cell-blocks`
- `GET /cell-block/get-cell-block/:blockId`
- `GET /cell-block/get-cell-blocks-by-jail/:jailId`
- `PUT /cell-block/update-cell-block/:blockId`
- `DELETE /cell-block/delete-cell-block/:blockId`

## 7.16 Cell

Router: `Backend/src/routes/v1/cellRouter.js`  
Controller: `Backend/src/controllers/cellController.js`  
Service: `Backend/src/services/cellService.js`  
Repository: `Backend/src/repositories/cellRepository.js`

Endpoints:

- `POST /cell/add-cell`
- `GET /cell/get-cells`
- `GET /cell/get-cell/:cellId`
- `GET /cell/get-cells-by-block/:blockId`
- `GET /cell/get-available-cells/:jailId`
- `PUT /cell/update-cell/:cellId`
- `DELETE /cell/delete-cell/:cellId`

## 7.17 Arrest Record

Router: `Backend/src/routes/v1/arrestRecordRouter.js`  
Controller: `Backend/src/controllers/arrestRecordController.js`  
Service: `Backend/src/services/arrestRecordService.js`  
Repository: `Backend/src/repositories/arrestRecordRepository.js`

Endpoints:

- `POST /arrest-record/add-arrest-record`
- `GET /arrest-record/get-arrest-records`
- `GET /arrest-record/get-arrest-record/:arrestId`
- `GET /arrest-record/get-arrest-records-by-criminal/:criminalId`
- `GET /arrest-record/get-arrest-records-by-thana/:thanaId`
- `PUT /arrest-record/update-arrest-record/:arrestId`
- `DELETE /arrest-record/delete-arrest-record/:arrestId`

## 7.18 Incarceration + Transfer

Router: `Backend/src/routes/v1/incarcerationRouter.js`  
Controller: `Backend/src/controllers/incarcerationController.js`  
Service: `Backend/src/services/incarcerationService.js`  
Repository: `Backend/src/repositories/incarcerationRepository.js`

Endpoints:

- `POST /incarceration/add-incarceration`
- `GET /incarceration/get-incarcerations`
- `GET /incarceration/get-incarceration/:incarcerationId`
- `GET /incarceration/get-incarcerations-by-criminal/:criminalId`
- `GET /incarceration/get-incarcerations-by-jail/:jailId`
- `PUT /incarceration/update-incarceration/:incarcerationId`
- `PUT /incarceration/release-incarceration/:incarcerationId`
- `DELETE /incarceration/delete-incarceration/:incarcerationId`
- `GET /incarceration/find-cell/:jailId`
- `POST /incarceration/transfer`
- `GET /incarceration/transfers/:criminalId`

## 7.19 Bail Record

Router: `Backend/src/routes/v1/bailRecordRouter.js`  
Controller: `Backend/src/controllers/bailRecordController.js`  
Service: `Backend/src/services/bailRecordService.js`  
Repository: `Backend/src/repositories/bailRecordRepository.js`

Endpoints:

- `POST /bail-record/add-bail-record`
- `GET /bail-record/get-bail-records`
- `GET /bail-record/get-bail-record/:bailId`
- `GET /bail-record/get-bail-records-by-criminal/:criminalId`
- `GET /bail-record/get-bail-records-by-arrest/:arrestId`
- `PUT /bail-record/update-bail-record/:bailId`
- `DELETE /bail-record/delete-bail-record/:bailId`
- `POST /bail-record/process-decision`

## 7.20 Analytics

Router: `Backend/src/routes/v1/analyticsRouter.js`  
Controller: `Backend/src/controllers/analyticsController.js`  
Service: `Backend/src/services/analyticsService.js`  
Repository: `Backend/src/repositories/analyticsRepository.js`

Endpoints:

- `GET /analytics/criminal-full-profile/:criminalId`
- `GET /analytics/high-risk-network`
- `GET /analytics/gd-report-analytics`
- `GET /analytics/bail-statistics`
- `GET /analytics/criminal-movement-history/:criminalId`
- `GET /analytics/organization-threat-analysis`
- `GET /analytics/custody-overview`
- `GET /analytics/inmates-due-for-bail`
- `GET /analytics/cell-occupancy-details/:jailId`
- `GET /analytics/dashboard-overview`
- `GET /analytics/criminals-above-avg-cases`
- `GET /analytics/criminal-ranking`
- `GET /analytics/free-org-members`
- `GET /analytics/monthly-arrest-trend`
- `GET /analytics/thana-performance`
- `GET /analytics/jail-occupancy-detail`
- `GET /analytics/officer-workload`
- `GET /analytics/district-crime-stats`
- `GET /analytics/audit-logs`
- `POST /analytics/recalculate-all-risks`

## 7.21 Notification

Router: `Backend/src/routes/v1/notificationRouter.js`  
Controller: `Backend/src/controllers/notificationController.js`  
Service: `Backend/src/services/notificationService.js`  
Repository: `Backend/src/repositories/notificationRepository.js`

Endpoints:

- `GET /notification/my-notifications`
- `GET /notification/unread-count`
- `PUT /notification/read/:id`
- `PUT /notification/read-all`

---

## 8) DB-level logic Sir may ask (critical)

- Full schema, constraints, functions, triggers, views: `Backend/src/schemas/schema.sql`
- ID generation by prefix (`ADM/THN/OFC/...`): in `schema.sql`
- Trigger-based escape alerts and notification insertion: in `schema.sql`
- Risk / analytics SQL views/functions used by analytics repository: in `schema.sql` + `analyticsRepository.js`

---

## 9) Frontend Feature-to-File Mapping (for live navigation)

## 9.1 User

- Dashboard: `Frontend/src/pages/Dashboard/User/UserDashboard.jsx`
- Add GD: `Frontend/src/pages/Dashboard/User/AddGDReport.jsx`
- GD list/status: `Frontend/src/pages/Dashboard/User/GDReports.jsx`
- Wanted criminals: `Frontend/src/pages/Dashboard/User/WantedCriminals.jsx`
- Criminals by area: `Frontend/src/pages/Dashboard/User/CriminalsByArea.jsx`
- Notifications: `Frontend/src/pages/Dashboard/User/UserNotificationCenter.jsx`
- APIs: `Frontend/src/services/User/*`, `Frontend/src/services/Notification/notificationApi.js`

## 9.2 Thana

- Dashboard + analytics/flows: `Frontend/src/pages/Dashboard/Thana/*`
- GD manage: `Frontend/src/pages/Dashboard/Thana/GDPart/ManageGDStatus.jsx`
- Transfer + history: `Frontend/src/pages/Dashboard/Thana/TransferCriminal.jsx`, `TransferHistoryLookup.jsx`
- Notifications: `Frontend/src/pages/Dashboard/Thana/NotificationCenter.jsx`
- APIs: `Frontend/src/services/Thana/thanaApi.js`

## 9.3 Admin

- Main dashboard: `Frontend/src/pages/Dashboard/AdminDashboard.jsx`
- Admin notifications: `Frontend/src/pages/Dashboard/Admin/AdminNotificationCenter.jsx`
- Jail/Thana/Rank admin modules: `Frontend/src/pages/Dashboard/Admin/**`
- APIs: `Frontend/src/services/Admin/adminApi.js`

## 9.4 Officer and Jail

- Officer dashboard modules: `Frontend/src/pages/Dashboard/Officer/**`
- Jail dashboard/cell management: `Frontend/src/pages/Dashboard/Jail/**`

---

## 10) High-impact viva Q&A (short answers)

**Q: Where is role security implemented?**  
A: `isAuthenticated.js` validates cookie JWT; `requireRole.js` checks ID prefix role before controller access.

**Q: Where is transfer history logic?**  
A: `incarcerationRouter.js` → `incarcerationController.js` → `incarcerationService.js` → `incarcerationRepository.js` (`/transfer`, `/transfers/:criminalId`).

**Q: Where does “criminal by area” come from?**  
A: `criminalRouter.js` endpoint `/criminal/area/:district`, SQL in `criminalRepository.js`.

**Q: Where are notifications generated?**  
A: API retrieval in `notification*` files; escape alert creation at DB trigger/function in `schema.sql`.

**Q: Where are analytics queries?**  
A: `analyticsRepository.js` + SQL views/functions in `schema.sql`.

---

## 11) Final 20-second closing

> "This project is a full law-enforcement operating system prototype with integrated citizen intake, policing workflows, intelligence links, custody logistics, transfer tracking, and command analytics. We did not build isolated pages; we built an end-to-end chain with enforceable roles and traceable backend logic for every major operation."

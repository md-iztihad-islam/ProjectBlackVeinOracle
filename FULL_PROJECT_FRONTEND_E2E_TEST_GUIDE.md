# Full Project Frontend E2E Test Guide (Step by Step)

## Scope

This guide covers end-to-end frontend testing for:

- Thana core 17 features
- Other thana features (case files, notifications, analytics, transfer lookup)
- User side (full GD flow + wanted criminals + criminals by area + profile)
- Admin side
- Jail side
- Officer side (current active + remaining items marked for Iztihad)

---

## 1) Environment Setup (Must pass first)

### 1.1 Backend

1. Open terminal at project root.
2. Go to backend folder.
3. Install dependencies.
4. Start backend.

Use project scripts from:

- Backend package: Backend/package.json
- Server entry: Backend/src/index.js

Notes:

- Frontend axios base URL is `http://localhost:6001/api/v1` in Frontend/src/helpers/constants.js.
- Ensure backend `SERVER_PORT=6001` in your `.env` or environment.

### 1.2 Frontend

1. Open new terminal.
2. Go to `Frontend` folder.
3. Install dependencies.
4. Start Vite dev server.

Use script from Frontend/package.json: `npm run dev`

### 1.3 DB/seed prerequisites

Create or ensure these records exist for update/delete flows:

- at least one admin account
- at least one thana account
- at least one jail account
- at least one officer account
- at least one user account
- at least one criminal, organization, criminal-relation, location, GD report

---

## 2) Global Navigation Smoke Test

1. Open home (`/`).
2. Open access redirection (`/access`).
3. Verify login page by role works (`/access/login/:userType`).
4. Verify no blank page / crash.

Main route map source: Frontend/src/routes/Routing.jsx

---

## 3) Thana Testing (Main Part)

## 3.1 Thana login + dashboard

1. Login as thana.
2. Confirm redirect to `/thana/dashboard`.
3. Confirm tabs and quick action buttons are visible.

### 3.2 Thana essential 17 features (must all PASS)

1. Add officer  
   Path: Thana Dashboard -> + Add Officer -> submit

2. Update officer  
   Path: Officers tab -> Edit -> submit

3. Remove officer  
   Path: Officers tab -> Edit -> Remove Officer -> confirm

4. Update GD status  
   Path: GD tab -> Manage -> change status -> submit

5. Assign officer to GD  
   Path: GD tab -> Manage -> pick officer -> submit

6. Change assigned officer  
   Path: GD tab -> Manage -> pick different officer -> submit

7. Add criminal  
   Path: Thana Dashboard -> + Add Criminal -> submit

8. Update criminal  
   Path: Criminals tab -> Edit -> submit

9. Add organization  
   Path: Thana Dashboard -> + Add Organization -> submit

10. Update organization  
    Path: Thana Dashboard -> + Update Organization -> enter org ID if needed -> submit

11. Add criminal-organization relation  
    Path: Thana Dashboard -> + Add Criminal Organization -> submit

12. Update criminal-organization relation  
    Path: Thana Dashboard -> + Update Criminal Organization -> submit

13. Add criminal-criminal relation  
    Path: Thana Dashboard -> + Add Criminal Relation -> submit

14. Update criminal-criminal relation  
    Path: Thana Dashboard -> + Update Criminal Relation -> submit

15. Add location  
    Path: Thana Dashboard -> + Add Location -> submit

16. Update location  
    Path: Thana Dashboard -> + Update/Remove Location -> enter location ID if needed -> submit

17. Remove location  
    Path: Thana Dashboard -> + Update/Remove Location -> Remove Location -> confirm

Reference files:

- Dashboard: Frontend/src/pages/Dashboard/Thana/ThanaDashboard.jsx
- Routes: Frontend/src/routes/Routing.jsx
- APIs: Frontend/src/services/Thana/thanaApi.js
- Forms: Frontend/src/pages/Dashboard/Thana/\*\*

### 3.3 Other Thana features

A) Add case file  
Path: Thana Dashboard -> + Add Case File

B) Update case file  
Path: Cases tab -> Edit

C) Add criminal location link  
Path: Thana Dashboard -> + Add Criminal Location

D) Notifications (escape/bail/role notifications)  
Path: Thana Dashboard -> Notifications

- Verify list loads
- Verify mark one read
- Verify mark all read

E) Thana analytics overview  
Path: Thana Dashboard -> Analytics Overview

- Verify cards load and show data/no-access gracefully

F) Transfer history lookup  
Path: Thana Dashboard -> Transfer History

- Enter criminal ID and verify table output

---

## 4) User Side Testing (Complete)

### 4.1 User auth

1. Register (`/user-registration`)
2. Sign in (`/user-signin`)
3. Land on `/user/dashboard`

### 4.2 User dashboard + profile

1. Open profile (`/user/dashboard/profile`)
2. Edit profile (`/user/dashboard/profile/edit`)

### 4.3 GD report full flow

1. Add GD report (`/user/dashboard/add-gd-report`)
2. Open my GD reports (`/user/dashboard/gd-reports`)
3. Verify new report appears
4. Later verify status changes after thana updates GD in Manage GD page

### 4.4 Public intelligence pages from user module

1. Wanted criminals (`/user/dashboard/wanted-criminals`)
2. Criminals by area (`/user/dashboard/criminals-by-area`)

### 4.5 User notifications

1. Open `/user/dashboard/notifications`
2. Verify user-targeted notifications list
3. Mark one read / mark all read

---

## 5) Admin Testing

1. Login as admin -> `/admin/dashboard`
2. Verify overview cards/tabs load.
3. Thana module:
   - Open thana dashboard/list routes
   - Add thana
   - Update thana
   - Assign thana head
4. Rank module:
   - Add rank
   - Update rank
   - Assign rank
5. Jail module:
   - Add jail
   - Update jail
6. Confirm admin overview data tabs work (thanas/officers/criminals/jails/ranks/users/gd reports)

Admin routes are in Frontend/src/routes/Routing.jsx under `/admin/dashboard/*`.

---

## 6) Jail Testing

1. Login as jail -> `/jail/dashboard`
2. Cell block flow:
   - list blocks
   - add block
   - update block
3. Cell flow:
   - open cells by block
   - add cell into block

Jail routes under `/jail/dashboard/*` in Frontend/src/routes/Routing.jsx.

---

## 7) Officer Testing (Iztihad scope)

### 7.1 Currently active in frontend

1. Login as officer -> `/officer/dashboard`
2. Open GD list (`/officer/dashboard/gd-list`)
3. Open GD details (`/officer/dashboard/gd-list/:dairyId`)

### 7.2 Remaining officer items (commented, by request)

```txt
// TODO (Will be done by IZTihAD): Officer-side end-to-end response workflow UI polish
// TODO (Will be done by IZTihAD): Officer search/analytics pages integration under officer route tree
// TODO (Will be done by IZTihAD): Officer action components for arrest/bail/incarceration linked from officer dashboard
```

---

## 8) Notifications End-to-End Validation

## 8.1 Escape alert main purpose

1. As thana/admin, update a criminal status to `escaped`.
2. Backend trigger creates notifications for thana/officer/admin roles.
3. Login as another thana account.
4. Open Thana Notification Center and confirm alert appears.

(No realtime required. Fetch-on-open/refresh model.)

## 8.2 Read-state behavior

- Mark single read
- Mark all read
- Confirm unread count drops

---

## 9) Analytics Validation Matrix (Frontend-visible)

A) Thana analytics page (`/thana/analytics-overview`)

- GD analytics
- Bail statistics
- District crime stats
- Officer workload
- Criminal ranking
- Thana performance (role-limited behavior expected)

B) Admin analytics presence

- Admin dashboard overview data should load in admin dashboard tabs/cards.

C) Jail analytics presence

- Verify jail dashboard operational metrics and related lists (where exposed).

---

## 10) Pass/Fail Rules

Mark each test `PASS` only if:

1. No crash/blank page
2. API response is success
3. UI confirms state change (table/card/list updated)
4. Re-open page and data persists

If a test fails, classify:

- Precondition issue (data/auth/role/env)
- Feature issue (frontend/backend logic)

---

## 11) Execution Sheet Template

Use this format while testing:

- Feature:
- Role used:
- Route:
- Input used:
- Expected result:
- Actual result:
- Status: PASS / FAIL
- Failure type (if fail): Precondition / Feature
- Notes:

---

## 12) Recommended Test Order (fastest stable run)

1. Environment + auth smoke
2. Thana 17 core
3. Thana extra features
4. User full flow + GD status loopback
5. Jail flows
6. Admin flows
7. Officer current + log pending Iztihad scope
8. Notifications and analytics final verification

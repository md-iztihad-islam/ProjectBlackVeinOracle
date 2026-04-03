# Thana 17-Feature Pass-Only Verification Checklist

## Objective

Run a controlled verification where all 17 thana-core operations pass.

## Mandatory Preconditions (Pass Gate)

1. Backend server is running and connected to DB.
2. Frontend server is running.
3. Logged in as a valid `thana` account.
4. Seeded test records exist for update/delete flows:
   - One officer under this thana
   - One GD in this thana
   - One criminal in this thana
   - One organization
   - One criminal-organization link
   - One criminal-criminal relation
   - One location
5. Thana has permission for delete officer and delete location.

If any precondition is missing, do not run the checklist.

---

## Golden Test Data (Use/replace with your own)

- Thana ID: `THN-TEST-0001`
- Officer ID: `OFC-TEST-0001`
- GD ID: `1`
- Criminal ID A: `CRM-TEST-0001`
- Criminal ID B: `CRM-TEST-0002`
- Organization ID: `ORG-TEST-0001`
- Relation ID: `1`
- Location ID: `LOC-TEST-0001`

---

## Pass-Only Steps

1. Add officer

- UI path: Thana Dashboard -> + Add Officer
- Input: new `badge_no`, `full_name`, `rank_code`, `phone`, `email`, `password`
- Expected: success alert, returns to dashboard, new officer visible in officer list

2. Update officer

- UI path: Officers tab -> Edit
- Input: change `full_name` or `phone`
- Expected: success alert, value updated in list/DB

3. Remove officer

- UI path: Officers tab -> Edit -> Remove Officer
- Input: confirm dialog
- Expected: success alert, officer removed from list

4. Update GD status

- UI path: GD tab -> Manage
- Input: set status to `approved` (or any valid status)
- Expected: success alert, GD status updated

5. Assign officer to GD

- UI path: GD tab -> Manage
- Input: choose `assignedOfficerId`
- Expected: success alert, assigned officer saved

6. Change assigned officer

- UI path: GD tab -> Manage
- Input: choose a different `assignedOfficerId`
- Expected: success alert, assigned officer changed

7. Add criminal

- UI path: Thana Dashboard -> + Add Criminal
- Input: valid criminal form values
- Expected: success alert, criminal appears in criminals tab

8. Update criminal

- UI path: Criminals tab -> Edit
- Input: change `status` or `risk_level`
- Expected: success alert, criminal updated

9. Add organization

- UI path: Thana Dashboard -> + Add Organization
- Input: `name`, `ideology`, `threat_level`
- Expected: success alert

10. Update organization

- UI path: Thana Dashboard -> + Update Organization
- Input: `Organization ID` + changed fields
- Expected: success alert, organization updated

11. Add criminal-organization relation

- UI path: Thana Dashboard -> + Add Criminal Organization
- Input: `criminal_id`, `org_id`, `role`
- Expected: success alert, link created

12. Update criminal-organization relation

- UI path: Thana Dashboard -> + Update Criminal Organization
- Input: same `criminal_id` + `org_id`, change `role`
- Expected: success alert, link updated

13. Add criminal-criminal relation

- UI path: Thana Dashboard -> + Add Criminal Relation
- Input: `criminal_id_1`, `criminal_id_2`, `relation_type`
- Expected: success alert, relation created

14. Update criminal-criminal relation

- UI path: Thana Dashboard -> + Update Criminal Relation
- Input: `relation_id`, new `relation_type`
- Expected: success alert, relation updated

15. Add location

- UI path: Thana Dashboard -> + Add Location
- Input: `district`, `address`, `zone`
- Expected: success alert, location created

16. Update location

- UI path: Thana Dashboard -> + Update/Remove Location
- Input: `Location ID` + changed fields
- Expected: success alert, location updated

17. Remove location

- UI path: Thana Dashboard -> + Update/Remove Location -> Remove Location
- Input: confirm dialog
- Expected: success alert, location removed

---

## Final Pass Criteria

All 17 checks are `PASS` with:

- no 4xx/5xx response,
- success alert shown,
- record state confirmed changed in UI.

If any step fails, classify it as:

- `Precondition failure` (data/session/role), or
- `Feature defect` (code/route/validation mismatch).

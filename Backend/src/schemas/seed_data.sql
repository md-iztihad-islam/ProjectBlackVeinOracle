
-- 1. ADMIN
INSERT INTO admin (admin_id, full_name, username, email, password) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Mohammad Rafiqul Islam', 'rafiqul', 'rafiqul.islam@mha.gov.bd', 'password123'),
    ('a2222222-2222-2222-2222-222222222222', 'Dr. Nasreen Akter', 'nasreen', 'nasreen.akter@mha.gov.bd', 'password123')
ON CONFLICT DO NOTHING;

-- 2. THANA
INSERT INTO thana (thana_id, thana_name, district, zone, address, phone, email, password, created_by_admin_id) VALUES
    (1, 'Dhanmondi Thana', 'Dhaka', 'South', 'Road 4, Dhanmondi R/A', '01700000001', 'dhanmondi@police.gov.bd', 'password123', 'a1111111-1111-1111-1111-111111111111'),
    (2, 'Gulshan Thana', 'Dhaka', 'North', 'Gulshan Avenue', '01700000002', 'gulshan@police.gov.bd', 'password123', 'a1111111-1111-1111-1111-111111111111'),
    (3, 'Kotwali Thana', 'Chittagong', 'South', 'Station Road', '01700000003', 'kotwali@police.gov.bd', 'password123', 'a2222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- 3. OFFICER
INSERT INTO officer (officer_id, badge_no, full_name, rank_code, thana_id, phone, email, password) VALUES
    ('11111111-1111-1111-1111-111111111111', 'BD-OC-001', 'ASP Mahbubur Rahman', 'oc', 1, '01811111111', 'mahbubur@police.gov.bd', 'password123'),
    ('22222222-2222-2222-2222-111111111111', 'BD-OC-002', 'ASP Shamsul Haque', 'oc', 2, '01822222222', 'shamsul@police.gov.bd', 'password123'),
    ('33333333-3333-3333-3333-111111111111', 'BD-OC-003', 'ASP Jashim Uddin', 'oc', 3, '01833333333', 'jashim@police.gov.bd', 'password123'),
    ('11111111-1111-1111-1111-222222222222', 'BD-INS-001', 'Inspector Kamal Hossain', 'inspector', 1, '01811111112', 'kamal@police.gov.bd', 'password123')
ON CONFLICT DO NOTHING;

-- Update thana head officers
UPDATE thana SET head_officer_id = '11111111-1111-1111-1111-111111111111' WHERE thana_id = 1;
UPDATE thana SET head_officer_id = '22222222-2222-2222-2222-111111111111' WHERE thana_id = 2;
UPDATE thana SET head_officer_id = '33333333-3333-3333-3333-111111111111' WHERE thana_id = 3;

-- 4. LOCATION
INSERT INTO location (location_id, district, address, zone) VALUES
    ('bbbb1111-1111-1111-1111-111111111111', 'Dhaka', 'Road 27, Dhanmondi R/A', 'South'),
    ('bbbb2222-2222-2222-2222-222222222222', 'Dhaka', 'Gulshan Avenue, Block C', 'North'),
    ('bbbb3333-3333-3333-3333-333333333333', 'Chittagong', 'Station Road, Kotwali', 'South')
ON CONFLICT DO NOTHING;

-- 5. USER
INSERT INTO "user" (user_id, full_name, nid_number, phone, email, address, password) VALUES
    ('aaaa1111-1111-1111-1111-111111111111', 'Aminul Haque', '1990123456789', '01711223344', 'aminul@gmail.com', 'House 45, Road 12, Dhanmondi', 'password123'),
    ('aaaa2222-2222-2222-2222-222222222222', 'Rashida Begum', '1985234567890', '01812334455', 'rashida@gmail.com', 'Flat 3B, Gulshan Tower', 'password123')
ON CONFLICT DO NOTHING;

-- 6. GD_REPORT
INSERT INTO gd_report (user_id, thana_id, description, status, approved_by_officer_id) VALUES
    ('aaaa1111-1111-1111-1111-111111111111', 1, 'Lost wallet near Dhanmondi Lake.', 'approved', '11111111-1111-1111-1111-222222222222'),
    ('aaaa2222-2222-2222-2222-222222222222', 2, 'Car break-in at Gulshan parking.', 'submitted', NULL)
ON CONFLICT DO NOTHING;

-- 7. CRIMINAL
INSERT INTO criminal (criminal_id, full_name, nid, status, risk_level, registered_thana_id) VALUES
    ('cccc1111-1111-1111-1111-111111111111', 'Babul Mia', '1970111111111', 'in_custody', 8, 1),
    ('cccc2222-2222-2222-2222-222222222222', 'Rafiq Sheikh', '1975222222222', 'on_bail', 6, 1),
    ('cccc3333-3333-3333-3333-333333333333', 'Jamal Uddin', '1980333333333', 'in_custody', 9, 2)
ON CONFLICT DO NOTHING;

-- 8. ORGANIZATION
INSERT INTO organization (org_id, name, ideology, threat_level) VALUES
    ('dddd1111-1111-1111-1111-111111111111', 'Dhanmondi Gang', 'Extortion and robbery', 7),
    ('dddd2222-2222-2222-2222-222222222222', 'North City Syndicate', 'Drug trafficking', 9)
ON CONFLICT DO NOTHING;

-- 9. CRIMINAL_ORGANIZATION
INSERT INTO criminal_organization (criminal_id, org_id, role) VALUES
    ('cccc1111-1111-1111-1111-111111111111', 'dddd1111-1111-1111-1111-111111111111', 'Leader'),
    ('cccc2222-2222-2222-2222-222222222222', 'dddd1111-1111-1111-1111-111111111111', 'Member'),
    ('cccc3333-3333-3333-3333-333333333333', 'dddd2222-2222-2222-2222-222222222222', 'Boss')
ON CONFLICT DO NOTHING;

-- 10. CRIMINAL_RELATION
INSERT INTO criminal_relation (criminal_id_1, criminal_id_2, relation_type) VALUES
    ('cccc1111-1111-1111-1111-111111111111', 'cccc2222-2222-2222-2222-222222222222', 'accomplice')
ON CONFLICT DO NOTHING;

-- 11. CASE_FILE
INSERT INTO case_file (case_number, criminal_id, thana_id, case_type, status) VALUES
    ('DHK-2024-001', 'cccc1111-1111-1111-1111-111111111111', 1, 'Armed Robbery', 'open'),
    ('DHK-2024-002', 'cccc2222-2222-2222-2222-222222222222', 1, 'Fraud', 'closed'),
    ('GUL-2024-001', 'cccc3333-3333-3333-3333-333333333333', 2, 'Drug Possession', 'under_investigation')
ON CONFLICT DO NOTHING;

-- 12. JAIL
INSERT INTO jail (jail_id, jail_name, district, zone, address, capacity) VALUES
    (1, 'Dhaka Central Jail', 'Dhaka', 'Central', 'Nazimuddin Road, Dhaka', 5000),
    (2, 'Kashimpur Central Jail', 'Gazipur', 'North', 'Kashimpur, Gazipur', 8000)
ON CONFLICT DO NOTHING;

-- 13. CELL_BLOCK
INSERT INTO cell_block (block_id, jail_id, block_name, capacity) VALUES
    (1, 1, 'Block A - High Security', 200),
    (2, 1, 'Block B - General', 500),
    (3, 2, 'Block A - Maximum Security', 300)
ON CONFLICT DO NOTHING;

-- 14. CELL
INSERT INTO cell (cell_id, block_id, cell_number, capacity, status) VALUES
    (1, 1, 'A-101', 4, 'occupied'),
    (2, 1, 'A-102', 4, 'available'),
    (3, 2, 'B-101', 8, 'occupied')
ON CONFLICT DO NOTHING;

-- 15. ARREST_RECORD
INSERT INTO arrest_record (arrest_id, criminal_id, arrest_date, custody_status, thana_id, case_reference) VALUES
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '2024-01-15', 'in_custody', 1, 'DHK-2024-001'),
    ('eeee2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', '2024-02-20', 'on_bail', 1, 'DHK-2024-002'),
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '2024-03-10', 'in_custody', 2, 'GUL-2024-001')
ON CONFLICT DO NOTHING;

-- 16. INCARCERATION
INSERT INTO incarceration (arrest_id, jail_id, cell_id, admitted_at) VALUES
    ('eeee1111-1111-1111-1111-111111111111', 1, 1, '2024-01-16 10:00:00+06'),
    ('eeee3333-3333-3333-3333-333333333333', 1, 3, '2024-03-11 14:30:00+06')
ON CONFLICT DO NOTHING;

-- 17. BAIL_RECORD
INSERT INTO bail_record (arrest_id, court_name, bail_amount, granted_at, surety_name, status) VALUES
    ('eeee2222-2222-2222-2222-222222222222', 'Dhaka Sessions Court', 200000.00, '2024-03-01', 'Mohammad Ali', 'granted')
ON CONFLICT DO NOTHING;

-- 18. CRIMINAL_LOCATION
INSERT INTO criminal_location (criminal_id, location_id, noted_at) VALUES
    ('cccc1111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', '2024-01-10 08:30:00+06'),
    ('cccc3333-3333-3333-3333-333333333333', 'bbbb2222-2222-2222-2222-222222222222', '2024-03-05 10:00:00+06')
ON CONFLICT DO NOTHING;

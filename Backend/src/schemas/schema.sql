--update by Rayyan

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS id_sequences (
    prefix TEXT PRIMARY KEY,
    current_value BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO id_sequences (prefix, current_value) VALUES
    ('ADM', 0),
    ('USR', 0),
    ('OFC', 0),
    ('THN', 0),
    ('CRM', 0),
    ('ORG', 0),
    ('CFS', 0),
    ('JAL', 0),
    ('ARS', 0),
    ('INC', 0),
    ('BAL', 0),
    ('GDR', 0),
    ('LOC', 0),
    ('CLB', 0),
    ('CEL', 0)
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

CREATE TABLE IF NOT EXISTS admin(
    admin_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('ADM'),
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS thana(
    thana_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('THN'),
    thana_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_by_admin_id TEXT NOT NULL REFERENCES admin(admin_id),
    head_officer_id TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS rank(
    rank_code VARCHAR(10) PRIMARY KEY,
    rank_name VARCHAR(50) NOT NULL,
    level INT NOT NULL UNIQUE CHECK (level >=1)
);

INSERT INTO rank (rank_code, rank_name, level) VALUES
	('constable', 'Constable', 1),
	('si', 'Sub-Inspector', 2),
	('inspector', 'Inspector', 3),
	('oc', 'Officer-in-Charge', 4)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS officer(
    officer_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('OFC'),
    badge_no VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    rank_code VARCHAR(10) NOT NULL REFERENCES rank(rank_code),
    thana_id TEXT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    image_url TEXT,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS location(
    location_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('LOC'),
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    zone VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "user"(
    user_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('USR'),
    full_name VARCHAR(100) NOT NULL,
    nid_number VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS gd_report(
    gd_id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    thana_id TEXT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected','submitted')) DEFAULT 'submitted',
    approved_by_officer_id TEXT REFERENCES officer(officer_id),
    assigned_officer_id TEXT REFERENCES officer(officer_id),
    submitted_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS criminal(
    criminal_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('CRM'),
    full_name VARCHAR(100) NOT NULL,
    nid VARCHAR(20) UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('in_custody','on_bail','released','escaped','unknown')) DEFAULT 'unknown',
    risk_level INT NOT NULL CHECK (risk_level BETWEEN 1 AND 10) DEFAULT 1,
    registered_thana_id TEXT REFERENCES thana(thana_id)
);

CREATE TABLE IF NOT EXISTS organization(
    org_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('ORG'),
    name VARCHAR(100) NOT NULL,
    ideology TEXT,
    threat_level INT NOT NULL CHECK (threat_level BETWEEN 1 AND 10) DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS criminal_organization (
    criminal_id TEXT NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    org_id TEXT NOT NULL REFERENCES organization(org_id) ON DELETE CASCADE,
    role TEXT,
    PRIMARY KEY (criminal_id, org_id)
);

CREATE TABLE IF NOT EXISTS criminal_relation (
    relation_id SERIAL PRIMARY KEY,
    criminal_id_1 TEXT NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    criminal_id_2 TEXT NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL CHECK (relation_type IN ('associate','family','financial','accomplice')),
    CHECK (criminal_id_1 <> criminal_id_2),
    UNIQUE (criminal_id_1, criminal_id_2, relation_type)
);

CREATE TABLE IF NOT EXISTS case_file(
    case_id BIGSERIAL PRIMARY KEY,
    case_number TEXT UNIQUE NOT NULL,
    criminal_id TEXT NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    thana_id TEXT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
    case_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'closed', 'under_investigation')) DEFAULT 'open',
    filed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    description TEXT
);

CREATE TABLE IF NOT EXISTS jail(
    jail_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('JAL'),
    jail_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cell_block(
    block_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('CLB'),
    jail_id TEXT NOT NULL REFERENCES jail(jail_id) ON DELETE CASCADE,
    block_name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    UNIQUE (jail_id, block_name)
);

CREATE TABLE IF NOT EXISTS cell (
	cell_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('CEL'),
	block_id TEXT NOT NULL REFERENCES cell_block(block_id) ON DELETE CASCADE,
	cell_number TEXT NOT NULL,
	capacity INT NOT NULL CHECK (capacity > 0),
	status TEXT NOT NULL CHECK (status IN ('available','occupied','maintenance')) DEFAULT 'available',
    number_of_people INT NOT NULL DEFAULT 0,
	UNIQUE (block_id, cell_number)
);

CREATE TABLE IF NOT EXISTS arrest_record(
    arrest_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('ARS'),
    criminal_id TEXT NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    arrest_date DATE NOT NULL,
    bail_due_date DATE,
    custody_status VARCHAR(20) NOT NULL CHECK (custody_status IN ('in_custody', 'on_bail', 'released', 'transferred')) DEFAULT 'in_custody',
    thana_id TEXT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
    case_reference TEXT
);

CREATE TABLE IF NOT EXISTS incarceration(
    incarceration_id TEXT PRIMARY KEY DEFAULT generate_prefixed_id('INC'),
    jail_id TEXT NOT NULL REFERENCES jail(jail_id) ON DELETE CASCADE,
    arrest_id TEXT NOT NULL REFERENCES arrest_record(arrest_id) ON DELETE CASCADE,
    cell_id TEXT REFERENCES cell(cell_id) ON DELETE SET NULL,
    admitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    released_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS bail_record (
    bail_id BIGSERIAL PRIMARY KEY,
    arrest_id TEXT NOT NULL REFERENCES arrest_record(arrest_id) ON DELETE CASCADE,
    court_name TEXT NOT NULL,
    bail_amount NUMERIC(12,2),
    granted_at DATE,
    surety_name TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending','granted','rejected')) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS criminal_location (
    criminal_location_id BIGSERIAL PRIMARY KEY,
    criminal_id TEXT NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    location_id TEXT NOT NULL REFERENCES location(location_id),
    noted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE thana
    ADD CONSTRAINT fk_thana_head_officer
    FOREIGN KEY (head_officer_id) REFERENCES officer(officer_id);

-- ki ki change ta log korar jonno table
CREATE TABLE IF NOT EXISTS audit_log (
    log_id      BIGSERIAL PRIMARY KEY,
    table_name  TEXT NOT NULL,                 
    operation   TEXT NOT NULL               
                CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'STATUS_CHANGE')),
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
    target_role     TEXT NOT NULL
                    CHECK (target_role IN ('admin', 'thana', 'officer', 'jail', 'user')),
    target_id       TEXT,                     
    title           TEXT NOT NULL,
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



--indexes
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

CREATE INDEX IF NOT EXISTS idx_bail_status   ON bail_record(status);
CREATE INDEX IF NOT EXISTS idx_bail_arrest   ON bail_record(arrest_id);

CREATE INDEX IF NOT EXISTS idx_officer_thana ON officer(thana_id);
CREATE INDEX IF NOT EXISTS idx_officer_rank  ON officer(rank_code);

CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_time  ON audit_log(changed_at DESC);

CREATE INDEX IF NOT EXISTS idx_notification_target ON notification(target_role, target_id);
CREATE INDEX IF NOT EXISTS idx_notification_unread
    ON notification(target_role, is_read)
    WHERE is_read = FALSE;


--views
--needed for criminals jara escape korse or jader risk level>=7 (pulic wanted criminal page er jonno)
CREATE OR REPLACE VIEW v_wanted_criminals AS
SELECT
    c.criminal_id,
    c.full_name,
    c.nid,
    c.status,
    c.risk_level,
    COALESCE(t.thana_name, 'Unknown') AS registered_thana,
    COALESCE(t.district, 'Unknown') AS registered_district,
    --koyta case kheyeche
    (SELECT COUNT(*) FROM case_file cf WHERE cf.criminal_id = c.criminal_id) AS total_cases,
    --koybar arrest kora hoise
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
--lateral join lagbe outer query access korar jonno
--most recent location pawar jonno lagbe
LEFT JOIN LATERAL (
    SELECT l.district, l.address, cl.noted_at
    FROM criminal_location cl
    JOIN location l ON cl.location_id = l.location_id
    WHERE cl.criminal_id = c.criminal_id    
    ORDER BY cl.noted_at DESC                
    LIMIT 1 --latest er jonno                               
) cl_latest ON TRUE                          
WHERE c.status = 'escaped'         
   OR c.risk_level >= 7;   




--criminal er shokol tottho pawar jonno.. -- select * from v_criminal_full_profile where criminal_id = .....
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
        MAX(arrest_date) AS last_arrest_date   --most recent kkhn arrest hoise
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


--thana ke tader case closure rate diye rank korar jonno
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
    CASE WHEN total_cases > 0
         THEN ROUND(closed_cases * 100.0 / total_cases, 2)
         ELSE 0
    END AS case_closure_rate,
    CASE WHEN total_gd_reports > 0
         THEN ROUND(approved_gds * 100.0 / total_gd_reports, 2)
         ELSE 0
    END AS gd_approval_rate,
    RANK() OVER (ORDER BY
        CASE WHEN total_cases > 0 THEN closed_cases * 100.0 / total_cases ELSE 0 END DESC
    ) AS performance_rank
FROM thana_stats;



--jail capacity dashboard er jonno
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
    (SELECT COUNT(*) FROM cell_block cb
     JOIN cell ce ON cb.block_id = ce.block_id
     WHERE cb.jail_id = j.jail_id) AS total_cells,
    (SELECT COUNT(*) FROM cell_block cb
     JOIN cell ce ON cb.block_id = ce.block_id
     WHERE cb.jail_id = j.jail_id AND ce.status = 'available') AS available_cells
FROM jail j
LEFT JOIN (
    SELECT i.jail_id, COUNT(*) AS current_inmates
    FROM incarceration i
    WHERE i.released_at IS NULL    --jara ekhno jail e ache
    GROUP BY i.jail_id
) active ON j.jail_id = active.jail_id;




--officer workload er jonno
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
    LEFT JOIN gd_report gd ON gd.assigned_officer_id = o.officer_id
                            OR gd.approved_by_officer_id = o.officer_id
    GROUP BY o.officer_id, o.full_name, o.badge_no, r.rank_name, t.thana_name
)
SELECT
    *,
    assigned_gds + approved_gds AS total_workload,
    DENSE_RANK() OVER (ORDER BY assigned_gds + approved_gds DESC) AS workload_rank
FROM officer_cases;




--functions

--risk level calculate korar jonno function. Risk level 1 theke 10 er moddhe hobe. Criminal er case count, arrest count, organization threat level, escape history er upor depend korbe.


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
    SELECT status INTO v_current_status
    FROM criminal WHERE criminal_id = p_criminal_id;

    IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'Criminal % not found', p_criminal_id;
    END IF;

    SELECT COUNT(*) INTO v_case_count
    FROM case_file WHERE criminal_id = p_criminal_id;

    SELECT COUNT(*) INTO v_arrest_count
    FROM arrest_record WHERE criminal_id = p_criminal_id;

    SELECT COALESCE(MAX(o.threat_level), 0) INTO v_org_max_threat
    FROM criminal_organization co
    JOIN organization o ON co.org_id = o.org_id
    WHERE co.criminal_id = p_criminal_id;

    SELECT EXISTS (
        SELECT 1 FROM audit_log
        WHERE table_name = 'criminal'
          AND record_id = p_criminal_id
          AND new_data->>'status' = 'escaped'   
    ) INTO v_has_escaped;

    IF v_case_count >= 10 THEN
        v_risk := v_risk + 4;
    ELSIF v_case_count >= 5 THEN
        v_risk := v_risk + 3;
    ELSIF v_case_count >= 2 THEN
        v_risk := v_risk + 2;
    ELSIF v_case_count >= 1 THEN
        v_risk := v_risk + 1;
    END IF;

    IF v_arrest_count >= 5 THEN
        v_risk := v_risk + 2;
    ELSIF v_arrest_count >= 2 THEN
        v_risk := v_risk + 1;
    END IF;

    IF v_org_max_threat >= 7 THEN
        v_risk := v_risk + 2;
    ELSIF v_org_max_threat >= 4 THEN
        v_risk := v_risk + 1;
    END IF;

    IF v_has_escaped THEN
        v_risk := v_risk + 2;
    END IF;

    IF v_risk > 10 THEN
        v_risk := 10;      
    END IF;

    UPDATE criminal SET risk_level = v_risk WHERE criminal_id = p_criminal_id;

    RETURN v_risk;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error calculating risk for %: %', p_criminal_id, SQLERRM;
        RETURN -1;
END;
$$ LANGUAGE plpgsql;


--SELECT fn_calculate_criminal_risk(criminalId);



--criminal er life er shb even pawar jonno — arrests, cases, incarcerations, releases, bail hearings, and location sightings — sorted by date.


CREATE OR REPLACE FUNCTION fn_get_criminal_timeline(p_criminal_id TEXT)
RETURNS TABLE (
    event_date  TIMESTAMPTZ,
    event_type  TEXT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY

    --arrests
    SELECT ar.arrest_date::TIMESTAMPTZ,
           'ARREST'::TEXT,
           ('Arrested at ' || COALESCE(t.thana_name, 'Unknown thana'))::TEXT
    FROM arrest_record ar
    LEFT JOIN thana t ON ar.thana_id = t.thana_id
    WHERE ar.criminal_id = p_criminal_id

    UNION ALL

    -- oi criminal er case filings
    SELECT cf.filed_at, 'CASE FILED'::TEXT,
           ('Case #' || cf.case_number || ' — ' || cf.case_type || ' (' || cf.status || ')')::TEXT
    FROM case_file cf
    WHERE cf.criminal_id = p_criminal_id

    UNION ALL

   -- oi crim er incarcerations
    SELECT i.admitted_at, 'INCARCERATED'::TEXT,
           ('Admitted to ' || COALESCE(j.jail_name, 'Unknown jail'))::TEXT
    FROM incarceration i
    JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
    LEFT JOIN jail j ON i.jail_id = j.jail_id
    WHERE ar.criminal_id = p_criminal_id

    UNION ALL

    -- releases
    SELECT i.released_at, 'RELEASED'::TEXT,
           ('Released from ' || COALESCE(j.jail_name, 'Unknown jail'))::TEXT
    FROM incarceration i
    JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
    LEFT JOIN jail j ON i.jail_id = j.jail_id
    WHERE ar.criminal_id = p_criminal_id AND i.released_at IS NOT NULL

    UNION ALL

    --oi crim er bail records
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

    --kothay dekha gese
    SELECT cl.noted_at, 'SIGHTING'::TEXT,
           ('Spotted at ' || l.address || ', ' || l.district)::TEXT
    FROM criminal_location cl
    JOIN location l ON cl.location_id = l.location_id
    WHERE cl.criminal_id = p_criminal_id

    ORDER BY 1 DESC NULLS LAST;  
                                 
END;
$$ LANGUAGE plpgsql;





--best available cell pawar jonno
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



--procedures -> multi step operation er jonno lagbe jara data change korbe



--criminal transfer hole tables updaate er jonno
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
        RAISE EXCEPTION 'Criminal % is not currently incarcerated in jail %',
              p_criminal_id, p_from_jail_id;
    END IF;

    v_from_cell_id := v_current_inc.cell_id;

    UPDATE incarceration SET released_at = NOW()
    WHERE incarceration_id = v_current_inc.incarceration_id;

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

    -- Step 6: Record the transfer
    INSERT INTO criminal_transfer
        (criminal_id, from_jail_id, to_jail_id, from_cell_id, to_cell_id, transfer_reason, authorized_by)
    VALUES
        (p_criminal_id, p_from_jail_id, p_to_jail_id, v_from_cell_id, p_to_cell_id, p_reason, p_authorized_by);

    UPDATE arrest_record SET custody_status = 'transferred'
    WHERE arrest_id = v_current_inc.arrest_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Transfer failed: %', SQLERRM;
END;
$$;





-- const query = `CALL proc_transfer_criminal($1, $2, $3, $4, $5, $6)`;
-- await pool.query(query, [
--   criminalId,
--   fromJailId,
--   toJailId,
--   toCellId,
--   reason,
--   authorizedBy,
-- ]);




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

    IF v_bail IS NULL THEN
        RAISE EXCEPTION 'Bail record % not found', p_bail_id;
    END IF;
    IF v_bail.status <> 'pending' THEN
        RAISE EXCEPTION 'Bail % already processed (status: %)', p_bail_id, v_bail.status;
    END IF;

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
        --release koro
        IF v_incarceration IS NOT NULL THEN
            UPDATE incarceration SET released_at = NOW()
            WHERE incarceration_id = v_incarceration.incarceration_id;
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


--risk score recalculation er jonno. Eita regular basis e run korbe jate risk score always updated thake. Fn_calculate_criminal_risk function use korbe
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


--Triggers
CREATE OR REPLACE FUNCTION fn_audit_criminal_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, record_id, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.criminal_id, ROW_TO_JSON(NEW)::JSONB);
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, record_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.criminal_id,
                ROW_TO_JSON(OLD)::JSONB, ROW_TO_JSON(NEW)::JSONB);
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, record_id, old_data)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.criminal_id, ROW_TO_JSON(OLD)::JSONB);
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_audit_criminal
    AFTER INSERT OR UPDATE OR DELETE ON criminal  
    FOR EACH ROW                                   
    EXECUTE FUNCTION fn_audit_criminal_changes();


--status auto update korar jonno

CREATE OR REPLACE FUNCTION fn_auto_custody_on_arrest()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE criminal SET status = 'in_custody' WHERE criminal_id = NEW.criminal_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_criminal_status_on_arrest
    AFTER INSERT ON arrest_record
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_custody_on_arrest();



--escapre korle
CREATE OR REPLACE FUNCTION fn_escape_alert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'escaped' AND (OLD.status IS NULL OR OLD.status <> 'escaped') THEN
        INSERT INTO notification (target_role, target_id, title, message)
        VALUES ('thana', NULL, ' CRIMINAL ESCAPED!',
                'URGENT: ' || NEW.full_name || ' (ID: ' || NEW.criminal_id ||
                ', Risk: ' || NEW.risk_level || ') has ESCAPED.');

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


CREATE TRIGGER trg_escape_alert
    AFTER UPDATE ON criminal
    FOR EACH ROW
    WHEN (NEW.status = 'escaped')
    EXECUTE FUNCTION fn_escape_alert();




--cell count auto update korar jonno
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

CREATE TRIGGER trg_cell_occupancy
    AFTER INSERT OR UPDATE ON incarceration
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_cell_occupancy();


--gd report er status change hole log korar jonno 
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


CREATE TRIGGER trg_gd_status_change
    AFTER UPDATE ON gd_report
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION fn_gd_status_change();




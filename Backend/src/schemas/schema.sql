CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS admin(
    admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS thana(
    thana_id SERIAL PRIMARY KEY,
    thana_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_by_admin_id UUID NOT NULL REFERENCES admin(admin_id),
    head_officer_id UUID UNIQUE
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
    officer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_no VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    rank_code VARCHAR(10) NOT NULL REFERENCES rank(rank_code),
    thana_id INT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    image_url TEXT,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS location(
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    zone VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "user"(
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    nid_number VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS gd_report(
    gd_id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    thana_id INT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected','submitted')) DEFAULT 'submitted',
    approved_by_officer_id UUID REFERENCES officer(officer_id),
    submitted_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS criminal(
    criminal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    nid VARCHAR(20) UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('in_custody','on_bail','released','escaped','unknown')) DEFAULT 'unknown',
    risk_level INT NOT NULL CHECK (risk_level BETWEEN 1 AND 10) DEFAULT 1,
    registered_thana_id INT REFERENCES thana(thana_id)
);
CREATE TABLE IF NOT EXISTS organization(
    org_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    ideology TEXT,
    threat_level INT NOT NULL CHECK (threat_level BETWEEN 1 AND 10) DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS criminal_organization (
    criminal_id UUID NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organization(org_id) ON DELETE CASCADE,
    role TEXT,
    PRIMARY KEY (criminal_id, org_id)
);
CREATE TABLE IF NOT EXISTS criminal_relation (
    relation_id SERIAL PRIMARY KEY,
    criminal_id_1 UUID NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    criminal_id_2 UUID NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL CHECK (relation_type IN ('associate','family','financial','accomplice')),
    CHECK (criminal_id_1 <> criminal_id_2),
    UNIQUE (criminal_id_1, criminal_id_2, relation_type)
);

CREATE TABLE IF NOT EXISTS case_file(
    case_id BIGSERIAL PRIMARY KEY,
    case_number TEXT UNIQUE NOT NULL,
    criminal_id UUID NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    thana_id INT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
    case_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'closed', 'under_investigation')) DEFAULT 'open',
    filed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    description TEXT
);

CREATE TABLE IF NOT EXISTS jail(
    jail_id SERIAL PRIMARY KEY,
    jail_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0)
);
CREATE TABLE IF NOT EXISTS cell_block(
    block_id SERIAL PRIMARY KEY,
    jail_id INT NOT NULL REFERENCES jail(jail_id) ON DELETE CASCADE,
    block_name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    UNIQUE (jail_id, block_name)
);
CREATE TABLE IF NOT EXISTS cell (
	cell_id SERIAL PRIMARY KEY,
	block_id INT NOT NULL REFERENCES cell_block(block_id) ON DELETE CASCADE,
	cell_number TEXT NOT NULL,
	capacity INT NOT NULL CHECK (capacity > 0),
	status TEXT NOT NULL CHECK (status IN ('available','occupied','maintenance')) DEFAULT 'available',
    number_of_people INT NOT NULL DEFAULT 0,
	UNIQUE (block_id, cell_number)
);
CREATE TABLE IF NOT EXISTS arrest_record(
    arrest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    criminal_id UUID NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    arrest_date DATE NOT NULL,
    bail_due_date DATE,
    custody_status VARCHAR(20) NOT NULL CHECK (custody_status IN ('in_custody', 'on_bail', 'released', 'transferred')) DEFAULT 'in_custody',
    thana_id INT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
    case_reference TEXT
);
CREATE TABLE IF NOT EXISTS incarceration(
    incarceration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jail_id INT NOT NULL REFERENCES jail(jail_id) ON DELETE CASCADE,
    arrest_id UUID NOT NULL REFERENCES arrest_record(arrest_id) ON DELETE CASCADE,
    cell_id INT REFERENCES cell(cell_id) ON DELETE SET NULL,
    admitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    released_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS bail_record (
    bail_id BIGSERIAL PRIMARY KEY,
    arrest_id UUID NOT NULL REFERENCES arrest_record(arrest_id) ON DELETE CASCADE,
    court_name TEXT NOT NULL,
    bail_amount NUMERIC(12,2),
    granted_at DATE,
    surety_name TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending','granted','rejected')) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS criminal_location (
    criminal_location_id BIGSERIAL PRIMARY KEY,
    criminal_id UUID NOT NULL REFERENCES criminal(criminal_id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES location(location_id),
    noted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE thana
    ADD CONSTRAINT fk_thana_head_officer
    FOREIGN KEY (head_officer_id) REFERENCES officer(officer_id);

    
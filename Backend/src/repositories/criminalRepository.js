import pool from "../config/dbConnection.js";

const CRIMINAL_SAFE_COLUMNS = `
    criminal_id,
    full_name,
    nid,
    status,
    risk_level,
    registered_thana_id,
    image_url,
    father_name,
    mother_name,
    birth_date,
    gender,
    aliases,
    nationality,
    permanent_address,
    current_address,
    identifying_marks
`;

const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const dob = new Date(birthDate);
    if (Number.isNaN(dob.getTime())) return null;

    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
        age -= 1;
    }
    return age;
};

const toCriminalRecord = (row) => {
    if (!row) return row;
    return {
        ...row,
        age: row.age ?? calculateAge(row.birth_date),
    };
};

let hasEnsuredCriminalColumns = false;
const ensureCriminalProfileColumns = async () => {
    if (hasEnsuredCriminalColumns) return;

    await pool.query(`
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS image_url TEXT;
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS father_name VARCHAR(100);
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS mother_name VARCHAR(100);
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS birth_date DATE;
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS gender VARCHAR(16);
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS aliases TEXT;
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS nationality VARCHAR(60);
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS permanent_address TEXT;
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS current_address TEXT;
        ALTER TABLE criminal ADD COLUMN IF NOT EXISTS identifying_marks TEXT;

        UPDATE criminal
        SET gender = LOWER(TRIM(gender))
        WHERE gender IS NOT NULL;

        UPDATE criminal
        SET gender = CASE
            WHEN gender IN ('1', 'm', 'man') THEN 'male'
            WHEN gender IN ('2', 'f', 'woman') THEN 'female'
            WHEN gender IN ('0', '3', 'o', 'unknown', 'n/a', 'na') THEN 'other'
            ELSE gender
        END
        WHERE gender IS NOT NULL;
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint WHERE conname = 'criminal_gender_check'
            ) THEN
                ALTER TABLE criminal
                    ADD CONSTRAINT criminal_gender_check CHECK (gender IN ('male','female','other') OR gender IS NULL);
            END IF;
        END $$;
    `);

    hasEnsuredCriminalColumns = true;
};

export const addCriminalRepository = async (criminalData) => {
    try {
        await ensureCriminalProfileColumns();
        const {
            full_name,
            nid,
            status,
            risk_level,
            registered_thana_id,
            image_url,
            father_name,
            mother_name,
            birth_date,
            gender,
            aliases,
            nationality,
            permanent_address,
            current_address,
            identifying_marks,
        } = criminalData;
        const query = `
            INSERT INTO criminal (
                full_name, nid, status, risk_level, registered_thana_id,
                image_url, father_name, mother_name, birth_date, gender,
                aliases, nationality, permanent_address, current_address, identifying_marks
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING ${CRIMINAL_SAFE_COLUMNS};
        `;
        const values = [
            full_name,
            nid,
            status,
            risk_level,
            registered_thana_id,
            image_url,
            father_name,
            mother_name,
            birth_date,
            gender,
            aliases,
            nationality,
            permanent_address,
            current_address,
            identifying_marks,
        ];
        const result = await pool.query(query, values);
        return toCriminalRecord(result.rows[0]);
    } catch (error) {
        console.log('Error adding criminal at addCriminalRepository:', error);
        throw error;
    }
}

export const getCriminalByIdRepository = async (criminalId) => {
    try {
        await ensureCriminalProfileColumns();
        const query = `
            SELECT 
                c.*,
                DATE_PART('year', AGE(CURRENT_DATE, c.birth_date))::INT AS age,
                criminal_organization.org_id, 
                criminal_organization.role, 
                organization.name, 
                organization.ideology, 
                organization.threat_level,
                arrest_record.arrest_id,
                arrest_record.arrest_date,
                arrest_record.bail_due_date,
                arrest_record.custody_status AS arrest_custody_status,
                arrest_record.thana_id AS arresting_thana_id,
                arrest_record.case_reference
            FROM criminal c
            LEFT JOIN criminal_organization ON c.criminal_id = criminal_organization.criminal_id
            LEFT JOIN organization ON criminal_organization.org_id = organization.org_id
            LEFT JOIN arrest_record ON c.criminal_id = arrest_record.criminal_id
            WHERE c.criminal_id = $1;
        `;
        const values = [criminalId];
        const result = await pool.query(query, values);
        return result.rows.map(toCriminalRecord);
    } catch (error) {
        console.log('Error fetching criminal by ID at getCriminalByIdRepository:', error);
        throw error;
    }
}

export const getCriminalsByThanaIdRepository = async (thanaId) => {
    try {
        await ensureCriminalProfileColumns();
        const query = `
            SELECT 
                c.*,
                DATE_PART('year', AGE(CURRENT_DATE, c.birth_date))::INT AS age
            FROM criminal c
            WHERE c.registered_thana_id = $1
            ORDER BY c.criminal_id;
        `;
        const values = [thanaId];
        const result = await pool.query(query, values);
        return result.rows.map(toCriminalRecord);
    } catch (error) {
        console.log('Error fetching criminals by thana ID at getCriminalsByThanaIdRepository:', error);
        throw error;
    }
}



export const getCriminalFullProfileRepository = async (criminalId) => {
    try {
        const query = `SELECT * FROM v_criminal_full_profile WHERE criminal_id = $1`;
        const result = await pool.query(query, [criminalId]);
        return result.rows[0];
    } catch (error) {
        console.log("Error at getCriminalFullProfileRepository:", error);
        throw error;
    }
};



export const getCriminalTimelineRepository = async (criminalId) => {
    try {
        const query = `SELECT * FROM fn_get_criminal_timeline($1)`;
        const result = await pool.query(query, [criminalId]);
        return result.rows;
    } catch (error) {
        console.log("Error at getCriminalTimelineRepository:", error);
        throw error;
    }
};

export const getCriminalCaseHistoryRepository = async (criminalId) => {
    try {
        const query = `
            SELECT
                cf.case_id,
                cf.case_title,
                cf.case_type,
                cf.status,
                cf.filed_at,
                cf.description,
                th.thana_id,
                th.thana_name,
                COALESCE(hist.status_history, '[]'::JSONB) AS status_history,
                hist.last_status_change_at
            FROM case_file cf
            LEFT JOIN thana th ON th.thana_id = cf.thana_id
            LEFT JOIN LATERAL (
                SELECT
                    JSONB_AGG(
                        JSONB_BUILD_OBJECT(
                            'from_status', al.old_data->>'status',
                            'to_status', al.new_data->>'status',
                            'changed_at', al.changed_at
                        )
                        ORDER BY al.changed_at ASC
                    ) AS status_history,
                    MAX(al.changed_at) AS last_status_change_at
                FROM audit_log al
                WHERE al.table_name = 'case_file'
                  AND al.record_id = cf.case_id::TEXT
                  AND (
                    (al.old_data IS NOT NULL AND al.old_data ? 'status')
                    OR
                    (al.new_data IS NOT NULL AND al.new_data ? 'status')
                  )
            ) hist ON TRUE
            WHERE cf.criminal_id = $1
            ORDER BY cf.filed_at DESC NULLS LAST, cf.case_id DESC;
        `;
        const result = await pool.query(query, [criminalId]);
        return result.rows;
    } catch (error) {
        console.log('Error at getCriminalCaseHistoryRepository:', error);
        throw error;
    }
};



export const recalculateCriminalRiskRepository = async (criminalId) => {
    try {
        const query = `SELECT fn_calculate_criminal_risk($1) AS new_risk`;
        const result = await pool.query(query, [criminalId]);
        return result.rows[0];
    } catch (error) {
        console.log("Error at recalculateCriminalRiskRepository:", error);
        throw error;
    }
};


export const getAllCriminalsRepository = async () => {
    try {
        await ensureCriminalProfileColumns();
        const query = `
            SELECT
                c.*,
                DATE_PART('year', AGE(CURRENT_DATE, c.birth_date))::INT AS age,
                t.thana_name
            FROM criminal c
            LEFT JOIN thana t ON c.registered_thana_id = t.thana_id
            ORDER BY c.criminal_id;
        `;
        const result = await pool.query(query);
        return result.rows.map(toCriminalRecord);
    } catch (error) {
        console.log('Error fetching all criminals at getAllCriminalsRepository:', error);
        throw error;
    }
};


export const updateCriminalRepository = async (criminalId, data) => {
    try {
        await ensureCriminalProfileColumns();
        const {
            full_name,
            nid,
            status,
            risk_level,
            image_url,
            father_name,
            mother_name,
            birth_date,
            gender,
            aliases,
            nationality,
            permanent_address,
            current_address,
            identifying_marks,
        } = data;
        const query = `
            UPDATE criminal
            SET
                full_name = COALESCE(NULLIF($1, ''), full_name),
                nid = COALESCE(NULLIF($2, ''), nid),
                status = COALESCE(NULLIF($3, ''), status),
                risk_level = COALESCE($4, risk_level),
                image_url = COALESCE(NULLIF($5, ''), image_url),
                father_name = COALESCE(NULLIF($6, ''), father_name),
                mother_name = COALESCE(NULLIF($7, ''), mother_name),
                birth_date = COALESCE($8, birth_date),
                gender = COALESCE(NULLIF($9, ''), gender),
                aliases = COALESCE(NULLIF($10, ''), aliases),
                nationality = COALESCE(NULLIF($11, ''), nationality),
                permanent_address = COALESCE(NULLIF($12, ''), permanent_address),
                current_address = COALESCE(NULLIF($13, ''), current_address),
                identifying_marks = COALESCE(NULLIF($14, ''), identifying_marks)
            WHERE criminal_id=$15
            RETURNING ${CRIMINAL_SAFE_COLUMNS};
        `;
        const normalizedRiskLevel =
            typeof risk_level === "number" && !Number.isNaN(risk_level)
                ? risk_level
                : null;
        const normalizedBirthDate =
            typeof birth_date === "string" && birth_date.trim() === ""
                ? null
                : (birth_date ?? null);
        const values = [
            full_name,
            nid,
            status,
            normalizedRiskLevel,
            image_url,
            father_name,
            mother_name,
            normalizedBirthDate,
            gender,
            aliases,
            nationality,
            permanent_address,
            current_address,
            identifying_marks,
            criminalId,
        ];
        const result = await pool.query(query, values);
        return toCriminalRecord(result.rows[0]);
    } catch (error) {
        console.log('Error updating criminal at updateCriminalRepository:', error);
        throw error;
    }
};


export const deleteCriminalRepository = async (criminalId) => {
    try {
        await ensureCriminalProfileColumns();
        const query = `DELETE FROM criminal WHERE criminal_id=$1 RETURNING ${CRIMINAL_SAFE_COLUMNS};`;
        const result = await pool.query(query, [criminalId]);
        return toCriminalRecord(result.rows[0]);
    } catch (error) {
        console.log('Error deleting criminal at deleteCriminalRepository:', error);
        throw error;
    }
};


export const getCriminalsByStatusRepository = async (status) => {
    try {
        await ensureCriminalProfileColumns();
        const query = `
            SELECT *, DATE_PART('year', AGE(CURRENT_DATE, birth_date))::INT AS age
            FROM criminal
            WHERE status = $1;
        `;
        const result = await pool.query(query, [status]);
        return result.rows.map(toCriminalRecord);
    } catch (error) {
        console.log('Error fetching criminals by status at getCriminalsByStatusRepository:', error);
        throw error;
    }
};


export const searchCriminalsRepository = async (searchTerm) => {
    try {
        await ensureCriminalProfileColumns();
        const query = `
            SELECT *, DATE_PART('year', AGE(CURRENT_DATE, birth_date))::INT AS age
            FROM criminal
            WHERE full_name ILIKE $1 OR nid ILIKE $1 OR aliases ILIKE $1;
        `;
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows.map(toCriminalRecord);
    } catch (error) {
        console.log('Error searching criminals at searchCriminalsRepository:', error);
        throw error;
    }
};


export const getWantedCriminalsRepository = async () => {
    try {
        await ensureCriminalProfileColumns();
        const query = `
            SELECT
                c.criminal_id,
                c.full_name,
                c.nid,
                c.status,
                c.risk_level,
                c.registered_thana_id,
                c.image_url,
                c.gender,
                DATE_PART('year', AGE(CURRENT_DATE, c.birth_date))::INT AS age,
                t.thana_name AS registered_thana,
                t.district AS last_seen_district,
                t.thana_name AS last_seen_zone,
                NULL::text AS last_seen_address,
                NULL::timestamp AS last_seen_at
            FROM criminal c
            LEFT JOIN thana t ON c.registered_thana_id = t.thana_id
            WHERE c.status IN ('wanted', 'escaped')
            ORDER BY c.risk_level DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching wanted criminals at getWantedCriminalsRepository:', error);
        throw error;
    }
};

export const getCriminalsByAreaRepository = async (district) => {
    try {
        await ensureCriminalProfileColumns();
        const normalizedDistrict = String(district || '').trim();
        const query = `
            SELECT
                c.criminal_id,
                c.full_name,
                c.nid,
                c.status,
                c.risk_level,
                c.registered_thana_id,
                c.image_url,
                c.gender,
                DATE_PART('year', AGE(CURRENT_DATE, c.birth_date))::INT AS age,
                t.thana_name AS registered_thana,
                t.district AS district,
                t.thana_name AS zone,
                NULL::text AS address,
                NULL::timestamp AS noted_at
            FROM criminal c
            LEFT JOIN thana t ON c.registered_thana_id = t.thana_id
            WHERE COALESCE(t.district, '') ILIKE $1
            ORDER BY c.risk_level DESC;
        `;
        const result = await pool.query(query, [`%${normalizedDistrict}%`]);
        return result.rows;
    } catch (error) {
        console.log('Error fetching criminals by area at getCriminalsByAreaRepository:', error);
        throw error;
    }
};

export const getCriminalByNameRepository = async (name) => {
    try {
        const query = `
            SELECT *, DATE_PART('year', AGE(CURRENT_DATE, birth_date))::INT AS age
            FROM criminal
            WHERE full_name ILIKE $1;
        `;
        const sanitizedName = name.replace(/[%_\\]/g, '\\$&');
        const result = await pool.query(query, [`%${sanitizedName}%`]);
        console.log('getCriminalByNameRepository - query result:', result.rows.map(toCriminalRecord));
        return result.rows.map(toCriminalRecord);
    } catch (error) {
        console.log('Error fetching criminal by name at getCriminalByNameRepository:', error);
        throw error;
    }
}

import pool from '../config/dbConnection.js';

const SAFE_OFFICER_COLUMNS = `
    officer_id,
    badge_no,
    full_name,
    rank_code,
    thana_id,
    phone,
    email,
    image_url,
    nid_number,
    father_name,
    mother_name,
    birth_date,
    gender
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

const toOfficerRecord = (row) => {
    if (!row) return row;
    return {
        ...row,
        age: calculateAge(row.birth_date)
    };
};

let hasEnsuredOfficerColumns = false;
const ensureOfficerProfileColumns = async () => {
    if (hasEnsuredOfficerColumns) return;

    await pool.query(`
        ALTER TABLE officer ADD COLUMN IF NOT EXISTS nid_number VARCHAR(20);
        ALTER TABLE officer ADD COLUMN IF NOT EXISTS father_name VARCHAR(100);
        ALTER TABLE officer ADD COLUMN IF NOT EXISTS mother_name VARCHAR(100);
        ALTER TABLE officer ADD COLUMN IF NOT EXISTS birth_date DATE;
        ALTER TABLE officer ADD COLUMN IF NOT EXISTS gender VARCHAR(16);

        UPDATE officer
        SET gender = LOWER(TRIM(gender))
        WHERE gender IS NOT NULL;

        UPDATE officer
        SET gender = CASE
            WHEN gender IN ('1', 'm', 'man') THEN 'male'
            WHEN gender IN ('2', 'f', 'woman') THEN 'female'
            WHEN gender IN ('0', '3', 'o', 'unknown', 'n/a', 'na') THEN 'other'
            ELSE gender
        END
        WHERE gender IS NOT NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_officer_nid_number_unique ON officer(nid_number) WHERE nid_number IS NOT NULL;
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint WHERE conname = 'officer_gender_check'
            ) THEN
                ALTER TABLE officer
                    ADD CONSTRAINT officer_gender_check CHECK (gender IN ('male','female','other') OR gender IS NULL);
            END IF;
        END $$;
    `);

    hasEnsuredOfficerColumns = true;
};

export const addOfficerRepository = async (officerData) => {
    try {
        await ensureOfficerProfileColumns();
        const { badge_no, full_name, rank_code, thana_id, phone, email, image_url, password, nid_number, father_name, mother_name, birth_date, gender } = officerData;
        const query = `
            INSERT INTO officer (badge_no, full_name, rank_code, thana_id, phone, email, image_url, password, nid_number, father_name, mother_name, birth_date, gender)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING ${SAFE_OFFICER_COLUMNS};
        `;
        const values = [badge_no, full_name, rank_code, thana_id, phone, email, image_url, password, nid_number, father_name, mother_name, birth_date, gender ?? null];
        const result = await pool.query(query, values);
        return toOfficerRecord(result.rows[0]);
    } catch (error) {
        console.log('Error adding officer at addOfficerRepository:', error);
        throw error;
    }
}

export const getOfficerByEmailRepository = async (email) => {
    try {
        const query = 'SELECT * FROM officer WHERE email = $1;';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching officer by email at getOfficerByEmailRepository:', error);
        throw error;
    }
}

export const getAllOfficersRepository = async () => {
    try {
        await ensureOfficerProfileColumns();
        const query = `SELECT ${SAFE_OFFICER_COLUMNS} FROM officer;`;
        const result = await pool.query(query);
        return result.rows.map(toOfficerRecord);
    } catch (error) {
        console.log('Error fetching all officers at getAllOfficersRepository:', error);
        throw error;
    }
}

export const getOfficerByThanaIdRepository = async (thana_id) => {
    try {
        await ensureOfficerProfileColumns();
        const query = `
            SELECT ${SAFE_OFFICER_COLUMNS}
            FROM officer
            WHERE thana_id = $1;
        `;
        const result = await pool.query(query, [thana_id]);
        return result.rows.map(toOfficerRecord);
    } catch (error) {
        console.log('Error fetching officers by thana ID at getOfficerByThanaIdRepository:', error);
        throw error;
    }
}

export const getOfficersByRankRepository = async (rankId) => {
    try {
        await ensureOfficerProfileColumns();
        const query = `
            SELECT ${SAFE_OFFICER_COLUMNS}, r.rank_name
            FROM officer o
            JOIN rank r ON o.rank_code = r.rank_code
            WHERE o.rank_code = $1;
        `;
        const result = await pool.query(query, [rankId]);
        return result.rows.map(toOfficerRecord);
    } catch (error) {
        console.log('Error fetching officers by rank at getOfficersByRankRepository:', error);
        throw error;
    }
}


export const updateOfficerRepository = async (officerId, data) => {
    try {
        await ensureOfficerProfileColumns();
        const { full_name, phone, badge_no, rank_code, thana_id, email, image_url, nid_number, father_name, mother_name, birth_date, gender } = data;
        const query = `
            UPDATE officer
            SET
                full_name = COALESCE(NULLIF($1, ''), full_name),
                phone = COALESCE(NULLIF($2, ''), phone),
                badge_no = COALESCE(NULLIF($3, ''), badge_no),
                rank_code = COALESCE(NULLIF($4, ''), rank_code),
                thana_id = COALESCE(NULLIF($5, ''), thana_id),
                email = COALESCE(NULLIF($6, ''), email),
                image_url = COALESCE(NULLIF($7, ''), image_url),
                nid_number = COALESCE(NULLIF($8, ''), nid_number),
                father_name = COALESCE(NULLIF($9, ''), father_name),
                mother_name = COALESCE(NULLIF($10, ''), mother_name),
                birth_date = COALESCE($11, birth_date),
                gender = COALESCE(NULLIF($12, ''), gender),
            WHERE officer_id=$13
            RETURNING ${SAFE_OFFICER_COLUMNS};
        `;
        const values = [full_name, phone, badge_no, rank_code, thana_id, email, image_url, nid_number, father_name, mother_name, birth_date, gender ?? null, officerId];
        const result = await pool.query(query, values);
        return toOfficerRecord(result.rows[0]);
    } catch (error) {
        console.log('Error updating officer at updateOfficerRepository:', error);
        throw error;
    }
}


export const deleteOfficerRepository = async (officerId) => {
    try {
        await ensureOfficerProfileColumns();
        const query = `DELETE FROM officer WHERE officer_id=$1 RETURNING ${SAFE_OFFICER_COLUMNS};`;
        const result = await pool.query(query, [officerId]);
        return toOfficerRecord(result.rows[0]);
    } catch (error) {
        console.log('Error deleting officer at deleteOfficerRepository:', error);
        throw error;
    }
}


export const searchOfficersRepository = async (searchTerm) => {
    try {
        await ensureOfficerProfileColumns();
        const query = `
            SELECT ${SAFE_OFFICER_COLUMNS}, r.rank_name
            FROM officer o
            LEFT JOIN rank r ON o.rank_code = r.rank_code
            WHERE o.full_name ILIKE $1 OR o.badge_no ILIKE $1 OR o.email ILIKE $1 OR o.nid_number ILIKE $1;
        `;
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows.map(toOfficerRecord);
    } catch (error) {
        console.log('Error searching officers at searchOfficersRepository:', error);
        throw error;
    }
}

export const getOfficerByIdRepository = async (officerId) => {
    try {
        await ensureOfficerProfileColumns();
        const query = `
            WITH safe_officer AS (
                -- 1. Isolate the safe columns first. No joins here, so 'rank_code' is unambiguous.
                SELECT ${SAFE_OFFICER_COLUMNS}, password
                FROM officer
                WHERE officer_id = $1
            )
            SELECT
                -- 2. Select all columns from our isolated, safe CTE
                o.*,
                r.rank_name,
                r.level AS rank_level,
                json_build_object(
                    'thana_id', t.thana_id,
                    'thana_name', t.thana_name,
                    'district', t.district,
                    'zone', t.zone,
                    'address', t.address,
                    'phone', t.phone,
                    'email', t.email,
                    'created_by_admin_id', t.created_by_admin_id,
                    'head_officer_id', t.head_officer_id
                ) AS thana,
                (t.head_officer_id = o.officer_id) AS is_head_officer,
                COALESCE(gd_stats.total_assigned_gd, 0) AS total_assigned_gd,
                COALESCE(gd_stats.total_approved_gd, 0) AS total_approved_gd,
                COALESCE(gd_stats.assigned_pending_gd, 0) AS assigned_pending_gd,
                COALESCE(gd_stats.assigned_submitted_gd, 0) AS assigned_submitted_gd,
                COALESCE(gd_stats.assigned_approved_gd, 0) AS assigned_approved_gd,
                COALESCE(gd_stats.assigned_rejected_gd, 0) AS assigned_rejected_gd,
                COALESCE(gd_stats.recent_assigned_gd, '[]'::json) AS recent_assigned_gd,
                COALESCE(gd_stats.recent_approved_gd, '[]'::json) AS recent_approved_gd,
                COALESCE(arrest_stats.total_arrests_in_officer_thana, 0) AS total_arrests_in_officer_thana,
                COALESCE(arrest_stats.in_custody_count, 0) AS in_custody_count,
                COALESCE(arrest_stats.on_bail_count, 0) AS on_bail_count,
                COALESCE(arrest_stats.released_count, 0) AS released_count,
                COALESCE(arrest_stats.transferred_count, 0) AS transferred_count
            FROM safe_officer o
            LEFT JOIN rank r ON o.rank_code = r.rank_code
            LEFT JOIN thana t ON o.thana_id = t.thana_id
            LEFT JOIN LATERAL (
                SELECT
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = o.officer_id) AS total_assigned_gd,
                    COUNT(*) FILTER (WHERE g.approved_by_officer_id = o.officer_id) AS total_approved_gd,
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = o.officer_id AND g.status = 'assigned') AS assigned_pending_gd,
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = o.officer_id AND g.status = 'submitted') AS assigned_submitted_gd,
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = o.officer_id AND g.status = 'approved') AS assigned_approved_gd,
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = o.officer_id AND g.status = 'rejected') AS assigned_rejected_gd,
                    (
                        SELECT json_agg(
                            json_build_object(
                                'gd_id', g1.gd_id,
                                'status', g1.status,
                                'gd_type', g1.gd_type,
                                'incident_date', g1.incident_date,
                                'incident_location', g1.incident_location,
                                'submitted_at', g1.submitted_at,
                                'user_id', g1.user_id,
                                'thana_id', g1.thana_id
                            )
                            ORDER BY g1.submitted_at DESC
                        )
                        FROM (
                            SELECT *
                            FROM gd_report
                            WHERE assigned_officer_id = o.officer_id
                            ORDER BY submitted_at DESC
                            LIMIT 10
                        ) g1
                    ) AS recent_assigned_gd,
                    (
                        SELECT json_agg(
                            json_build_object(
                                'gd_id', g2.gd_id,
                                'status', g2.status,
                                'gd_type', g2.gd_type,
                                'incident_date', g2.incident_date,
                                'incident_location', g2.incident_location,
                                'submitted_at', g2.submitted_at,
                                'user_id', g2.user_id,
                                'thana_id', g2.thana_id
                            )
                            ORDER BY g2.submitted_at DESC
                        )
                        FROM (
                            SELECT *
                            FROM gd_report
                            WHERE approved_by_officer_id = o.officer_id
                            ORDER BY submitted_at DESC
                            LIMIT 10
                        ) g2
                    ) AS recent_approved_gd
                FROM gd_report g
                WHERE g.assigned_officer_id = o.officer_id OR g.approved_by_officer_id = o.officer_id
            ) gd_stats ON TRUE
            LEFT JOIN LATERAL (
                SELECT
                    COUNT(*) AS total_arrests_in_officer_thana,
                    COUNT(*) FILTER (WHERE ar.custody_status = 'in_custody') AS in_custody_count,
                    COUNT(*) FILTER (WHERE ar.custody_status = 'on_bail') AS on_bail_count,
                    COUNT(*) FILTER (WHERE ar.custody_status = 'released') AS released_count,
                    COUNT(*) FILTER (WHERE ar.custody_status = 'transferred') AS transferred_count
                FROM arrest_record ar
                WHERE ar.thana_id = o.thana_id
            ) arrest_stats ON TRUE;
        `;
        const result = await pool.query(query, [officerId]);
        return toOfficerRecord(result.rows[0]);
    } catch (error) {
        console.log('Error fetching officer by ID at getOfficerByIdRepository:', error);
        throw error;
    }
}

export const resetPasswordRepository = async (officerId, newPassword) => {
    try {
        const query = `
            UPDATE officer
            SET password = $1
            WHERE officer_id = $2
            RETURNING ${SAFE_OFFICER_COLUMNS};
        `;
        const result = await pool.query(query, [newPassword, officerId]);
        return toOfficerRecord(result.rows[0]);
    } catch (error) {
        console.log('Error resetting password at resetPasswordRepository:', error);
        throw error;
    }
}

export const getOfficerAnalyticsRepository = async (thanaId, district, gender, rank) => {
    try {
        await ensureOfficerProfileColumns();
        const query = `
            WITH safe_officers AS (
                SELECT ${SAFE_OFFICER_COLUMNS}
                FROM officer
                WHERE
                    (NULLIF(BTRIM($1::text), '') IS NULL OR thana_id = BTRIM($1::text))
                    AND (NULLIF(BTRIM($3::text), '') IS NULL OR LOWER(gender) = LOWER(BTRIM($3::text)))
                    AND (NULLIF(BTRIM($4::text), '') IS NULL OR LOWER(rank_code) = LOWER(BTRIM($4::text)))
            ),
            filtered_officers AS (
                SELECT
                    o.*,
                    DATE_PART('year', AGE(CURRENT_DATE, o.birth_date))::INT AS age,
                    r.rank_name,
                    r.level AS rank_level,
                    t.thana_name,
                    t.district,
                    t.zone,
                    t.head_officer_id
                FROM safe_officers o
                LEFT JOIN rank r ON o.rank_code = r.rank_code
                LEFT JOIN thana t ON o.thana_id = t.thana_id
                WHERE
                    (NULLIF(BTRIM($2::text), '') IS NULL OR t.district ILIKE '%' || BTRIM($2::text) || '%')
            )
            SELECT
                fo.*,
                (fo.head_officer_id = fo.officer_id) AS is_head_officer,
                COUNT(*) OVER() AS total_officers_in_filter,
                COALESCE(gd_stats.total_assigned_gd, 0) AS total_assigned_gd,
                COALESCE(gd_stats.total_approved_gd, 0) AS total_approved_gd,
                COALESCE(gd_stats.assigned_pending_gd, 0) AS assigned_pending_gd,
                COALESCE(gd_stats.assigned_submitted_gd, 0) AS assigned_submitted_gd,
                COALESCE(gd_stats.assigned_approved_gd, 0) AS assigned_approved_gd,
                COALESCE(gd_stats.assigned_rejected_gd, 0) AS assigned_rejected_gd,
                COALESCE(gd_stats.recent_assigned_gd, '[]'::json) AS recent_assigned_gd,
                COALESCE(gd_stats.recent_approved_gd, '[]'::json) AS recent_approved_gd,
                COALESCE(arrest_stats.total_arrests_in_officer_thana, 0) AS total_arrests_in_officer_thana,
                COALESCE(arrest_stats.in_custody_count, 0) AS in_custody_count,
                COALESCE(arrest_stats.on_bail_count, 0) AS on_bail_count,
                COALESCE(arrest_stats.released_count, 0) AS released_count,
                COALESCE(arrest_stats.transferred_count, 0) AS transferred_count
            FROM filtered_officers fo
            LEFT JOIN LATERAL (
                SELECT
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = fo.officer_id) AS total_assigned_gd,
                    COUNT(*) FILTER (WHERE g.approved_by_officer_id = fo.officer_id) AS total_approved_gd,
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = fo.officer_id AND g.status = 'assigned') AS assigned_pending_gd,
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = fo.officer_id AND g.status = 'submitted') AS assigned_submitted_gd,
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = fo.officer_id AND g.status = 'approved') AS assigned_approved_gd,
                    COUNT(*) FILTER (WHERE g.assigned_officer_id = fo.officer_id AND g.status = 'rejected') AS assigned_rejected_gd,
                    (
                        SELECT json_agg(
                            json_build_object(
                                'gd_id', g1.gd_id,
                                'status', g1.status,
                                'gd_type', g1.gd_type,
                                'incident_date', g1.incident_date,
                                'incident_location', g1.incident_location,
                                'submitted_at', g1.submitted_at,
                                'user_id', g1.user_id,
                                'thana_id', g1.thana_id
                            )
                            ORDER BY g1.submitted_at DESC
                        )
                        FROM (
                            SELECT *
                            FROM gd_report
                            WHERE assigned_officer_id = fo.officer_id
                            ORDER BY submitted_at DESC
                            LIMIT 5
                        ) g1
                    ) AS recent_assigned_gd,
                    (
                        SELECT json_agg(
                            json_build_object(
                                'gd_id', g2.gd_id,
                                'status', g2.status,
                                'gd_type', g2.gd_type,
                                'incident_date', g2.incident_date,
                                'incident_location', g2.incident_location,
                                'submitted_at', g2.submitted_at,
                                'user_id', g2.user_id,
                                'thana_id', g2.thana_id
                            )
                            ORDER BY g2.submitted_at DESC
                        )
                        FROM (
                            SELECT *
                            FROM gd_report
                            WHERE approved_by_officer_id = fo.officer_id
                            ORDER BY submitted_at DESC
                            LIMIT 5
                        ) g2
                    ) AS recent_approved_gd
                FROM gd_report g
                WHERE g.assigned_officer_id = fo.officer_id OR g.approved_by_officer_id = fo.officer_id
            ) gd_stats ON TRUE
            LEFT JOIN LATERAL (
                SELECT
                    COUNT(*) AS total_arrests_in_officer_thana,
                    COUNT(*) FILTER (WHERE ar.custody_status = 'in_custody') AS in_custody_count,
                    COUNT(*) FILTER (WHERE ar.custody_status = 'on_bail') AS on_bail_count,
                    COUNT(*) FILTER (WHERE ar.custody_status = 'released') AS released_count,
                    COUNT(*) FILTER (WHERE ar.custody_status = 'transferred') AS transferred_count
                FROM arrest_record ar
                WHERE ar.thana_id = fo.thana_id
            ) arrest_stats ON TRUE
            ORDER BY fo.rank_level DESC NULLS LAST, fo.full_name ASC;
        `;
        const values = [
            thanaId || null,
            district || null,
            gender || null,
            rank || null
        ];

        const result = await pool.query(query, values);
        return result.rows.map(toOfficerRecord);
    } catch (error) {
        console.log('Error fetching officer analytics at getOfficerAnalyticsRepository:', error);
        throw error;
    }
}
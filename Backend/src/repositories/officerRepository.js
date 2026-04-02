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
                gender = COALESCE(NULLIF($12, ''), gender)
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
        const query = `SELECT ${SAFE_OFFICER_COLUMNS} FROM officer WHERE officer_id = $1;`;
        const result = await pool.query(query, [officerId]);
        return toOfficerRecord(result.rows[0]);
    } catch (error) {
        console.log('Error fetching officer by ID at getOfficerByIdRepository:', error);
        throw error;
    }
}
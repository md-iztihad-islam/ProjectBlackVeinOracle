import pool from "../config/dbConnection.js";

let hasEnsuredUserProfileColumns = false;
const ensureUserProfileColumns = async () => {
    if (hasEnsuredUserProfileColumns) return;

    await pool.query(`
        ALTER TABLE "user" ADD COLUMN IF NOT EXISTS birth_date DATE;
        ALTER TABLE "user" ADD COLUMN IF NOT EXISTS gender VARCHAR(16);

        UPDATE "user"
        SET gender = LOWER(TRIM(gender))
        WHERE gender IS NOT NULL;

        UPDATE "user"
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
                SELECT 1 FROM pg_constraint WHERE conname = 'user_gender_check'
            ) THEN
                ALTER TABLE "user"
                    ADD CONSTRAINT user_gender_check CHECK (gender IN ('male','female','other') OR gender IS NULL);
            END IF;
        END $$;
    `);

    hasEnsuredUserProfileColumns = true;
};

export const addUserRepository = async (userData) => {
    try {
        await ensureUserProfileColumns();
        const { full_name, nid_number, phone, email, address, birth_date, gender, password } = userData;
        const query = `
            INSERT INTO "user" (full_name, nid_number, phone, email, address, birth_date, gender, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [full_name, nid_number, phone, email, address, birth_date ?? null, gender ?? null, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding user at addUserRepository:', error);
        throw error;
    }
}

export const getUserByEmailRepository = async (email) => {
    try {
        await ensureUserProfileColumns();
        const query = `SELECT * FROM "user" WHERE email = $1;`;
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching user by email at getUserByEmailRepository:', error);
        throw error;
    }
}

export const getUserByIdRepository = async (userId) => {
    try {
        await ensureUserProfileColumns();
        const query = `SELECT * FROM "user" WHERE user_id = $1;`;
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching user by ID at getUserByIdRepository:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const getAllUsersRepository = async () => {
    try {
        await ensureUserProfileColumns();
        const query = `SELECT user_id, full_name, nid_number, email, phone, address, birth_date, gender FROM "user";`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all users at getAllUsersRepository:', error);
        throw error;
    }
}

export const updateUserRepository = async (userId, data) => {
    try {
        await ensureUserProfileColumns();
        console.log('Updating user with ID:', userId, 'and data:', data);
        const { full_name, phone, address, birth_date, gender } = data;
        const query = `
            UPDATE "user"
            SET
                full_name = COALESCE(NULLIF($1, ''), full_name),
                phone = COALESCE(NULLIF($2, ''), phone),
                address = COALESCE(NULLIF($3, ''), address),
                birth_date = COALESCE($4, birth_date),
                gender = COALESCE(NULLIF($5, ''), gender)
            WHERE user_id=$6
            RETURNING user_id, full_name, email, phone, address, birth_date, gender;
        `;
        const values = [full_name, phone, address, birth_date ?? null, gender ?? null, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating user at updateUserRepository:', error);
        throw error;
    }
}


export const deleteUserRepository = async (userId) => {
    try {
        await ensureUserProfileColumns();
        const query = `DELETE FROM "user" WHERE user_id=$1 RETURNING user_id, full_name, email;`;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting user at deleteUserRepository:', error);
        throw error;
    }
}
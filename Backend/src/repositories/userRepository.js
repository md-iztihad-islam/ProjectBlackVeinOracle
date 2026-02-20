import pool from "../config/dbConnection.js";

export const addUserRepository = async (userData) => {
    try {
        const { full_name, nid_number, phone, email, address, password } = userData;
        const query = `
            INSERT INTO "user" (full_name, nid_number, phone, email, address, password)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [full_name, nid_number, phone, email, address, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding user at addUserRepository:', error);
        throw error;
    }
}

export const getUserByEmailRepository = async (email) => {
    try {
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
        const query = `SELECT * FROM "user" WHERE user_id = $1;`;
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching user by ID at getUserByIdRepository:', error);
        throw error;
    }
}
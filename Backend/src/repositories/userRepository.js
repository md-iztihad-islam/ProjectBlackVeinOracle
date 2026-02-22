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

// by Rayyan 2.0
export const getAllUsersRepository = async () => {
    try {
        const query = `SELECT user_id, full_name, nid_number, email, phone, address FROM "user";`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all users at getAllUsersRepository:', error);
        throw error;
    }
}

export const updateUserRepository = async (userId, data) => {
    try {
        const { full_name, phone, address } = data;
        const query = `
            UPDATE "user" SET full_name=$1, phone=$2, address=$3 WHERE user_id=$4
            RETURNING user_id, full_name, email, phone, address;
        `;
        const values = [full_name, phone, address, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating user at updateUserRepository:', error);
        throw error;
    }
}


export const deleteUserRepository = async (userId) => {
    try {
        const query = `DELETE FROM "user" WHERE user_id=$1 RETURNING user_id, full_name, email;`;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting user at deleteUserRepository:', error);
        throw error;
    }
}
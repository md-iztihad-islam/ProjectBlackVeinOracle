import pool from '../config/dbConnection.js';

export const addAdminRepository = async (adminData) => {
    try {
        const { full_name, username, email, password } = adminData;
        const query = `
            INSERT INTO admin (full_name, username, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [full_name, username, email, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding admin at addAdminRepository:', error);
        throw error;
    }
};

export const getAdminByUsername = async (username) => {
    try {
        const query = 'SELECT * FROM admin WHERE username = $1;';
        const result = await pool.query(query, [username]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching admin by username at getAdminByUsername:', error);
        throw error;
    }
}
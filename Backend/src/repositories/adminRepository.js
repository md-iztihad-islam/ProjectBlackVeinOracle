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

// by Rayyan 2.0
export const getAllAdminsRepository = async () => {
    try {
        const query = 'SELECT * FROM admin;';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all admins at getAllAdminsRepository:', error);
        throw error;
    }
}


export const getAdminByIdRepository = async (adminId) => {
    try {
        const query = 'SELECT * FROM admin WHERE admin_id = $1;';
        const result = await pool.query(query, [adminId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching admin by ID at getAdminByIdRepository:', error);
        throw error;
    }
}


export const updateAdminRepository = async (adminId, data) => {
    try {
        const { full_name, username, email } = data;
        const query = `
            UPDATE admin
            SET
                full_name = COALESCE(NULLIF($1, ''), full_name),
                username = COALESCE(NULLIF($2, ''), username),
                email = COALESCE(NULLIF($3, ''), email)
            WHERE admin_id = $4
            RETURNING *;
        `;
        const values = [full_name, username, email, adminId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating admin at updateAdminRepository:', error);
        throw error;
    }
}


export const deleteAdminRepository = async (adminId) => {
    try {
        const query = 'DELETE FROM admin WHERE admin_id = $1 RETURNING *;';
        const result = await pool.query(query, [adminId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting admin at deleteAdminRepository:', error);
        throw error;
    }
}
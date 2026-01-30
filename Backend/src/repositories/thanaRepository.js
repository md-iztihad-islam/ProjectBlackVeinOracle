import pool from '../config/dbConnection.js';

export const addThanaRepository = async (thanaData) => {
    try {
        const { thana_name, district, zone, address, phone, email, password, created_by_admin_id, head_officer_id } = thanaData;
        const query = `
            INSERT INTO thana (thana_name, district, zone, address, phone, email, password, created_by_admin_id, head_officer_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [thana_name, district, zone, address, phone, email, password, created_by_admin_id, head_officer_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding thana at addThanaRepository:', error);
        throw error;
    }
};

export const getThanaByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM thana WHERE email = $1;';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching thana by email at getThanaByEmail:', error);
        throw error;
    }
}
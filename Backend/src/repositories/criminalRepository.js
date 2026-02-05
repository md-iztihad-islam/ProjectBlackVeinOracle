import pool from "../config/dbConnection.js";

export const addCriminalRepository = async (criminalData) => {
    try {
        const { full_name, nid, status, risk_level, registered_thana_id } = criminalData;
        const query = `
            INSERT INTO criminal (full_name, nid, status, risk_level, registered_thana_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [full_name, nid, status, risk_level, registered_thana_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding criminal at addCriminalRepository:', error);
        throw error;
    }
}
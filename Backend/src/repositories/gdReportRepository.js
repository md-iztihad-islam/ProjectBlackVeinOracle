import pool from "../config/dbConnection.js";

export const addGeneralDairyRepository = async (dairyData) => {
    try {
        const { user_id, thana_id, description } = dairyData;
        const query = `
            INSERT INTO gd_report (user_id, thana_id, description)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [user_id, thana_id, description];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding general dairy at addGeneralDairyRepository:', error);
        throw error;
    }
}

export const getGeneralDairiesByUserIdRepository = async (userId) => {
    try {
        const query = `SELECT * FROM gd_report WHERE user_id = $1;`;
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching general dairies by user ID at getGeneralDairiesByUserIdRepository:', error);
        throw error;
    }
}

export const getGeneralDairyByIdRepository = async (dairyId) => {
    try {
        const query = `SELECT * FROM gd_report WHERE gd_id = $1;`;
        const values = [dairyId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching general dairy by ID at getGeneralDairyByIdRepository:', error);
        throw error;
    }
}

export const updateGeneralDairyStatusRepository = async (dairyId, status, approvedByOfficerId, assignedOfficerId) => {
    try {
        const query = `
            UPDATE gd_report
            SET status = $1,
                approved_by_officer_id = $2,
                assigned_officer_id = $3
            WHERE gd_id = $4
            RETURNING *;
        `;
        const values = [status, approvedByOfficerId, assignedOfficerId, dairyId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating general dairy status at updateGeneralDairyStatusRepository:', error);
        throw error;
    }
}
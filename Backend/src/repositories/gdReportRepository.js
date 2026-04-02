import pool from "../config/dbConnection.js";

export const addGeneralDairyRepository = async (dairyData) => {
    try {
        const { user_id, thana_id, description, gd_type, incident_date, incident_location } = dairyData;
        const query = `
            WITH inserted_gd AS (
                INSERT INTO gd_report (user_id, thana_id, gd_type, description, incident_date, incident_location)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            ),
            inserted_notification AS (
                INSERT INTO notification (target_role, target_id, title, message)
                SELECT
                    'user',
                    user_id,
                    'GD Submitted',
                    'Your GD report has been submitted successfully and is pending review by thana.'
                FROM inserted_gd
            )
            SELECT * FROM inserted_gd;
        `;
        const values = [user_id, thana_id, gd_type || 'other', description, incident_date || null, incident_location || null];
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
            WITH updated_gd AS (
                UPDATE gd_report
                SET status = $1,
                    approved_by_officer_id = COALESCE($2, approved_by_officer_id),
                    assigned_officer_id = COALESCE($3, assigned_officer_id)
                WHERE gd_id = $4
                RETURNING *
            ),
            inserted_notification AS (
                INSERT INTO notification (target_role, target_id, title, message)
                SELECT
                    'user',
                    user_id,
                    'GD Status Updated',
                    'Your GD report #' || gd_id || ' status is now: ' || status
                FROM updated_gd
            )
            SELECT * FROM updated_gd;
        `;
        const values = [status, approvedByOfficerId, assignedOfficerId, dairyId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating general dairy status at updateGeneralDairyStatusRepository:', error);
        throw error;
    }
}

export const getAllGeneralDairiesRepository = async () => {
    try {
        const query = 'SELECT * FROM gd_report ORDER BY gd_id DESC;';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all general dairies at getAllGeneralDairiesRepository:', error);
        throw error;
    }
}


export const getGeneralDairiesByThanaRepository = async (thanaId) => {
    try {
        const query = 'SELECT * FROM gd_report WHERE thana_id = $1 ORDER BY gd_id DESC;';
        const result = await pool.query(query, [thanaId]);
        return result.rows;
    } catch (error) {
        console.log('Error fetching general dairies by thana at getGeneralDairiesByThanaRepository:', error);
        throw error;
    }
}


export const deleteGeneralDairyRepository = async (dairyId) => {
    try {
        const query = 'DELETE FROM gd_report WHERE gd_id = $1 RETURNING *;';
        const result = await pool.query(query, [dairyId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting general dairy at deleteGeneralDairyRepository:', error);
        throw error;
    }
}

export const getSubmittedGeneralDairiesByThanaRepository = async (thanaId) => {
    try {
        const query = 'SELECT * FROM gd_report WHERE thana_id = $1 AND status = $2 ORDER BY gd_id DESC;';
        const result = await pool.query(query, [thanaId, 'submitted']);
        return result.rows;
    } catch (error) {
        console.log('Error fetching submitted general dairies by thana at getSubmittedGeneralDairiesByThanaRepository:', error);
        throw error;
    }
}

export const getGeneralDairiesByAssignedOfficerRepository = async (officerId) => {
    try {
        const query = 'SELECT * FROM gd_report WHERE assigned_officer_id = $1 ORDER BY gd_id DESC;';
        const result = await pool.query(query, [officerId]);
        return result.rows;
    } catch (error) {
        console.log('Error fetching general dairies by assigned officer at getGeneralDairiesByAssignedOfficerRepository:', error);
        throw error;
    }
}

export const respondToGeneralDairyRepository = async (dairyId, status) => {
    try {
        const query = `
            UPDATE gd_report
            SET status = $1
            WHERE gd_id = $2
            RETURNING *;
        `;
        const values = [status, dairyId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error responding to general dairy at respondToGeneralDairyRepository:', error);
        throw error;
    }
}
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

export const getCriminalByIdRepository = async (criminalId) => {
    try {
        const query = `
            SELECT 
                criminal.*, 
                criminal_organization.org_id, 
                criminal_organization.role, 
                organization.name, 
                organization.ideology, 
                organization.threat_level
            FROM criminal 
            LEFT JOIN criminal_organization ON criminal.criminal_id = criminal_organization.criminal_id
            LEFT JOIN organization ON criminal_organization.org_id = organization.org_id
            WHERE criminal.criminal_id = $1;
        `;
        const values = [criminalId];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching criminal by ID at getCriminalByIdRepository:', error);
        throw error;
    }
}
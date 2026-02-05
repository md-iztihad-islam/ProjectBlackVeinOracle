import pool from "../config/dbConnection.js";

export const addOrganizationRepository = async (organizationData) => {
    try {
        const { name, ideology, threat_level } = organizationData;
        const query = `
            INSERT INTO organization (name, ideology, threat_level)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [name, ideology, threat_level];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
       console.log('Error adding organization at addOrganizationRepository:', error);
       throw error; 
    }
}
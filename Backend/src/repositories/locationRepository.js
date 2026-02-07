import pool from "../config/dbConnection.js";

export const addLocationRepository = async (locationData) => {
    try {
        const { district, address, zone } = locationData;
        const query = `
            INSERT INTO location (district, address, zone)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [district, address, zone];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding location at addLocationRepository:', error);
        throw error;
    }
}
import pool from '../config/dbConnection.js';

export const addJailRepository = async (jailData) => {
    try {
        const { jail_name, district, zone, address, capacity } = jailData;
        const query = `
            INSERT INTO jail (jail_name, district, zone, address, capacity)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [jail_name, district, zone, address, capacity];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding jail at addJailRepository:', error);
        throw error;
    }
}
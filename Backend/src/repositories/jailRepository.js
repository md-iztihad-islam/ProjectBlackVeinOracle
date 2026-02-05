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

export const getAllJailsRepository = async () => {
    try {
        const query = `SELECT * FROM jail;`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching jails at getAllJailsRepository:', error);
        throw error;
    }
}

export const getJailByIdRepository = async (jailId) => {
    try {
        const query = `SELECT * FROM jail WHERE jail_id = $1;`;
        const values = [jailId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching jail by ID at getJailByIdRepository:', error);
        throw error;
    }
}
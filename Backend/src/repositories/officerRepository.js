import pool from '../config/dbConnection.js';

export const addOfficerRepository = async (officerData) => {
    try {
        const { badge_no, full_name, rank_code, thana_id, phone, email, image_url, password } = officerData;
        const query = `
            INSERT INTO officer (badge_no, full_name, rank_code, thana_id, phone, email, image_url, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [badge_no, full_name, rank_code, thana_id, phone, email, image_url, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding officer at addOfficerRepository:', error);
        throw error;
    }
}

export const getOfficerByEmailRepository = async (email) => {
    try {
        const query = 'SELECT * FROM officer WHERE email = $1;';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching officer by email at getOfficerByEmailRepository:', error);
        throw error;
    }
}

export const getAllOfficersRepository = async () => {
    try {
        const query = 'SELECT * FROM officer;';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all officers at getAllOfficersRepository:', error);
        throw error;
    }
}

export const getOfficerByThanaIdRepository = async (thana_id) => {
    try {
        const query = `
            SELECT *
            FROM officer
            WHERE thana_id = $1;
        `;
        const result = await pool.query(query, [thana_id]);
        return result.rows;
    } catch (error) {
        console.log('Error fetching officers by thana ID at getOfficerByThanaIdRepository:', error);
        throw error;
    }
}
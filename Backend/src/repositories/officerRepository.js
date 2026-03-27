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

export const getOfficersByRankRepository = async (rankId) => {
    try {
        const query = `SELECT o.*, r.rank_name FROM officer o JOIN rank r ON o.rank_code = r.rank_code WHERE o.rank_code = $1;`;
        const result = await pool.query(query, [rankId]);
        return result.rows;
    } catch (error) {
        console.log('Error fetching officers by rank at getOfficersByRankRepository:', error);
        throw error;
    }
}


export const updateOfficerRepository = async (officerId, data) => {
    try {
        const { full_name, phone, badge_no, rank_code, thana_id } = data;
        const query = `
            UPDATE officer SET full_name=$1, phone=$2, badge_no=$3, rank_code=$4, thana_id=$5
            WHERE officer_id=$6
            RETURNING *;
        `;
        const values = [full_name, phone, badge_no, rank_code, thana_id, officerId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating officer at updateOfficerRepository:', error);
        throw error;
    }
}


export const deleteOfficerRepository = async (officerId) => {
    try {
        const query = 'DELETE FROM officer WHERE officer_id=$1 RETURNING *;';
        const result = await pool.query(query, [officerId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting officer at deleteOfficerRepository:', error);
        throw error;
    }
}


export const searchOfficersRepository = async (searchTerm) => {
    try {
        const query = `SELECT o.*, r.rank_name FROM officer o LEFT JOIN rank r ON o.rank_code = r.rank_code WHERE o.full_name ILIKE $1 OR o.badge_no ILIKE $1;`;
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    } catch (error) {
        console.log('Error searching officers at searchOfficersRepository:', error);
        throw error;
    }
}

export const getOfficerByIdRepository = async (officerId) => {
    try {
        const query = 'SELECT * FROM officer WHERE officer_id = $1;';
        const result = await pool.query(query, [officerId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching officer by ID at getOfficerByIdRepository:', error);
        throw error;
    }
}
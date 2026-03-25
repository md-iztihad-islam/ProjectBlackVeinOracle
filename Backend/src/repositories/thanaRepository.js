import pool from '../config/dbConnection.js';

export const addThanaRepository = async (thanaData) => {
    try {
        const { thana_name, district, zone, address, phone, email, password, created_by_admin_id, head_officer_id } = thanaData;
        const query = `
            INSERT INTO thana (thana_name, district, zone, address, phone, email, password, created_by_admin_id, head_officer_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [thana_name, district, zone, address, phone, email, password, created_by_admin_id, head_officer_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding thana at addThanaRepository:', error);
        throw error;
    }
};

export const getThanaByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM thana WHERE email = $1;';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching thana by email at getThanaByEmail:', error);
        throw error;
    }
}

export const addHeadOfficerToThanaRepository = async (thana_id, head_officer_id) => {
    try {
        const query = `
            UPDATE thana
            SET head_officer_id = $1
            WHERE thana_id = $2
            RETURNING *;
        `;
        const values = [head_officer_id, thana_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding head officer to thana at addHeadOfficerToThanaRepository:', error);
        throw error;
    }
}

export const getThanaByDistrictRepository = async (district) => {
    try {
        const query = `
            SELECT * FROM thana
            WHERE district = $1;
        `;
        const values = [district];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching thanas by district at getThanaByDistrictRepository:', error);
        throw error;
    }
}

export const getAllThanasRepository = async () => {
    try {
        const query = 'SELECT * FROM thana;';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all thanas at getAllThanasRepository:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const getThanaByIdRepository = async (thanaId) => {
    try {
        const query = 'SELECT * FROM thana WHERE thana_id = $1;';
        const result = await pool.query(query, [thanaId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching thana by ID at getThanaByIdRepository:', error);
        throw error;
    }
}


export const updateThanaRepository = async (thanaId, data) => {
    try {
        console.log('Data received in updateThanaRepository:', data);
        const { thana_name, district, zone, address, phone, email } = data;
        const { head_officer_id } = data || {};
        const query = `
            UPDATE thana
            SET thana_name=$1, district=$2, zone=$3, address=$4, phone=$5, email=$6, head_officer_id=$8
            WHERE thana_id=$7
            RETURNING *;
        `;
        const values = [thana_name, district, zone, address, phone, email, thanaId, head_officer_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating thana at updateThanaRepository:', error);
        throw error;
    }
}

export const deleteThanaRepository = async (thanaId) => {
    try {
        const query = 'DELETE FROM thana WHERE thana_id=$1 RETURNING *;';
        const result = await pool.query(query, [thanaId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting thana at deleteThanaRepository:', error);
        throw error;
    }
}
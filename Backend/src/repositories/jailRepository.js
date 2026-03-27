import pool from '../config/dbConnection.js';

export const addJailRepository = async (jailData) => {
    try {
        const { jail_name, district, zone, address, capacity, email, password } = jailData; 
        const query = `
            INSERT INTO jail (jail_name, district, zone, address, capacity, email, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [jail_name, district, zone, address, capacity, email, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding jail at addJailRepository:', error);
        throw error;
    }
}

export const getJailByEmailRepository = async (email) => {
    try {
        const query = `
            SELECT * FROM jail WHERE email = $1;
        `;
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {   
        console.log('Error fetching jail by email at getJailByEmailRepository:', error);
        throw error;
    }
}

export const getAllJailsRepository = async () => {
    try {
        const query = `
            SELECT j.jail_id, j.jail_name, j.district, j.zone, j.address, j.capacity, j.email
            FROM jail j;
        `
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching jails at getAllJailsRepository:', error);
        throw error;
    }
}

export const getJailByIdRepository = async (jailId) => {
    try {
        const query = `
            SELECT j.jail_id, j.jail_name, j.district, j.zone, j.address, j.capacity, j.email
            FROM jail j
            WHERE j.jail_id = $1;
        `
        const values = [jailId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching jail by ID at getJailByIdRepository:', error);
        throw error;
    }
}

export const getJailByNameRepository = async (jailName) => {
    try {
        const query = `
            SELECT j.jail_id, j.jail_name, j.district, j.zone, j.address, j.capacity,
            cb.block_id, cb.block_name,
            c.cell_id, c.cell_number, c.capacity AS cell_capacity
            FROM jail j LEFT JOIN cell_block cb ON j.jail_id = cb.jail_id
            LEFT JOIN cell c ON cb.block_id = c.block_id
            WHERE j.jail_name LIKE $1;  
        `
        const values = [`%${jailName}%`];
        const result = await pool.query(query, values);
        console.log('Query result for getJailByNameRepository:', result); 
        return result.rows;
    } catch (error) {
        console.log('Error fetching jail by name at getJailByNameRepository:', error);
        throw error;
    }
}

export const getJailByDistrictRepository = async (district) => {
    try {
       const query = `
            SELECT j.jail_id, j.jail_name, j.district, j.zone, j.address, j.capacity,
            cb.block_id, cb.block_name,
            c.cell_id, c.cell_number, c.capacity AS cell_capacity
            FROM jail j LEFT JOIN cell_block cb ON j.jail_id = cb.jail_id
            LEFT JOIN cell c ON cb.block_id = c.block_id
            WHERE j.district LIKE $1;  
        `
        const values = [`%${district}%`];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching jail by district at getJailByDistrictRepository:', error);
        throw error;
    }
}

export const getJailByZoneRepository = async (zone) => {
    try {
        const query = `
            SELECT j.jail_id, j.jail_name, j.district, j.zone, j.address, j.capacity,
            cb.block_id, cb.block_name,
            c.cell_id, c.cell_number, c.capacity AS cell_capacity
            FROM jail j LEFT JOIN cell_block cb ON j.jail_id = cb.jail_id
            LEFT JOIN cell c ON cb.block_id = c.block_id
            WHERE j.zone LIKE $1;  
        `
        const values = [`%${zone}%`];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching jail by zone at getJailByZoneRepository:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const updateJailRepository = async (jailId, data) => {
    try {
        const { jail_name, zone, district, capacity } = data;
        const query = `
            UPDATE jail SET jail_name = $1, zone = $2, district = $3, capacity = $4
            WHERE jail_id = $5
            RETURNING *;
        `;
        const values = [jail_name, zone, district, capacity, jailId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating jail at updateJailRepository:', error);
        throw error;
    }
}


export const deleteJailRepository = async (jailId) => {
    try {
        const query = 'DELETE FROM jail WHERE jail_id = $1 RETURNING *;';
        const result = await pool.query(query, [jailId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting jail at deleteJailRepository:', error);
        throw error;
    }
}

import pool from '../config/dbConnection.js';

export const addCellRepository = async (cellData) => {
    try {
        const { block_id, cell_number, capacity, status } = cellData;
        const query ='INSERT INTO cell (block_id, cell_number, capacity, status) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [block_id, cell_number, capacity, status || 'available'];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding cell at addCellRepository:', error);
        throw error;
    }
};

export const getAllCellsRepository = async () => {
    try {
        const query = 'SELECT c.*, cb.block_name, j.jail_name FROM cell c JOIN cell_block cb ON c.block_id = cb.block_id JOIN jail j ON cb.jail_id = j.jail_id ORDER BY j.jail_name, cb.block_name, c.cell_number';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching cells at getAllCellsRepository:', error);
        throw error;
    }
};

export const getCellByIdRepository = async (cell_id) => {
    try {
        const query = 'SELECT c.*, cb.block_name, j.jail_name FROM cell c JOIN cell_block cb ON c.block_id = cb.block_id JOIN jail j ON cb.jail_id = j.jail_id WHERE c.cell_id = $1';
        const values = [cell_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching cell by ID at getCellByIdRepository:', error);
        throw error;
    }
};

export const getCellsByBlockRepository = async (block_id) => {
    try {
        const query = 'SELECT * FROM cell WHERE block_id = $1 ORDER BY cell_number';
        const values = [block_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching cells by block ID at getCellsByBlockRepository:', error);
        throw error;
    }
};

export const updateCellRepository = async (cell_id, cellData) => {
    try {
        const { cell_number, capacity, status, number_of_people } = cellData;
        const query = 'UPDATE cell SET cell_number = $1, capacity = $2, status = $3, number_of_people = $4 WHERE cell_id = $5 RETURNING *';
        const values = [cell_number, capacity, status, number_of_people, cell_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating cell at updateCellRepository:', error);
        throw error;
    }
};

export const deleteCellRepository = async (cell_id) => {
    try {
        const query = 'DELETE FROM cell WHERE cell_id = $1 RETURNING *';
        const values = [cell_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting cell at deleteCellRepository:', error);
        throw error;
    }
};

export const getAvailableCellsRepository = async (jailid) => {
    try {
        const query = 'SELECT c.*, cb.block_name FROM cell c JOIN cell_block cb ON c.block_id = cb.block_id WHERE cb.jail_id = $1 AND c.status = $2 AND c.number_of_people < c.capacity ORDER BY cb.block_name, c.cell_number';
        const values = [jailid, 'available'];
        const result = await pool.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.log('Error fetching available cells at getAvailableCellsRepository:', error);
        throw error;
    }
};
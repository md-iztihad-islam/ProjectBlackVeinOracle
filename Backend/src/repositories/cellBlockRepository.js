import pool from '../config/dbConnection.js';

export const addCellBlocksRepository = async (cellBlockData) => {
    try {
        const { jail_id ,block_name, capacity } = cellBlockData;
        const query = `
            INSERT INTO cell_block (jail_id, block_name, capacity)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [jail_id, block_name, capacity];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding cell block at addCellBlocksRepository:', error);
        throw error;
    }
};

export const getAllCellBlocksRepository = async () => {
    try {
        const query = 'SELECT cb.*, j.jail_name FROM cell_block cb JOIN jail j ON cb.jail_id = j.jail_id';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching cell blocks at getAllCellBlocksRepository:', error);
        throw error;
    }
};

export const getCellBlockByIdRepository = async (cell_block_id) => {
    try {
        const query = 'SELECT cb.*, j.jail_name FROM cell_block cb JOIN jail j ON cb.jail_id = j.jail_id WHERE cb.block_id = $1';
        const values = [cell_block_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching cell block by ID at getCellBlockByIdRepository:', error);
        throw error;
    }
};

export const getCellBlocksByJailRepository = async(jail_id) => {
    try {
        const query = 'SELECT * FROM cell_block WHERE jail_id = $1 ORDER BY block_id';
        const values = [jail_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching cell blocks by jail ID at getCellBlocksByJailRepository:', error);
        throw error;    
    }
}

export const updateCellBlockRepository = async (cell_block_id, cellBlockData) => {
    try {
        const{block_name, capacity} = cellBlockData;
        const query = 'UPDATE cell_block SET block_name = $1, capacity = $2 WHERE block_id = $3 RETURNING *';
        const values = [block_name, capacity, cell_block_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating cell block at updateCellBlockRepository:', error);
        throw error;
    }
};

export const deleteCellBlockRepository = async (blockId) => {
    try {
        const query = 'DELETE FROM cell_block WHERE block_id = $1 RETURNING *';
        const result = await pool.query(query, [blockId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting cell block at deleteCellBlockRepository:', error);
        throw error;
    }
}


import pool from '../config/dbConnection.js';

export const addCellRepository = async (cellData) => {
    try {
        const { block_id, cell_number, capacity, status } = cellData;
        const normalizedStatus = status === 'maintenance' ? 'maintenance' : 'available';
        const query ='INSERT INTO cell (block_id, cell_number, capacity, status) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [block_id, cell_number, capacity, normalizedStatus];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding cell at addCellRepository:', error);
        throw error;
    }
};

export const getAllCellsRepository = async () => {
    try {
        const query = `
            SELECT
                c.cell_id,
                c.block_id,
                c.cell_number,
                c.capacity,
                CASE
                    WHEN c.status = 'maintenance' THEN 'maintenance'
                    WHEN COALESCE(ai.cnt, 0) >= c.capacity THEN 'occupied'
                    ELSE 'available'
                END AS status,
                COALESCE(ai.cnt, 0)::INT AS number_of_people,
                cb.block_name,
                j.jail_name
            FROM cell c
            JOIN cell_block cb ON c.block_id = cb.block_id
            JOIN jail j ON cb.jail_id = j.jail_id
            LEFT JOIN (
                SELECT cell_id, COUNT(*)::INT AS cnt
                FROM incarceration
                WHERE released_at IS NULL AND cell_id IS NOT NULL
                GROUP BY cell_id
            ) ai ON ai.cell_id = c.cell_id
            ORDER BY j.jail_name, cb.block_name, c.cell_number
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching cells at getAllCellsRepository:', error);
        throw error;
    }
};

export const getCellByIdRepository = async (cell_id) => {
    try {
        const query = `
            SELECT
                c.cell_id,
                c.block_id,
                c.cell_number,
                c.capacity,
                CASE
                    WHEN c.status = 'maintenance' THEN 'maintenance'
                    WHEN COALESCE(ai.cnt, 0) >= c.capacity THEN 'occupied'
                    ELSE 'available'
                END AS status,
                COALESCE(ai.cnt, 0)::INT AS number_of_people,
                cb.block_name,
                j.jail_name
            FROM cell c
            JOIN cell_block cb ON c.block_id = cb.block_id
            JOIN jail j ON cb.jail_id = j.jail_id
            LEFT JOIN (
                SELECT cell_id, COUNT(*)::INT AS cnt
                FROM incarceration
                WHERE released_at IS NULL AND cell_id IS NOT NULL
                GROUP BY cell_id
            ) ai ON ai.cell_id = c.cell_id
            WHERE c.cell_id = $1
        `;
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
        const query = `
            SELECT
                c.cell_id,
                c.block_id,
                c.cell_number,
                c.capacity,
                CASE
                    WHEN c.status = 'maintenance' THEN 'maintenance'
                    WHEN COALESCE(ai.cnt, 0) >= c.capacity THEN 'occupied'
                    ELSE 'available'
                END AS status,
                COALESCE(ai.cnt, 0)::INT AS number_of_people
            FROM cell c
            LEFT JOIN (
                SELECT cell_id, COUNT(*)::INT AS cnt
                FROM incarceration
                WHERE released_at IS NULL AND cell_id IS NOT NULL
                GROUP BY cell_id
            ) ai ON ai.cell_id = c.cell_id
            WHERE c.block_id = $1
            ORDER BY c.cell_number
        `;
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
        const { cell_number, capacity, status } = cellData;
        const normalizedStatus = status === 'maintenance' ? 'maintenance' : 'available';
        const query = 'UPDATE cell SET cell_number = $1, capacity = $2, status = $3 WHERE cell_id = $4 RETURNING *';
        const values = [cell_number, capacity, normalizedStatus, cell_id];
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
        const query = `
            SELECT
                c.cell_id,
                c.block_id,
                c.cell_number,
                c.capacity,
                CASE
                    WHEN c.status = 'maintenance' THEN 'maintenance'
                    WHEN COALESCE(ai.cnt, 0) >= c.capacity THEN 'occupied'
                    ELSE 'available'
                END AS status,
                COALESCE(ai.cnt, 0)::INT AS number_of_people,
                cb.block_name
            FROM cell c
            JOIN cell_block cb ON c.block_id = cb.block_id
            LEFT JOIN (
                SELECT cell_id, COUNT(*)::INT AS cnt
                FROM incarceration
                WHERE released_at IS NULL AND cell_id IS NOT NULL
                GROUP BY cell_id
            ) ai ON ai.cell_id = c.cell_id
            WHERE cb.jail_id = $1
              AND c.status <> 'maintenance'
              AND COALESCE(ai.cnt, 0) < c.capacity
            ORDER BY cb.block_name, c.cell_number
        `;
        const values = [jailid];
        const result = await pool.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.log('Error fetching available cells at getAvailableCellsRepository:', error);
        throw error;
    }
};
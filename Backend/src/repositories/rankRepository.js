import pool from '../config/dbConnection.js';

export const addRankRepository = async (rankData) => {
    try {
        const { rank_code, rank_name, level } = rankData;
        const query = `
            INSERT INTO rank (rank_code, rank_name, level)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [rank_code, rank_name, level];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding rank at addRankRepository:', error);
        throw error;
    }
}

// by Rayyan 2.0

export const getAllRanksRepository = async () => {
    try {
        const query = 'SELECT * FROM rank ORDER BY level ASC;';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all ranks at getAllRanksRepository:', error);
        throw error;
    }
}

export const getRankByIdRepository = async (rankId) => {
    try {
        const query = 'SELECT * FROM rank WHERE rank_code = $1;';
        const result = await pool.query(query, [rankId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching rank by ID at getRankByIdRepository:', error);
        throw error;
    }
}


export const updateRankRepository = async (rankId, data) => {
    try {
        const { rank_name, level } = data;
        const query = `
            UPDATE rank SET rank_name = $1, level = $2
            WHERE rank_code = $3
            RETURNING *;
        `;
        const values = [rank_name, level, rankId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating rank at updateRankRepository:', error);
        throw error;
    }
}

export const deleteRankRepository = async (rankId) => {
    try {
        const query = 'DELETE FROM rank WHERE rank_code = $1 RETURNING *;';
        const result = await pool.query(query, [rankId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting rank at deleteRankRepository:', error);
        throw error;
    }
}
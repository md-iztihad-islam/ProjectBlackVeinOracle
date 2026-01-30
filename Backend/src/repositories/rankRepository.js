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
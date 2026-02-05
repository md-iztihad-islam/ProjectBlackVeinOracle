export const addCellBlocksRepository = async (cellBlockData) => {
    try {
        const { jail_id ,block_name, capacity } = cellBlockData;
        const query = `
            INSERT INTO cell_blocks (jail_id, block_name, capacity)
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
}
import pool from '../config/dbConnection.js';

//advanced queries 

//each jail er total capacity, current inmates and occupancy koto percent
export const getJailOccupancySummaryRepository  = async() => {
    try {
        const query = `
            SELECT j.jail_id, j.jail_name, j.district, j.capacity AS total_capacity,
            COUNT(i.incarceration_id) FILTER (WHERE i.released_at IS NULL) AS current_inmates,
            ROUND(COUNT(i.incarceration_id) FILTER (WHERE i.released_at IS NULL) * 100.0 / NULLIF(j.capacity, 0), 2) AS occupancy_percentage
            FROM jail j
            LEFT JOIN incarceration i ON j.jail_id = i.jail_id
            GROUP BY j.jail_id, j.jail_name, j.district, j.capacity
            ORDER BY occupancy_percentage DESC NULLS LAST;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getJailOccupancySummaryRepository:", error);
        throw error;
    }
}
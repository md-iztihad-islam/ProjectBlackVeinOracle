import pool from '../config/dbConnection.js';

export const addIncarcerationRepository = async (IncData) => {
    try {
        const {jail_id, arrest_id, cell_id} = IncData;
        const query = `
            INSERT INTO incarceration (jail_id, arrest_id, cell_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [jail_id, arrest_id, cell_id];
        const result = await pool.query(query, values);
        return result.rows[0];


    } catch (error) {
        console.log('Error adding incarceration at addIncarcerationRepository', error);
        throw error;
    }
};


export const getAllIncarcerationsRepository = async () => {
    try {
        const query = `
            SELECT i.*, j.jail_name, c.cell_number, cb.block_name, cm.full_name AS criminal_name, ar.custody_status
            FROM incarceration i
            JOIN jail j ON i.jail_id = j.jail_id
            JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
            JOIN criminal cm ON ar.criminal_id = cm.criminal_id
            LEFT JOIN cell c ON i.cell_id = c.cell_id
            LEFT JOIN cell_block cb ON c.block_id = cb.block_id
            ORDER BY i.admitted_at DESC;
        `;
        // left join -> emon hoite criminal admitted to jail but ekhno cell assign hoy nai
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching incarcerations at getAllIncarcerationsRepository:', error);
        throw error;
    }
};

export const getIncarcerationByIdRepository = async (incId) => {
  try {
    const query = `
            SELECT i.*, j.jail_name, c.cell_number, cb.block_name,
                   cr.full_name AS criminal_name, ar.custody_status
            FROM incarceration i
            JOIN jail j ON i.jail_id = j.jail_id
            JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
            JOIN criminal cr ON ar.criminal_id = cr.criminal_id
            LEFT JOIN cell c ON i.cell_id = c.cell_id
            LEFT JOIN cell_block cb ON c.block_id = cb.block_id
            WHERE i.incarceration_id = $1;
        `;
    const result = await pool.query(query, [incId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at getIncarcerationByIdRepository:", error);
    throw error;
  }
};


export const getIncarcerationsByJailRepository = async (jailId) => {
  try {
    const query = `
            SELECT i.*, cr.full_name AS criminal_name, c.cell_number, cb.block_name
            FROM incarceration i
            JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
            JOIN criminal cr ON ar.criminal_id = cr.criminal_id
            LEFT JOIN cell c ON i.cell_id = c.cell_id
            LEFT JOIN cell_block cb ON c.block_id = cb.block_id
            WHERE i.jail_id = $1 AND i.released_at IS NULL
            ORDER BY i.admitted_at DESC;
        `;
    const result = await pool.query(query, [jailId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getIncarcerationsByJailRepository:", error);
    throw error;
  }
};

export const releaseIncarcerationRepository = async (incId) => {
    try{
        const query = `
            UPDATE incarceration SET released_at = NOW()
            WHERE incarceration_id = $1 RETURNING *;
        `;
        const result = await pool.query(query, [incId]);
        return result.rows[0];
    }
    catch (error) {
        console.log('Error releasing incarceration at releaseIncarcerationRepository:', error);
        throw error;
    }
};

export const updateIncarcerationRepository = async (incId, incData) => {
  try {
    const { cell_id } = incData;
    const query = `
            UPDATE incarceration SET cell_id = $1
            WHERE incarceration_id = $2 RETURNING *;
        `;
    const result = await pool.query(query, [cell_id, incId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at updateIncarcerationRepository:", error);
    throw error;
  }
};



export const deleteIncarcerationRepository = async (incId) => {
  try {
    const query = `DELETE FROM incarceration WHERE incarceration_id = $1 RETURNING *;`;
    const result = await pool.query(query, [incId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at deleteIncarcerationRepository:", error);
    throw error;
  }
};

export const getIncarcerationsByCriminalRepository = async (criminalId) => {
  try {
    const query = `
            SELECT i.*, j.jail_name, c.cell_number, cb.block_name
            FROM incarceration i
            JOIN jail j ON i.jail_id = j.jail_id
            LEFT JOIN cell c ON i.cell_id = c.cell_id
            LEFT JOIN cell_block cb ON c.block_id = cb.block_id
            JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
            WHERE ar.criminal_id = $1
            ORDER BY i.admitted_at DESC;
        `;
    const result = await pool.query(query, [criminalId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getIncarcerationsByCriminalRepository:", error);
    throw error;
  }
};

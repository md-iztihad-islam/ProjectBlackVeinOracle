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


// by Rayyan 2.0


export const findAvailableCellRepository = async (jailId) => {
    try {
    const query = `
      SELECT ce.cell_id
      FROM cell ce
      JOIN cell_block cb ON ce.block_id = cb.block_id
      WHERE cb.jail_id = $1
        AND ce.number_of_people < ce.capacity
        AND ce.status <> 'maintenance'
      ORDER BY (ce.capacity - ce.number_of_people) DESC, ce.cell_id
      LIMIT 1
    `;
    const result = await pool.query(query, [jailId]);
    return { cell_id: result.rows[0]?.cell_id || null };
    } catch (error) {
        console.log("Error at findAvailableCellRepository:", error);
        throw error;
    }
};



export const transferCriminalRepository = async (criminalId, fromJailId, toJailId, toCellId, reason, authorizedBy) => {
    try {
    if (!criminalId || !fromJailId || !toJailId || !reason) {
      throw new Error("criminalId, fromJailId, toJailId, and reason are required");
    }

    if (fromJailId === toJailId) {
      throw new Error("From jail and To jail cannot be the same");
    }

    let resolvedCellId = toCellId || null;

    // If caller passes a block id (CLB-*), resolve best available cell in that block.
    if (resolvedCellId && /^CLB-/i.test(resolvedCellId)) {
      const blockCellQuery = `
        SELECT ce.cell_id
        FROM cell ce
        JOIN cell_block cb ON ce.block_id = cb.block_id
        WHERE cb.block_id = $1
          AND cb.jail_id = $2
          AND ce.number_of_people < ce.capacity
          AND ce.status <> 'maintenance'
        ORDER BY (ce.capacity - ce.number_of_people) DESC, ce.cell_id
        LIMIT 1
      `;
      const blockCellResult = await pool.query(blockCellQuery, [resolvedCellId, toJailId]);
      resolvedCellId = blockCellResult.rows[0]?.cell_id || null;
      if (!resolvedCellId) {
        throw new Error(`No available cell found in block ${toCellId} under jail ${toJailId}`);
      }
    }

    // If no cell id provided, auto-pick best available cell from destination jail.
    if (!resolvedCellId) {
      const autoCellQuery = `
        SELECT ce.cell_id
        FROM cell ce
        JOIN cell_block cb ON ce.block_id = cb.block_id
        WHERE cb.jail_id = $1
          AND ce.number_of_people < ce.capacity
          AND ce.status <> 'maintenance'
        ORDER BY (ce.capacity - ce.number_of_people) DESC, ce.cell_id
        LIMIT 1
      `;
      const autoCellResult = await pool.query(autoCellQuery, [toJailId]);
      resolvedCellId = autoCellResult.rows[0]?.cell_id || null;
      if (!resolvedCellId) {
        throw new Error(`No available cell found in destination jail ${toJailId}`);
      }
    } else {
      // Validate the provided/derived cell belongs to destination jail and is available.
      const validateCellQuery = `
        SELECT ce.cell_id
        FROM cell ce
        JOIN cell_block cb ON ce.block_id = cb.block_id
        WHERE ce.cell_id = $1
          AND cb.jail_id = $2
          AND ce.number_of_people < ce.capacity
          AND ce.status <> 'maintenance'
        LIMIT 1
      `;
      const validateCellResult = await pool.query(validateCellQuery, [resolvedCellId, toJailId]);
      if (!validateCellResult.rows[0]) {
        throw new Error(`Cell ${resolvedCellId} is invalid/unavailable for destination jail ${toJailId}`);
      }
    }

        const query = `CALL proc_transfer_criminal($1, $2, $3, $4, $5, $6)`;
    await pool.query(query, [criminalId, fromJailId, toJailId, resolvedCellId, reason, authorizedBy]);
    return { success: true, toCellId: resolvedCellId };
    } catch (error) {
        console.log("Error at transferCriminalRepository:", error);
    throw new Error(error?.message || "Transfer failed");
    }
};



export const getTransferHistoryRepository = async (criminalId) => {
    try {
        const query = `
            SELECT ct.*, 
                   fj.jail_name AS from_jail_name, 
                   tj.jail_name AS to_jail_name
            FROM criminal_transfer ct
            LEFT JOIN jail fj ON ct.from_jail_id = fj.jail_id
            LEFT JOIN jail tj ON ct.to_jail_id = tj.jail_id
            WHERE ct.criminal_id = $1
            ORDER BY ct.transferred_at DESC
        `;
        const result = await pool.query(query, [criminalId]);
        return result.rows;
    } catch (error) {
        console.log("Error at getTransferHistoryRepository:", error);
        throw error;
    }
};

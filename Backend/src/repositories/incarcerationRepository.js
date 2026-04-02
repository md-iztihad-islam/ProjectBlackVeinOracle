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
            SELECT i.*, ar.criminal_id, ar.custody_status, cr.full_name AS criminal_name, cr.status AS criminal_status, c.cell_number, cb.block_name
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
  const client = await pool.connect();
  try{
    await client.query('BEGIN');

    const currentResult = await client.query(
      `
      SELECT i.incarceration_id, i.cell_id, i.arrest_id, ar.criminal_id
      FROM incarceration i
      JOIN arrest_record ar ON ar.arrest_id = i.arrest_id
      WHERE i.incarceration_id = $1
        AND i.released_at IS NULL
      FOR UPDATE
      `,
      [incId]
    );

    const current = currentResult.rows[0];
    if (!current) {
      await client.query('ROLLBACK');
      return null;
    }

    const result = await client.query(
      `
      UPDATE incarceration
      SET released_at = NOW()
      WHERE incarceration_id = $1
      RETURNING *
      `,
      [incId]
    );

    if (current.cell_id) {
      await client.query(
        `
        UPDATE cell
        SET number_of_people = GREATEST(number_of_people - 1, 0),
          status = CASE
            WHEN status = 'maintenance' THEN status
            WHEN GREATEST(number_of_people - 1, 0) <= 0 THEN 'available'
            ELSE status
          END
        WHERE cell_id = $1
        `,
        [current.cell_id]
      );
    }

    await client.query(
      `UPDATE arrest_record SET custody_status = 'released' WHERE arrest_id = $1`,
      [current.arrest_id]
    );

    const activeCheck = await client.query(
      `
      SELECT 1
      FROM incarceration i
      JOIN arrest_record ar ON ar.arrest_id = i.arrest_id
      WHERE ar.criminal_id = $1
        AND i.released_at IS NULL
      LIMIT 1
      `,
      [current.criminal_id]
    );

    await client.query(
      `UPDATE criminal SET status = $1 WHERE criminal_id = $2`,
      [activeCheck.rows[0] ? 'in_custody' : 'released', current.criminal_id]
    );

    await client.query('COMMIT');
    return result.rows[0];
  }
  catch (error) {
    await client.query('ROLLBACK');
    console.log('Error releasing incarceration at releaseIncarcerationRepository:', error);
    throw error;
  } finally {
    client.release();
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

    // Notify destination jail with transfer details
    const transferDetailsQuery = `
      SELECT
        c.full_name AS criminal_name,
        ct.criminal_id,
        fj.jail_name AS from_jail_name,
        tj.jail_name AS to_jail_name,
        cfrom.cell_number AS from_cell_number,
        cto.cell_number AS to_cell_number
      FROM criminal_transfer ct
      JOIN criminal c ON c.criminal_id = ct.criminal_id
      LEFT JOIN jail fj ON fj.jail_id = ct.from_jail_id
      LEFT JOIN jail tj ON tj.jail_id = ct.to_jail_id
      LEFT JOIN cell cfrom ON cfrom.cell_id = ct.from_cell_id
      LEFT JOIN cell cto ON cto.cell_id = ct.to_cell_id
      WHERE ct.criminal_id = $1
        AND ct.from_jail_id = $2
        AND ct.to_jail_id = $3
      ORDER BY ct.transferred_at DESC
      LIMIT 1
    `;
    const transferDetailsResult = await pool.query(transferDetailsQuery, [criminalId, fromJailId, toJailId]);
    const t = transferDetailsResult.rows[0];

    const notificationTitle = "CRIMINAL TRANSFER RECEIVED";
    const notificationMessage = t
      ? `Criminal ${t.criminal_name || "Unknown"} (${t.criminal_id}) has been transferred.\nFrom: ${t.from_jail_name || fromJailId} | Cell: ${t.from_cell_number || "Unassigned"}\nTo: ${t.to_jail_name || toJailId} | Cell: ${t.to_cell_number || "Unassigned"}\nReason: ${reason}`
      : `Criminal transfer received. Criminal ID: ${criminalId}. From jail: ${fromJailId}. To jail: ${toJailId}. To cell: ${resolvedCellId || "Unassigned"}. Reason: ${reason}`;

    await pool.query(
      `INSERT INTO notification (target_role, target_id, title, message) VALUES ($1, $2, $3, $4)`,
      ["jail", toJailId, notificationTitle, notificationMessage]
    );

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

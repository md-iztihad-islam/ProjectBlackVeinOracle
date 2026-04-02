import pool from "../config/dbConnection.js";



export const addBailRecordRepository = async (bailData) => {
  try {
    const {
      arrest_id,
      court_name,
      bail_amount,
      granted_at,
      surety_name,
      status,
    } = bailData;  
    const query = `
            INSERT INTO bail_record (arrest_id, court_name, bail_amount, granted_at, surety_name, status)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
    const result = await pool.query(query, [
      arrest_id,
      court_name,
      bail_amount,
      granted_at,
      surety_name,
      status || "pending",
    ]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at addBailRecordRepository:", error);
    throw error;
  }
};



export const getAllBailRecordsRepository = async () => {
  try {
    const query = `
            SELECT br.*, ar.criminal_id, c.full_name AS criminal_name, ar.arrest_date
            FROM bail_record br
            JOIN arrest_record ar ON br.arrest_id = ar.arrest_id
            JOIN criminal c ON ar.criminal_id = c.criminal_id
            ORDER BY br.bail_id DESC;
        `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.log("Error at getAllBailRecordsRepository:", error);
    throw error;
  }
};



export const getBailRecordByIdRepository = async (bailId) => {
  try {
    const query = `
            SELECT
              br.*,
              json_build_object(
                'arrest_id', ar.arrest_id,
                'arrest_date', ar.arrest_date,
                'bail_due_date', ar.bail_due_date,
                'custody_status', ar.custody_status,
                'thana_id', ar.thana_id,
                'case_reference', ar.case_reference
              ) AS arrest,
              json_build_object(
                'criminal_id', c.criminal_id,
                'full_name', c.full_name,
                'nid', c.nid,
                'status', c.status,
                'risk_level', c.risk_level,
                'registered_thana_id', c.registered_thana_id,
                'image_url', c.image_url,
                'birth_date', c.birth_date,
                'gender', c.gender,
                'aliases', c.aliases,
                'nationality', c.nationality,
                'permanent_address', c.permanent_address,
                'current_address', c.current_address,
                'identifying_marks', c.identifying_marks
              ) AS criminal,
              json_build_object(
                'thana_id', t.thana_id,
                'thana_name', t.thana_name,
                'district', t.district,
                'zone', t.zone,
                'address', t.address,
                'phone', t.phone,
                'email', t.email,
                'head_officer_id', t.head_officer_id
              ) AS thana,
              CASE
                WHEN cf.case_id IS NULL THEN NULL
                ELSE json_build_object(
                  'case_id', cf.case_id,
                  'case_title', cf.case_title,
                  'case_type', cf.case_type,
                  'status', cf.status,
                  'filed_at', cf.filed_at,
                  'description', cf.description
                )
              END AS case_file,
              COALESCE(incs.incarcerations, '[]'::json) AS incarcerations,
              incs.active_incarceration,
              stats.total_bail_records_for_arrest,
              stats.total_granted_bails_for_arrest,
              stats.total_rejected_bails_for_arrest,
              stats.total_pending_bails_for_arrest
            FROM bail_record br
            JOIN arrest_record ar ON br.arrest_id = ar.arrest_id
            JOIN criminal c ON ar.criminal_id = c.criminal_id
            JOIN thana t ON ar.thana_id = t.thana_id
            LEFT JOIN case_file cf ON cf.case_id::text = ar.case_reference
            LEFT JOIN LATERAL (
              SELECT
                json_agg(
                  json_build_object(
                    'incarceration_id', i.incarceration_id,
                    'jail_id', i.jail_id,
                    'jail_name', j.jail_name,
                    'jail_district', j.district,
                    'jail_zone', j.zone,
                    'cell_id', i.cell_id,
                    'cell_number', ce.cell_number,
                    'block_id', cb.block_id,
                    'block_name', cb.block_name,
                    'admitted_at', i.admitted_at,
                    'released_at', i.released_at,
                    'is_active', (i.released_at IS NULL)
                  )
                  ORDER BY i.admitted_at DESC
                ) AS incarcerations,
                (
                  SELECT json_build_object(
                    'incarceration_id', i2.incarceration_id,
                    'jail_id', i2.jail_id,
                    'jail_name', j2.jail_name,
                    'cell_id', i2.cell_id,
                    'cell_number', ce2.cell_number,
                    'block_id', cb2.block_id,
                    'block_name', cb2.block_name,
                    'admitted_at', i2.admitted_at
                  )
                  FROM incarceration i2
                  LEFT JOIN jail j2 ON j2.jail_id = i2.jail_id
                  LEFT JOIN cell ce2 ON ce2.cell_id = i2.cell_id
                  LEFT JOIN cell_block cb2 ON cb2.block_id = ce2.block_id
                  WHERE i2.arrest_id = ar.arrest_id AND i2.released_at IS NULL
                  ORDER BY i2.admitted_at DESC
                  LIMIT 1
                ) AS active_incarceration
              FROM incarceration i
              LEFT JOIN jail j ON j.jail_id = i.jail_id
              LEFT JOIN cell ce ON ce.cell_id = i.cell_id
              LEFT JOIN cell_block cb ON cb.block_id = ce.block_id
              WHERE i.arrest_id = ar.arrest_id
            ) incs ON TRUE
            LEFT JOIN LATERAL (
              SELECT
                COUNT(*) AS total_bail_records_for_arrest,
                COUNT(*) FILTER (WHERE b.status = 'granted') AS total_granted_bails_for_arrest,
                COUNT(*) FILTER (WHERE b.status = 'rejected') AS total_rejected_bails_for_arrest,
                COUNT(*) FILTER (WHERE b.status = 'pending') AS total_pending_bails_for_arrest
              FROM bail_record b
              WHERE b.arrest_id = ar.arrest_id
            ) stats ON TRUE
            WHERE br.bail_id = $1;
        `;
    const result = await pool.query(query, [bailId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at getBailRecordByIdRepository:", error);
    throw error;
  }
};



export const getBailRecordsByArrestRepository = async (arrestId) => {
  try {
    const query = `SELECT * FROM bail_record WHERE arrest_id = $1 ORDER BY bail_id DESC;`;
    const result = await pool.query(query, [arrestId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getBailRecordsByArrestRepository:", error);
    throw error;
  }
};



export const updateBailRecordRepository = async (bailId, bailData) => {
  try {
    const { court_name, bail_amount, granted_at, surety_name, status } =
      bailData;
    const query = `
            UPDATE bail_record SET court_name = $1, bail_amount = $2, granted_at = $3, surety_name = $4, status = $5
            WHERE bail_id = $6 RETURNING *;
        `;
    const result = await pool.query(query, [
      court_name,
      bail_amount,
      granted_at,
      surety_name,
      status,
      bailId,
    ]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at updateBailRecordRepository:", error);
    throw error;
  }
};



export const deleteBailRecordRepository = async (bailId) => {
  try {
    const query = `DELETE FROM bail_record WHERE bail_id = $1 RETURNING *;`;
    const result = await pool.query(query, [bailId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at deleteBailRecordRepository:", error);
    throw error;
  }
};

export const getBailRecordsByCriminalRepository = async (criminalId) => {
  try {
    const query = `
            SELECT br.*, ar.arrest_date, ar.custody_status
            FROM bail_record br
            JOIN arrest_record ar ON br.arrest_id = ar.arrest_id
            WHERE ar.criminal_id = $1
            ORDER BY br.bail_id DESC;
        `;
    const result = await pool.query(query, [criminalId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getBailRecordsByCriminalRepository:", error);
    throw error;
  }
};


// by Rayyan 2.0


export const processBailDecisionRepository = async (bailId, decision, bailAmount = null, suretyName = null) => {
    try {
        const query = `CALL proc_process_bail($1, $2, $3, $4)`;
        await pool.query(query, [bailId, decision, bailAmount, suretyName]);
        return { success: true };
    } catch (error) {
        console.log("Error at processBailDecisionRepository:", error);
        throw error;
    }
};
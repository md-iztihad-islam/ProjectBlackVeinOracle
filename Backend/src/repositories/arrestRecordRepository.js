import pool from "../config/dbConnection.js";

export const addArrestRecordRepository = async (arrestData) => {
  try {
    const {
      criminal_id,
      arrest_date,
      bail_due_date,
      custody_status,
      thana_id,
      case_reference,
    } = arrestData;
    const query = `
            INSERT INTO arrest_record (criminal_id, arrest_date, bail_due_date, custody_status, thana_id, case_reference)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
    const values = [criminal_id, arrest_date, bail_due_date, custody_status || "in_custody", thana_id, case_reference];
    const ressult = await pool.query(query, values);
    return ressult.rows[0];
  } catch (error) {
    console.log("Error at addArrestRecordRepository:", error);
    throw error;
  }
};

export const getAllArrestRecordsRepository = async () => {
  try {
    const query = `
            SELECT ar.*, c.full_name AS criminal_name, t.thana_name
            FROM arrest_record ar
            JOIN criminal c ON ar.criminal_id = c.criminal_id
            JOIN thana t ON ar.thana_id = t.thana_id
            ORDER BY ar.arrest_date DESC;
        `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.log("Error at getAllArrestRecordsRepository:", error);
    throw error;
  }
};




export const getArrestRecordByIdRepository = async (arrestId) => {
  try {
    const query = `
            SELECT
              ar.*,
              json_build_object(
                'criminal_id', c.criminal_id,
                'full_name', c.full_name,
                'nid', c.nid,
                'status', c.status,
                'risk_level', c.risk_level,
                'registered_thana_id', c.registered_thana_id,
                'image_url', c.image_url,
                'father_name', c.father_name,
                'mother_name', c.mother_name,
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
                  'description', cf.description,
                  'thana_id', cf.thana_id,
                  'criminal_id', cf.criminal_id
                )
              END AS case_file,
              COALESCE(brs.bail_records, '[]'::json) AS bail_records,
              COALESCE(incs.incarcerations, '[]'::json) AS incarcerations,
              incs.active_incarceration
            FROM arrest_record ar
            JOIN criminal c ON ar.criminal_id = c.criminal_id
            JOIN thana t ON ar.thana_id = t.thana_id
            LEFT JOIN case_file cf ON cf.case_id::text = ar.case_reference
            LEFT JOIN LATERAL (
              SELECT
                json_agg(
                  json_build_object(
                    'bail_id', br.bail_id,
                    'court_name', br.court_name,
                    'bail_amount', br.bail_amount,
                    'granted_at', br.granted_at,
                    'surety_name', br.surety_name,
                    'status', br.status
                  )
                  ORDER BY br.bail_id DESC
                ) AS bail_records
              FROM bail_record br
              WHERE br.arrest_id = ar.arrest_id
            ) brs ON TRUE
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
            WHERE ar.arrest_id = $1;
        `;
    const result = await pool.query(query, [arrestId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at getArrestRecordByIdRepository:", error);
    throw error;
  }
};



export const getArrestRecordsByCriminalRepository = async (criminalId) => {
  try {
    const query = `
            SELECT ar.*, t.thana_name
            FROM arrest_record ar
            JOIN thana t ON ar.thana_id = t.thana_id
            WHERE ar.criminal_id = $1
            ORDER BY ar.arrest_date DESC;
        `;
    const result = await pool.query(query, [criminalId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getArrestRecordsByCriminalRepository:", error);
    throw error;
  }
};



export const updateArrestRecordRepository = async (arrestId, arrestData) => {
  try {
    const { arrest_date, bail_due_date, custody_status, case_reference } =
      arrestData;
    const query = `
            UPDATE arrest_record SET arrest_date = $1, bail_due_date = $2, custody_status = $3, case_reference = $4
            WHERE arrest_id = $5 RETURNING *;
        `;
    const result = await pool.query(query, [
      arrest_date,
      bail_due_date,
      custody_status,
      case_reference,
      arrestId,
    ]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at updateArrestRecordRepository:", error);
    throw error;
  }
};



export const deleteArrestRecordRepository = async (arrestId) => {
  try {
    const query = `DELETE FROM arrest_record WHERE arrest_id = $1 RETURNING *;`;
    const result = await pool.query(query, [arrestId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at deleteArrestRecordRepository:", error);
    throw error;
  }
};

export const getArrestRecordsByThanaRepository = async (thanaId) => {
  try {
    const query = `
            SELECT ar.*, c.full_name AS criminal_name
            FROM arrest_record ar
            JOIN criminal c ON ar.criminal_id = c.criminal_id
            WHERE ar.thana_id = $1
            ORDER BY ar.arrest_date DESC;
        `;
    const result = await pool.query(query, [thanaId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getArrestRecordsByThanaRepository:", error);
    throw error;
  }
};
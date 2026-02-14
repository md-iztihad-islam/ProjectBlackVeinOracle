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
            SELECT ar.*, c.full_name AS criminal_name, t.thana_name
            FROM arrest_record ar
            JOIN criminal c ON ar.criminal_id = c.criminal_id
            JOIN thana t ON ar.thana_id = t.thana_id
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
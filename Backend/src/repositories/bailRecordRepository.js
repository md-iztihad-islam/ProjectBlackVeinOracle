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
            SELECT br.*, ar.criminal_id, c.full_name AS criminal_name, ar.arrest_date
            FROM bail_record br
            JOIN arrest_record ar ON br.arrest_id = ar.arrest_id
            JOIN criminal c ON ar.criminal_id = c.criminal_id
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
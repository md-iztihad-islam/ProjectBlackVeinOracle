import pool from '../config/dbConnection.js';

export const addCaseFileRepository = async (caseData) => {
    try {
        const { case_number, criminal_id,thana_id, case_type, status, description} =caseData;
        const query = 'INSERT INTO case_file (case_number, criminal_id, thana_id, case_type, status, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [case_number, criminal_id, thana_id, case_type, status || 'open', description];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding case file at addCaseFileRepository:', error);
        throw error;
    }
};

export const getAllCaseFilesRepository = async () => {
  try {
    const query = `
            SELECT cf.*, c.full_name AS criminal_name, t.thana_name
            FROM case_file cf
            JOIN criminal c ON cf.criminal_id = c.criminal_id
            JOIN thana t ON cf.thana_id = t.thana_id
            ORDER BY cf.filed_at DESC;
        `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.log("Error at getAllCaseFilesRepository:", error);
    throw error;
  }
};



export const getCaseFileByIdRepository = async (caseId) => {
  try {
    const query = `
            SELECT cf.*, c.full_name AS criminal_name, t.thana_name
            FROM case_file cf
            JOIN criminal c ON cf.criminal_id = c.criminal_id
            JOIN thana t ON cf.thana_id = t.thana_id
            WHERE cf.case_id = $1;
        `;
    const result = await pool.query(query, [caseId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at getCaseFileByIdRepository:", error);
    throw error;
  }
};

export const getCaseFilesByCriminalRepository = async (criminalId) => {
  try {
    const query = `
            SELECT cf.*, t.thana_name
            FROM case_file cf
            JOIN thana t ON cf.thana_id = t.thana_id
            WHERE cf.criminal_id = $1
            ORDER BY cf.filed_at DESC;
        `;
    const result = await pool.query(query, [criminalId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getCaseFilesByCriminalRepository:", error);
    throw error;
  }
};



export const getCaseFilesByThanaRepository = async (thanaId) => {
  try {
    const query = `
            SELECT cf.*, c.full_name AS criminal_name
            FROM case_file cf
            JOIN criminal c ON cf.criminal_id = c.criminal_id
            WHERE cf.thana_id = $1
            ORDER BY cf.filed_at DESC;
        `;
    const result = await pool.query(query, [thanaId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getCaseFilesByThanaRepository:", error);
    throw error;
  }
};

export const updateCaseFileRepository = async (caseId, caseData) => {
  try {
    const { case_type, status, description } = caseData;
    const query = `
            UPDATE case_file SET case_type = $1, status = $2, description = $3
            WHERE case_id = $4 RETURNING *;
        `;
    const result = await pool.query(query, [
      case_type,
      status,
      description,
      caseId,
    ]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at updateCaseFileRepository:", error);
    throw error;
  }
};



export const deleteCaseFileRepository = async (caseId) => {
  try {
    const query = `DELETE FROM case_file WHERE case_id = $1 RETURNING *;`;
    const result = await pool.query(query, [caseId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at deleteCaseFileRepository:", error);
    throw error;
  }
};



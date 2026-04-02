import pool from '../config/dbConnection.js';

let caseFileSchemaChecked = false;

const ensureCaseFileSchema = async () => {
  if (caseFileSchemaChecked) return;

  // Add case_title for legacy databases and relax old case_number requirement.
  await pool.query(`ALTER TABLE case_file ADD COLUMN IF NOT EXISTS case_title TEXT`);
  await pool.query(`UPDATE case_file SET case_title = COALESCE(NULLIF(TRIM(case_title), ''), 'Untitled Case') WHERE case_title IS NULL OR TRIM(case_title) = ''`);
  await pool.query(`ALTER TABLE case_file ALTER COLUMN case_title SET NOT NULL`);

  const caseNumberColumn = await pool.query(
    `SELECT 1 FROM information_schema.columns WHERE table_name = 'case_file' AND column_name = 'case_number' LIMIT 1`
  );
  if (caseNumberColumn.rows.length > 0) {
    await pool.query(`ALTER TABLE case_file ALTER COLUMN case_number DROP NOT NULL`);
  }

  // Ensure registration timestamp is always auto-captured on insert.
  await pool.query(`ALTER TABLE case_file ALTER COLUMN filed_at SET DEFAULT NOW()`);
  await pool.query(`UPDATE case_file SET filed_at = NOW() WHERE filed_at IS NULL`);
  await pool.query(`ALTER TABLE case_file ALTER COLUMN filed_at SET NOT NULL`);

  caseFileSchemaChecked = true;
};

export const addCaseFileRepository = async (caseData) => {
    try {
    await ensureCaseFileSchema();
    const { case_title, criminal_id,thana_id, case_type, status, description} =caseData;
  const query = 'INSERT INTO case_file (case_title, criminal_id, thana_id, case_type, status, description, filed_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *';
    const values = [case_title, criminal_id, thana_id, case_type, status || 'open', description];
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
    await ensureCaseFileSchema();
    const { case_title, case_type, status, description } = caseData;
    const query = `
            UPDATE case_file
            SET
                case_title = COALESCE(NULLIF($1, ''), case_title),
                case_type = COALESCE(NULLIF($2, ''), case_type),
                status = COALESCE(NULLIF($3, ''), status),
                description = COALESCE(NULLIF($4, ''), description)
            WHERE case_id = $5 RETURNING *;
        `;
    const result = await pool.query(query, [
      case_title,
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



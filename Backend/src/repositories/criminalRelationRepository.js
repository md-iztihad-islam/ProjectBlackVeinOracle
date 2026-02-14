import pool from '../config/dbConnection.js';   


export const addCriminalRelationRepository = async (relationData) => {
    try {
        const {criminal_id_1, criminal_id_2, relation_type} = relationData;
        const query = `
            INSERT INTO criminal_relation (criminal_id_1, criminal_id_2, relation_type)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [criminal_id_1, criminal_id_2, relation_type];
        const result = await pool.query(query, values);
        return result.rows[0];          
    } catch (error) {
        console.log('Error adding criminal relation at addCriminalRelationRepository:', error);
        throw error;

    }
};

export const getAllCriminalRelationsRepository = async () => {
  try {
    const query = `
            SELECT cr.*, c1.full_name AS criminal_1_name, c2.full_name AS criminal_2_name
            FROM criminal_relation cr
            JOIN criminal c1 ON cr.criminal_id_1 = c1.criminal_id
            JOIN criminal c2 ON cr.criminal_id_2 = c2.criminal_id
            ORDER BY cr.relation_id;
        `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.log("Error at getAllCriminalRelationsRepository:", error);
    throw error;
  }
};

export const getRelationsByCriminalRepository = async (criminalId) => {
  try {
    const query = `
            SELECT cr.*,
                CASE WHEN cr.criminal_id_1 = $1 THEN c2.full_name ELSE c1.full_name END AS related_criminal_name,
                CASE WHEN cr.criminal_id_1 = $1 THEN cr.criminal_id_2 ELSE cr.criminal_id_1 END AS related_criminal_id
            FROM criminal_relation cr
            JOIN criminal c1 ON cr.criminal_id_1 = c1.criminal_id
            JOIN criminal c2 ON cr.criminal_id_2 = c2.criminal_id
            WHERE cr.criminal_id_1 = $1 OR cr.criminal_id_2 = $1;
            `;
    const result = await pool.query(query, [criminalId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getRelationsByCriminalRepository:", error);
    throw error;
  }
};

export const updateCriminalRelationRepository = async (relationId, data) => {
  try {
    const { relation_type } = data;
    const query = `
            UPDATE criminal_relation SET relation_type = $1
            WHERE relation_id = $2 RETURNING *;
        `;
    const result = await pool.query(query, [relation_type, relationId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at updateCriminalRelationRepository:", error);
    throw error;
  }
};

export const deleteCriminalRelationRepository = async (relationId) => {
  try {
    const query = `DELETE FROM criminal_relation WHERE relation_id = $1 RETURNING *;`;
    const result = await pool.query(query, [relationId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at deleteCriminalRelationRepository:", error);
    throw error;
  }
};
import pool from "../config/dbConnection.js";

export const addCriminalOrganizationRepository = async (orgData) => {
    try {
        const {criminal_id, org_id, role} = orgData;
        const query = `
            INSERT INTO criminal_organization (criminal_id, org_id, role)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [criminal_id, org_id, role];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding criminal organization at addCriminalOrganizationRepository:', error);
        throw error;    
    }
};

export const getAllCriminalOrganizationsRepository = async () => {
    try {
        const query = `
            SELECT co.*, c.full_name AS criminal_name, o.name AS organization_name, o.threat_level
            FROM criminal_organization co
            JOIN criminal c ON co.criminal_id = c.criminal_id
            JOIN organization o ON co.org_id = o.org_id
            ORDER BY o.threat_level DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching criminal organizations at getAllCriminalOrganizationsRepository:', error);
        throw error;    
    }
};

export const getOrganizationsByCriminalRepository = async(criminal_id) => {
    try {
        const query = `
            SELECT co.role, o.*
            FROM criminal_organization co
            JOIN organization o ON co.org_id = o.org_id
            WHERE co.criminal_id = $1;
            `;
        const values = [criminal_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching organizations by criminal ID at getOrganizationsByCriminalRepository:', error);
        throw error;
    }
}



export const getCriminalsByOrganizationRepository = async (orgId) => {
  try {
    const query = `
            SELECT co.role, c.*
            FROM criminal_organization co
            JOIN criminal c ON co.criminal_id = c.criminal_id
            WHERE co.org_id = $1
            ORDER BY c.risk_level DESC;
        `;
    const result = await pool.query(query, [orgId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getCriminalsByOrganizationRepository:", error);
    throw error;
  }
};



export const updateCriminalOrganizationRepository = async (
  criminalId,
  orgId,
  data,
) => {
  try {
    const { role } = data;
    const query = `
            UPDATE criminal_organization SET role = $1
            WHERE criminal_id = $2 AND org_id = $3 RETURNING *;
        `;
    const result = await pool.query(query, [role, criminalId, orgId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at updateCriminalOrganizationRepository:", error);
    throw error;
  }
};



export const deleteCriminalOrganizationRepository = async (
  criminalId,
  orgId,
) => {
  try {
    const query = `DELETE FROM criminal_organization WHERE criminal_id = $1 AND org_id = $2 RETURNING *;`;
    const result = await pool.query(query, [criminalId, orgId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at deleteCriminalOrganizationRepository:", error);
    throw error;
  }
};
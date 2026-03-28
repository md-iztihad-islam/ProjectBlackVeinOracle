import pool from "../config/dbConnection.js";

export const addOrganizationRepository = async (organizationData) => {
    try {
        const { name, ideology, threat_level } = organizationData;
        const query = `
            INSERT INTO organization (name, ideology, threat_level)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [name, ideology, threat_level];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
       console.log('Error adding organization at addOrganizationRepository:', error);
       throw error; 
    }
}

// by Rayyan 2.0

export const getAllOrganizationsRepository = async () => {
    try {
        const query = 'SELECT * FROM organization;';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all organizations at getAllOrganizationsRepository:', error);
        throw error;
    }
}



export const getOrganizationByIdRepository = async (orgId) => {
    try {
        const query = 'SELECT * FROM organization WHERE org_id = $1;';
        const result = await pool.query(query, [orgId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching organization by ID at getOrganizationByIdRepository:', error);
        throw error;
    }
}

export const updateOrganizationRepository = async (orgId, data) => {
    try {
        const { name, ideology, threat_level } = data;
        const query = `
            UPDATE organization
            SET
                name = COALESCE($1, name),
                ideology = COALESCE($2, ideology),
                threat_level = COALESCE($3, threat_level)
            WHERE org_id = $4
            RETURNING *;
        `;
        const values = [name, ideology, threat_level, orgId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating organization at updateOrganizationRepository:', error);
        throw error;
    }
}


export const deleteOrganizationRepository = async (orgId) => {
    try {
        const query = 'DELETE FROM organization WHERE org_id = $1 RETURNING *;';
        const result = await pool.query(query, [orgId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting organization at deleteOrganizationRepository:', error);
        throw error;
    }
}


export const searchOrganizationsRepository = async (searchTerm) => {
    try {
        const query = 'SELECT * FROM organization WHERE name ILIKE $1 OR ideology ILIKE $1;';
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    } catch (error) {
        console.log('Error searching organizations at searchOrganizationsRepository:', error);
        throw error;
    }
}
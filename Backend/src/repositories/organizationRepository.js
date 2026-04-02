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
        const query = `
            SELECT
                o.*,
                COALESCE(stats.total_criminals, 0) AS total_criminals,
                COALESCE(stats.in_custody_count, 0) AS in_custody_count,
                COALESCE(stats.on_bail_count, 0) AS on_bail_count,
                COALESCE(stats.released_count, 0) AS released_count,
                COALESCE(stats.escaped_count, 0) AS escaped_count,
                COALESCE(stats.wanted_count, 0) AS wanted_count,
                stats.avg_member_risk_level,
                stats.max_member_risk_level,
                COALESCE(stats.members, '[]'::json) AS members
            FROM organization o
            LEFT JOIN LATERAL (
                SELECT
                    COUNT(*) AS total_criminals,
                    COUNT(*) FILTER (WHERE c.status = 'in_custody') AS in_custody_count,
                    COUNT(*) FILTER (WHERE c.status = 'on_bail') AS on_bail_count,
                    COUNT(*) FILTER (WHERE c.status = 'released') AS released_count,
                    COUNT(*) FILTER (WHERE c.status = 'escaped') AS escaped_count,
                    COUNT(*) FILTER (WHERE c.status = 'wanted') AS wanted_count,
                    ROUND(AVG(c.risk_level)::numeric, 2) AS avg_member_risk_level,
                    MAX(c.risk_level) AS max_member_risk_level,
                    json_agg(
                        json_build_object(
                            'criminal_id', c.criminal_id,
                            'full_name', c.full_name,
                            'nid', c.nid,
                            'status', c.status,
                            'risk_level', c.risk_level,
                            'role', co.role,
                            'image_url', c.image_url,
                            'registered_thana_id', c.registered_thana_id,
                            'birth_date', c.birth_date,
                            'gender', c.gender,
                            'nationality', c.nationality,
                            'permanent_address', c.permanent_address,
                            'current_address', c.current_address,
                            'identifying_marks', c.identifying_marks
                        )
                        ORDER BY c.risk_level DESC, c.full_name ASC
                    ) AS members
                FROM criminal_organization co
                JOIN criminal c ON c.criminal_id = co.criminal_id
                WHERE co.org_id = o.org_id
            ) stats ON TRUE
            WHERE o.org_id = $1;
        `;
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
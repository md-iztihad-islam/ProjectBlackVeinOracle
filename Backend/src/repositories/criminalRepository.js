import pool from "../config/dbConnection.js";

export const addCriminalRepository = async (criminalData) => {
    try {
        const { full_name, nid, status, risk_level, registered_thana_id } = criminalData;
        const query = `
            INSERT INTO criminal (full_name, nid, status, risk_level, registered_thana_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [full_name, nid, status, risk_level, registered_thana_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding criminal at addCriminalRepository:', error);
        throw error;
    }
}

export const getCriminalByIdRepository = async (criminalId) => {
    try {
        const query = `
            SELECT 
                criminal.*, 
                criminal_organization.org_id, 
                criminal_organization.role, 
                organization.name, 
                organization.ideology, 
                organization.threat_level,
                arrest_record.arrest_id,
                arrest_record.arrest_date,
                arrest_record.bail_due_date,
                arrest_record.custody_status AS arrest_custody_status,
                arrest_record.thana_id AS arresting_thana_id,
                arrest_record.case_reference
            FROM criminal 
            LEFT JOIN criminal_organization ON criminal.criminal_id = criminal_organization.criminal_id
            LEFT JOIN organization ON criminal_organization.org_id = organization.org_id
            LEFT JOIN arrest_record ON criminal.criminal_id = arrest_record.criminal_id
            WHERE criminal.criminal_id = $1;
        `;
        const values = [criminalId];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching criminal by ID at getCriminalByIdRepository:', error);
        throw error;
    }
}

export const getCriminalsByThanaIdRepository = async (thanaId) => {
    try {
        const query = `
            SELECT 
                criminal.*, 
                criminal_organization.org_id, 
                criminal_organization.role, 
                organization.name, 
                organization.ideology, 
                organization.threat_level,
                arrest_record.arrest_id,
                arrest_record.arrest_date,
                arrest_record.bail_due_date,
                arrest_record.custody_status AS arrest_custody_status,
                arrest_record.thana_id AS arresting_thana_id,
                arrest_record.case_reference
            FROM criminal 
            LEFT JOIN criminal_organization ON criminal.criminal_id = criminal_organization.criminal_id
            LEFT JOIN organization ON criminal_organization.org_id = organization.org_id
            LEFT JOIN arrest_record ON criminal.criminal_id = arrest_record.criminal_id
            WHERE criminal.registered_thana_id = $1;
        `;
        const values = [thanaId];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log('Error fetching criminals by thana ID at getCriminalsByThanaIdRepository:', error);
        throw error;
    }
}



export const getCriminalFullProfileRepository = async (criminalId) => {
    try {
        const query = `SELECT * FROM v_criminal_full_profile WHERE criminal_id = $1`;
        const result = await pool.query(query, [criminalId]);
        return result.rows[0];
    } catch (error) {
        console.log("Error at getCriminalFullProfileRepository:", error);
        throw error;
    }
};



export const getCriminalTimelineRepository = async (criminalId) => {
    try {
        const query = `SELECT * FROM fn_get_criminal_timeline($1)`;
        const result = await pool.query(query, [criminalId]);
        return result.rows;
    } catch (error) {
        console.log("Error at getCriminalTimelineRepository:", error);
        throw error;
    }
};



export const recalculateCriminalRiskRepository = async (criminalId) => {
    try {
        const query = `SELECT fn_calculate_criminal_risk($1) AS new_risk`;
        const result = await pool.query(query, [criminalId]);
        return result.rows[0];
    } catch (error) {
        console.log("Error at recalculateCriminalRiskRepository:", error);
        throw error;
    }
};


export const getAllCriminalsRepository = async () => {
    try {
        const query = `SELECT c.*, t.thana_name FROM criminal c LEFT JOIN thana t ON c.registered_thana_id = t.thana_id ORDER BY c.criminal_id;`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all criminals at getAllCriminalsRepository:', error);
        throw error;
    }
};


export const updateCriminalRepository = async (criminalId, data) => {
    try {
        const { full_name, nid, status, risk_level } = data;
        const query = `
            UPDATE criminal
            SET
                full_name = COALESCE(NULLIF($1, ''), full_name),
                nid = COALESCE(NULLIF($2, ''), nid),
                status = COALESCE(NULLIF($3, ''), status),
                risk_level = COALESCE($4, risk_level)
            WHERE criminal_id=$5
            RETURNING *;
        `;
        const normalizedRiskLevel =
            typeof risk_level === "number" && !Number.isNaN(risk_level)
                ? risk_level
                : null;
        const values = [full_name, nid, status, normalizedRiskLevel, criminalId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating criminal at updateCriminalRepository:', error);
        throw error;
    }
};


export const deleteCriminalRepository = async (criminalId) => {
    try {
        const query = 'DELETE FROM criminal WHERE criminal_id=$1 RETURNING *;';
        const result = await pool.query(query, [criminalId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting criminal at deleteCriminalRepository:', error);
        throw error;
    }
};


export const getCriminalsByStatusRepository = async (status) => {
    try {
        const query = 'SELECT * FROM criminal WHERE status = $1;';
        const result = await pool.query(query, [status]);
        return result.rows;
    } catch (error) {
        console.log('Error fetching criminals by status at getCriminalsByStatusRepository:', error);
        throw error;
    }
};


export const searchCriminalsRepository = async (searchTerm) => {
    try {
        const query = 'SELECT * FROM criminal WHERE full_name ILIKE $1 OR nid ILIKE $1;';
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    } catch (error) {
        console.log('Error searching criminals at searchCriminalsRepository:', error);
        throw error;
    }
};


export const getWantedCriminalsRepository = async () => {
    try {
        const query = `
            SELECT
                c.criminal_id,
                c.full_name,
                c.nid,
                c.status,
                c.risk_level,
                c.registered_thana_id,
                t.thana_name AS registered_thana,
                COALESCE(last_loc.district, t.district) AS last_seen_district,
                last_loc.zone AS last_seen_zone,
                last_loc.address AS last_seen_address,
                last_loc.noted_at AS last_seen_at
            FROM criminal c
            LEFT JOIN thana t ON c.registered_thana_id = t.thana_id
            LEFT JOIN LATERAL (
                SELECT l.district, l.zone, l.address, cl.noted_at
                FROM criminal_location cl
                JOIN location l ON l.location_id = cl.location_id
                WHERE cl.criminal_id = c.criminal_id
                ORDER BY cl.noted_at DESC NULLS LAST
                LIMIT 1
            ) last_loc ON TRUE
            WHERE c.status IN ('wanted', 'escaped')
            ORDER BY c.risk_level DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching wanted criminals at getWantedCriminalsRepository:', error);
        throw error;
    }
};

// by Rayyan 2.0
export const getCriminalsByAreaRepository = async (district) => {
    try {
        const normalizedDistrict = String(district || '').trim();
        const query = `
            SELECT
                c.criminal_id,
                c.full_name,
                c.nid,
                c.status,
                c.risk_level,
                c.registered_thana_id,
                t.thana_name AS registered_thana,
                COALESCE(last_loc.district, t.district) AS district,
                last_loc.zone,
                last_loc.address,
                last_loc.noted_at
            FROM criminal c
            LEFT JOIN thana t ON c.registered_thana_id = t.thana_id
            LEFT JOIN LATERAL (
                SELECT l.district, l.zone, l.address, cl.noted_at
                FROM criminal_location cl
                JOIN location l ON l.location_id = cl.location_id
                WHERE cl.criminal_id = c.criminal_id
                ORDER BY cl.noted_at DESC NULLS LAST
                LIMIT 1
            ) last_loc ON TRUE
            WHERE COALESCE(last_loc.district, t.district, '') ILIKE $1
            ORDER BY c.risk_level DESC, last_loc.noted_at DESC NULLS LAST;
        `;
        const result = await pool.query(query, [`%${normalizedDistrict}%`]);
        return result.rows;
    } catch (error) {
        console.log('Error fetching criminals by area at getCriminalsByAreaRepository:', error);
        throw error;
    }
};
import pool from '../config/dbConnection.js';

//By Rayyan


// criminal er full profile — cases, arrests, org memberships shob ekta row te 
export const getCriminalFullProfileRepository = async (criminalId) => {
    try {
        const query = `
            SELECT 
                c.criminal_id, c.full_name, c.nid, c.status, c.risk_level,
                t.thana_name AS registered_thana,
                (SELECT COUNT(*) FROM case_file cf WHERE cf.criminal_id = c.criminal_id) AS total_cases,
                (SELECT COUNT(*) FROM arrest_record ar WHERE ar.criminal_id = c.criminal_id) AS total_arrests,
                (SELECT COUNT(*) FROM criminal_organization co WHERE co.criminal_id = c.criminal_id) AS total_organizations,
                (SELECT json_agg(json_build_object('org_name', o.name, 'role', co.role, 'threat_level', o.threat_level))
                 FROM criminal_organization co 
                 JOIN organization o ON co.org_id = o.org_id 
                 WHERE co.criminal_id = c.criminal_id) AS organizations,
                (SELECT json_agg(json_build_object('case_number', cf.case_number, 'case_type', cf.case_type, 'status', cf.status, 'filed_at', cf.filed_at))
                 FROM case_file cf 
                 WHERE cf.criminal_id = c.criminal_id) AS cases,
                (SELECT json_agg(json_build_object('arrest_id', ar.arrest_id, 'arrest_date', ar.arrest_date, 'custody_status', ar.custody_status))
                 FROM arrest_record ar 
                 WHERE ar.criminal_id = c.criminal_id) AS arrests
            FROM criminal c
            LEFT JOIN thana t ON c.registered_thana_id = t.thana_id
            WHERE c.criminal_id = $1;
        `;
        const result = await pool.query(query, [criminalId]);
        return result.rows[0];
    } catch (error) {
        console.log("Error at getCriminalFullProfileRepository:", error);
        throw error;
    }
};


// high risk er jeshob criminals and their network — associates, family, accomplices 
export const getHighRiskNetworkRepository = async () => {
    try {
        const query = `
            SELECT 
                c.criminal_id, c.full_name, c.risk_level, c.status,
                (SELECT json_agg(json_build_object(
                    'related_id', CASE WHEN cr.criminal_id_1 = c.criminal_id THEN cr.criminal_id_2 ELSE cr.criminal_id_1 END,
                    'related_name', CASE WHEN cr.criminal_id_1 = c.criminal_id THEN c2.full_name ELSE c1.full_name END,
                    'relation_type', cr.relation_type
                ))
                FROM criminal_relation cr
                LEFT JOIN criminal c1 ON cr.criminal_id_1 = c1.criminal_id
                LEFT JOIN criminal c2 ON cr.criminal_id_2 = c2.criminal_id
                WHERE cr.criminal_id_1 = c.criminal_id OR cr.criminal_id_2 = c.criminal_id
                ) AS network
            FROM criminal c
            WHERE c.risk_level >= 7
            ORDER BY c.risk_level DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getHighRiskNetworkRepository:", error);
        throw error;
    }
};


// GD report analytics per thana 
export const getGdReportAnalyticsRepository = async () => {
    try {
        const query = `
            SELECT 
                t.thana_name,
                COUNT(*) AS total_gd_reports,
                COUNT(*) FILTER (WHERE g.status = 'submitted') AS submitted,
                COUNT(*) FILTER (WHERE g.status = 'pending') AS pending,
                COUNT(*) FILTER (WHERE g.status = 'approved') AS approved,
                COUNT(*) FILTER (WHERE g.status = 'rejected') AS rejected,
                ROUND(
                    COUNT(*) FILTER (WHERE g.status = 'approved') * 100.0 / NULLIF(COUNT(*), 0), 2
                ) AS approval_rate
            FROM gd_report g
            JOIN thana t ON g.thana_id = t.thana_id
            GROUP BY t.thana_id, t.thana_name
            ORDER BY total_gd_reports DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getGdReportAnalyticsRepository:", error);
        throw error;
    }
};


// bail statistics grouped by court 
export const getBailStatisticsRepository = async () => {
    try {
        const query = `
            SELECT 
                br.court_name,
                COUNT(*) AS total_applications,
                COUNT(*) FILTER (WHERE br.status = 'granted') AS granted,
                COUNT(*) FILTER (WHERE br.status = 'rejected') AS rejected,
                COUNT(*) FILTER (WHERE br.status = 'pending') AS pending,
                ROUND(AVG(br.bail_amount) FILTER (WHERE br.status = 'granted'), 2) AS avg_bail_amount,
                MAX(br.bail_amount) AS max_bail_amount,
                MIN(br.bail_amount) FILTER (WHERE br.bail_amount > 0) AS min_bail_amount
            FROM bail_record br
            GROUP BY br.court_name
            HAVING COUNT(*) >= 1
            ORDER BY total_applications DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getBailStatisticsRepository:", error);
        throw error;
    }
};


// criminal er movement history
export const getCriminalMovementHistoryRepository = async (criminalId) => {
    try {
        const query = `
            SELECT 
                cl.criminal_location_id,
                c.full_name,
                l.district, l.address, l.zone,
                cl.noted_at,
                LAG(l.district) OVER (ORDER BY cl.noted_at) AS previous_district,
                LAG(cl.noted_at) OVER (ORDER BY cl.noted_at) AS previous_time,
                ROW_NUMBER() OVER (ORDER BY cl.noted_at) AS visit_number
            FROM criminal_location cl
            JOIN criminal c ON cl.criminal_id = c.criminal_id
            JOIN location l ON cl.location_id = l.location_id
            WHERE cl.criminal_id = $1
            ORDER BY cl.noted_at DESC;
        `;
        const result = await pool.query(query, [criminalId]);
        return result.rows;
    } catch (error) {
        console.log("Error at getCriminalMovementHistoryRepository:", error);
        throw error;
    }
};


// oranization er threat ki rokom
export const getOrganizationThreatAnalysisRepository = async () => {
    try {
        const query = `
            WITH org_stats AS (
                SELECT 
                    o.org_id, o.name, o.ideology, o.threat_level,
                    COUNT(co.criminal_id) AS member_count,
                    ROUND(AVG(c.risk_level), 2) AS avg_member_risk,
                    MAX(c.risk_level) AS max_member_risk
                FROM organization o
                LEFT JOIN criminal_organization co ON o.org_id = co.org_id
                LEFT JOIN criminal c ON co.criminal_id = c.criminal_id
                GROUP BY o.org_id, o.name, o.ideology, o.threat_level
            )
            SELECT 
                os.*,
                CASE 
                    WHEN os.threat_level >= 8 AND os.member_count > 5 THEN 'CRITICAL'
                    WHEN os.threat_level >= 6 THEN 'HIGH'
                    WHEN os.threat_level >= 4 THEN 'MEDIUM'
                    ELSE 'LOW'
                END AS threat_category
            FROM org_stats os
            ORDER BY os.threat_level DESC, os.member_count DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getOrganizationThreatAnalysisRepository:", error);
        throw error;
    }
};


// custody status overview er jonno
export const getCustodyOverviewRepository = async () => {
    try {
        const query = `
            SELECT 
                c.status,
                COUNT(*) AS total_count,
                ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM criminal), 0), 2) AS percentage,
                ROUND(AVG(c.risk_level), 2) AS avg_risk_level
            FROM criminal c
            GROUP BY c.status
            ORDER BY total_count DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getCustodyOverviewRepository:", error);
        throw error;
    }
};


// jeishb inmates er bail due ashtese
export const getInmatesDueForBailRepository = async () => {
    try {
        const query = `
            SELECT 
                ar.arrest_id, ar.arrest_date, ar.bail_due_date, ar.custody_status,
                c.criminal_id, c.full_name, c.risk_level,
                t.thana_name,
                j.jail_name,
                ar.bail_due_date - CURRENT_DATE AS days_until_bail
            FROM arrest_record ar
            JOIN criminal c ON ar.criminal_id = c.criminal_id
            JOIN thana t ON ar.thana_id = t.thana_id
            LEFT JOIN incarceration i ON ar.arrest_id = i.arrest_id AND i.released_at IS NULL
            LEFT JOIN jail j ON i.jail_id = j.jail_id
            WHERE ar.custody_status = 'in_custody'
              AND ar.bail_due_date IS NOT NULL
              AND ar.bail_due_date >= CURRENT_DATE
            ORDER BY ar.bail_due_date ASC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getInmatesDueForBailRepository:", error);
        throw error;
    }
};


// jail er cell occupancy
export const getCellOccupancyDetailsRepository = async (jailId) => {
    try {
        const query = `
            SELECT 
                cb.block_id, cb.block_name, cb.capacity AS block_capacity,
                COUNT(c.cell_id) AS total_cells,
                SUM(c.capacity) AS total_cell_capacity,
                SUM(c.number_of_people) AS total_occupants,
                COUNT(c.cell_id) FILTER (WHERE c.status = 'available') AS available_cells,
                COUNT(c.cell_id) FILTER (WHERE c.status = 'occupied') AS occupied_cells,
                COUNT(c.cell_id) FILTER (WHERE c.status = 'maintenance') AS maintenance_cells,
                ROUND(SUM(c.number_of_people) * 100.0 / NULLIF(SUM(c.capacity), 0), 2) AS occupancy_rate
            FROM cell_block cb
            LEFT JOIN cell c ON cb.block_id = c.block_id
            WHERE cb.jail_id = $1
            GROUP BY cb.block_id, cb.block_name, cb.capacity
            ORDER BY cb.block_name;
        `;
        const result = await pool.query(query, [jailId]);
        return result.rows;
    } catch (error) {
        console.log("Error at getCellOccupancyDetailsRepository:", error);
        throw error;
    }
};


// admin er dashboard er jonno
export const getDashboardOverviewRepository = async () => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM criminal) AS total_criminals,
                (SELECT COUNT(*) FROM criminal WHERE status = 'in_custody') AS in_custody,
                (SELECT COUNT(*) FROM criminal WHERE status = 'on_bail') AS on_bail,
                (SELECT COUNT(*) FROM criminal WHERE status = 'escaped') AS escaped,
                (SELECT COUNT(*) FROM criminal WHERE risk_level >= 7) AS high_risk,
                (SELECT COUNT(*) FROM jail) AS total_jails,
                (SELECT COUNT(*) FROM thana) AS total_thanas,
                (SELECT COUNT(*) FROM officer) AS total_officers,
                (SELECT COUNT(*) FROM case_file) AS total_cases,
                (SELECT COUNT(*) FROM case_file WHERE status = 'open') AS open_cases,
                (SELECT COUNT(*) FROM arrest_record) AS total_arrests,
                (SELECT COUNT(*) FROM gd_report) AS total_gd_reports,
                (SELECT COUNT(*) FROM organization) AS total_organizations,
                (SELECT COUNT(*) FROM bail_record WHERE status = 'pending') AS pending_bail;
        `;
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        console.log("Error at getDashboardOverviewRepository:", error);
        throw error;
    }
};





export const getCriminalsAboveAvgCasesRepository = async () => {
    try {
        const query = `
            SELECT c.criminal_id, c.full_name,
                (SELECT COUNT(*) FROM case_file cf WHERE cf.criminal_id = c.criminal_id) AS case_count
            FROM criminal c
            WHERE (SELECT COUNT(*) FROM case_file cf WHERE cf.criminal_id = c.criminal_id) > (
                SELECT AVG(cnt) FROM (SELECT COUNT(*) AS cnt FROM case_file GROUP BY criminal_id) sub
            )
            ORDER BY case_count DESC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getCriminalsAboveAvgCasesRepository:", error);
        throw error;
    }
};


//criminal ranking
export const getCriminalRankingRepository = async () => {
    try {
        const query = `
            WITH criminal_stats AS (
                SELECT c.criminal_id, c.full_name, c.status,
                    COUNT(DISTINCT ar.arrest_id) AS arrest_count,
                    COUNT(DISTINCT cf.case_id) AS case_count
                FROM criminal c
                LEFT JOIN arrest_record ar ON ar.criminal_id = c.criminal_id
                LEFT JOIN case_file cf ON cf.criminal_id = c.criminal_id
                GROUP BY c.criminal_id, c.full_name, c.status
                HAVING COUNT(ar.arrest_id) > 0
            )
            SELECT *, ROW_NUMBER() OVER (ORDER BY arrest_count DESC) AS overall_rank,
                RANK() OVER (PARTITION BY status ORDER BY case_count DESC) AS status_rank
            FROM criminal_stats ORDER BY overall_rank`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getCriminalRankingRepository:", error);
        throw error;
    }
};


//org er jeshb member freely ghurtese
export const getFreeOrgMembersRepository = async () => {
    try {
        const query = `
            SELECT c.criminal_id, c.full_name, org.name AS org_name, co.role
            FROM criminal c
            JOIN criminal_organization co ON co.criminal_id = c.criminal_id
            JOIN organization org ON org.org_id = co.org_id
            WHERE EXISTS (
                SELECT 1 FROM arrest_record ar WHERE ar.criminal_id = c.criminal_id
            )
            AND NOT EXISTS (
                SELECT 1 FROM incarceration i
                JOIN arrest_record ar ON i.arrest_id = ar.arrest_id
                WHERE ar.criminal_id = c.criminal_id AND i.released_at IS NULL
            )
            ORDER BY org.name, c.full_name`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getFreeOrgMembersRepository:", error);
        throw error;
    }
};



export const getMonthlyArrestTrendRepository = async () => {
    try {
        const query = `
            WITH monthly_arrests AS (
                SELECT DATE_TRUNC('month', arrest_date) AS month, COUNT(*) AS arrest_count
                FROM arrest_record GROUP BY DATE_TRUNC('month', arrest_date)
            )
            SELECT month, arrest_count,
                SUM(arrest_count) OVER (ORDER BY month) AS cumulative_arrests,
                arrest_count - LAG(arrest_count) OVER (ORDER BY month) AS change_from_previous
            FROM monthly_arrests ORDER BY month`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getMonthlyArrestTrendRepository:", error);
        throw error;
    }
};








export const getThanaPerformanceRepository = async () => {
    try {
        const query = `SELECT * FROM v_thana_performance ORDER BY performance_rank ASC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getThanaPerformanceRepository:", error);
        throw error;
    }
};


// jail occupancy dashboard status labels shoho
export const getJailOccupancyDetailRepository = async () => {
    try {
        const query = `SELECT * FROM v_jail_occupancy_detail ORDER BY occupancy_percentage DESC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getJailOccupancyDetailRepository:", error);
        throw error;
    }
};



export const getOfficerWorkloadRepository = async () => {
    try {
        const query = `SELECT * FROM v_officer_workload ORDER BY workload_rank ASC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log("Error at getOfficerWorkloadRepository:", error);
        throw error;
    }
};



export const getDistrictCrimeStatsRepository = async (district = null) => {
    try {
        const query = `SELECT * FROM fn_get_district_crime_stats($1)`;
        const result = await pool.query(query, [district]);
        return result.rows;
    } catch (error) {
        console.log("Error at getDistrictCrimeStatsRepository:", error);
        throw error;
    }
};


// by Rayyan 2.0

export const getAuditLogsRepository = async (tableName = null, page = 1, limit = 50) => {
    try {
        const offset = (page - 1) * limit;
        let query, params;
        if (tableName) {
            query = `SELECT * FROM audit_log WHERE table_name = $1 ORDER BY changed_at DESC LIMIT $2 OFFSET $3`;
            params = [tableName, limit, offset];
        } else {
            query = `SELECT * FROM audit_log ORDER BY changed_at DESC LIMIT $1 OFFSET $2`;
            params = [limit, offset];
        }
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.log("Error at getAuditLogsRepository:", error);
        throw error;
    }
};



export const recalculateAllRiskScoresRepository = async () => {
    try {
        await pool.query(`CALL proc_recalculate_all_risk_scores()`);
        return { success: true };
    } catch (error) {
        console.log("Error at recalculateAllRiskScoresRepository:", error);
        throw error;
    }
};
import {
    addExactMatch,
    addInsensitiveLike,
    addDateRange,
    addNumericRange,
    addParam,
    escapeLikePattern,
    parseBooleanFilter,
    normalizeText,
    coalesceNumber,
} from '../utils/queryHelper.js';
import pool from '../config/dbConnection.js';

// ─── Filter Builder ───────────────────────────────────────────────────────────

const buildFilters = (filters) => ({
    // Thana
    thanaId:           filters.thanaId           ?? filters.thana_id          ?? null,
    thanaName:         filters.thanaName          ?? filters.name              ?? null,
    district:          filters.district           ?? null,
    zone:              filters.zone               ?? null,
    email:             filters.email              ?? null,
    phone:             filters.phone              ?? null,
    search:            filters.search             ?? null,
    headOfficerId:     filters.headOfficerId       ?? filters.head_officer_id   ?? null,
    createdByAdminId:  filters.createdByAdminId    ?? filters.created_by_admin_id ?? null,
    hasHeadOfficer:    filters.hasHeadOfficer      ?? filters.has_head_officer  ?? null,
    // Officer
    officerRank:       filters.officerRank         ?? filters.rank              ?? null,
    officerGender:     filters.officerGender       ?? filters.gender            ?? null,
    officerSearch:     filters.officerSearch       ?? null,
    // GD
    gdStatus:          filters.gdStatus            ?? filters.status            ?? null,
    gdType:            filters.gdType              ?? filters.gd_type           ?? null,
    gdFrom:            filters.gdFrom              ?? filters.gd_from           ?? null,
    gdTo:              filters.gdTo                ?? filters.gd_to             ?? null,
    // Case
    caseStatus:        filters.caseStatus          ?? null,
    caseType:          filters.caseType            ?? null,
    caseFrom:          filters.caseFrom            ?? filters.case_from         ?? null,
    caseTo:            filters.caseTo              ?? filters.case_to           ?? null,
    // Arrest
    custodyStatus:     filters.custodyStatus       ?? filters.custody_status    ?? null,
    arrestFrom:        filters.arrestFrom          ?? filters.arrest_from       ?? null,
    arrestTo:          filters.arrestTo            ?? filters.arrest_to         ?? null,
    // Criminal
    criminalStatus:    filters.criminalStatus      ?? filters.criminal_status   ?? null,
    minRiskLevel:      filters.minRiskLevel        ?? filters.min_risk_level    ?? null,
    maxRiskLevel:      filters.maxRiskLevel        ?? filters.max_risk_level    ?? null,
    // Bail
    bailStatus:        filters.bailStatus          ?? filters.bail_status       ?? null,
    bailFrom:          filters.bailFrom            ?? filters.bail_from         ?? null,
    bailTo:            filters.bailTo              ?? filters.bail_to           ?? null,
    // Incarceration
    incarcerationFrom: filters.incarcerationFrom   ?? filters.incarceration_from ?? null,
    incarcerationTo:   filters.incarcerationTo     ?? filters.incarceration_to   ?? null,
});

// ─── WHERE Clause Builder ─────────────────────────────────────────────────────

const buildWhereClauses = (f, params) => {
    const thana         = [];
    const officer       = [];
    const gd            = [];
    const caseFile      = [];
    const arrest        = [];
    const criminal      = [];
    const bail          = [];
    const incarceration = [];

    // Thana conditions
    addExactMatch(thana, params, 't.thana_id',            f.thanaId);
    addInsensitiveLike(thana, params, 't.thana_name',     f.thanaName);
    addInsensitiveLike(thana, params, 't.district',       f.district);
    addInsensitiveLike(thana, params, 't.zone',           f.zone);
    addInsensitiveLike(thana, params, 't.email',          f.email);
    addInsensitiveLike(thana, params, 't.phone',          f.phone);
    addExactMatch(thana, params, 't.head_officer_id',     f.headOfficerId);
    addExactMatch(thana, params, 't.created_by_admin_id', f.createdByAdminId);

    const hasHeadOfficer = parseBooleanFilter(f.hasHeadOfficer);
    if (hasHeadOfficer === true)  thana.push('t.head_officer_id IS NOT NULL');
    if (hasHeadOfficer === false) thana.push('t.head_officer_id IS NULL');

    const normalizedSearch = normalizeText(f.search);
    if (normalizedSearch) {
        const placeholder = addParam(params, `%${escapeLikePattern(normalizedSearch)}%`);
        thana.push(`(
            t.thana_name  ILIKE ${placeholder} ESCAPE '\\' OR
            t.district    ILIKE ${placeholder} ESCAPE '\\' OR
            t.zone        ILIKE ${placeholder} ESCAPE '\\' OR
            t.address     ILIKE ${placeholder} ESCAPE '\\' OR
            t.email       ILIKE ${placeholder} ESCAPE '\\' OR
            t.phone       ILIKE ${placeholder} ESCAPE '\\' OR
            ho.full_name  ILIKE ${placeholder} ESCAPE '\\'
        )`);
    }

    // Officer conditions
    addExactMatch(officer, params, 'o.rank_code',         f.officerRank);
    addInsensitiveLike(officer, params, 'o.gender',       f.officerGender);
    addInsensitiveLike(officer, params, 'o.full_name',    f.officerSearch);
    addInsensitiveLike(officer, params, 'o.email',        f.officerSearch);
    addInsensitiveLike(officer, params, 'o.phone',        f.officerSearch);
    addInsensitiveLike(officer, params, 'o.badge_no',     f.officerSearch);

    // GD conditions
    addInsensitiveLike(gd, params, 'g.status',            f.gdStatus);
    addInsensitiveLike(gd, params, 'g.gd_type',           f.gdType);
    addDateRange(gd, params, 'g.submitted_at::date',      f.gdFrom, f.gdTo);

    // Case conditions
    addInsensitiveLike(caseFile, params, 'cf.status',     f.caseStatus);
    addInsensitiveLike(caseFile, params, 'cf.case_type',  f.caseType);
    addDateRange(caseFile, params, 'cf.filed_at::date',   f.caseFrom, f.caseTo);

    // Arrest conditions
    addInsensitiveLike(arrest, params, 'ar.custody_status', f.custodyStatus);
    addDateRange(arrest, params, 'ar.arrest_date',          f.arrestFrom, f.arrestTo);

    // Criminal conditions
    addInsensitiveLike(criminal, params, 'c.status',      f.criminalStatus);
    addNumericRange(criminal, params, 'c.risk_level',     f.minRiskLevel, f.maxRiskLevel);

    // Bail conditions
    addInsensitiveLike(bail, params, 'br.status',         f.bailStatus);
    addDateRange(bail, params, 'br.granted_at',           f.bailFrom, f.bailTo);

    // Incarceration conditions
    addDateRange(incarceration, params, 'i.admitted_at::date', f.incarcerationFrom, f.incarcerationTo);

    return { thana, officer, gd, caseFile, arrest, criminal, bail, incarceration };
};

// ─── WHERE helper ─────────────────────────────────────────────────────────────

const toWhere = (clauses) =>
    clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

// ─── Query Builder ────────────────────────────────────────────────────────────

const buildQuery = (where) => `
    WITH filtered_thanas AS (
        SELECT
            t.thana_id, t.thana_name, t.district, t.zone, t.address,
            t.phone, t.email, t.created_by_admin_id, t.head_officer_id,
            ho.full_name   AS head_officer_name,
            ho.rank_code   AS head_officer_rank_code,
            ho.email       AS head_officer_email,
            ho.phone       AS head_officer_phone
        FROM thana t
        LEFT JOIN officer ho ON t.head_officer_id = ho.officer_id
        ${toWhere(where.thana)}
    ),

    officer_stats AS (
        SELECT
            o.thana_id,
            COUNT(*)                                                                     AS officer_total,
            COUNT(*) FILTER (WHERE o.rank_code = 'constable')                           AS officer_constable_count,
            COUNT(*) FILTER (WHERE o.rank_code = 'si')                                  AS officer_si_count,
            COUNT(*) FILTER (WHERE o.rank_code = 'inspector')                           AS officer_inspector_count,
            COUNT(*) FILTER (WHERE o.rank_code = 'oc')                                  AS officer_oc_count,
            COUNT(*) FILTER (WHERE LOWER(o.gender) = 'male')                            AS officer_male_count,
            COUNT(*) FILTER (WHERE LOWER(o.gender) = 'female')                         AS officer_female_count,
            COUNT(*) FILTER (WHERE LOWER(o.gender) = 'other')                           AS officer_other_count,
            ROUND((AVG(DATE_PART('year', AGE(CURRENT_DATE, o.birth_date)))
                FILTER (WHERE o.birth_date IS NOT NULL))::numeric, 2)                   AS officer_avg_age
        FROM officer o
        ${toWhere(where.officer)}
        GROUP BY o.thana_id
    ),

    gd_stats AS (
        SELECT
            g.thana_id,
            COUNT(*)                                                                     AS gd_total,
            COUNT(*) FILTER (WHERE g.status = 'submitted')                              AS gd_submitted_count,
            COUNT(*) FILTER (WHERE g.status = 'assigned')                               AS gd_assigned_count,
            COUNT(*) FILTER (WHERE g.status = 'approved')                               AS gd_approved_count,
            COUNT(*) FILTER (WHERE g.status = 'rejected')                               AS gd_rejected_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'theft')                                 AS gd_theft_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'lost_document')                         AS gd_lost_document_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'missing_person')                        AS gd_missing_person_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'accident')                              AS gd_accident_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'assault')                               AS gd_assault_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'robbery')                               AS gd_robbery_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'fraud')                                 AS gd_fraud_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'domestic_violence')                     AS gd_domestic_violence_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'property_dispute')                      AS gd_property_dispute_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'suspicious_activity')                   AS gd_suspicious_activity_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'threat')                                AS gd_threat_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'noise_disturbance')                     AS gd_noise_disturbance_count,
            COUNT(*) FILTER (WHERE g.gd_type = 'other')                                 AS gd_other_count,
            ROUND((COUNT(*) FILTER (WHERE g.status = 'approved') * 100.0
                / NULLIF(COUNT(*), 0))::numeric, 2)                                     AS gd_approval_rate
        FROM gd_report g
        ${toWhere(where.gd)}
        GROUP BY g.thana_id
    ),

    case_stats AS (
        SELECT
            cf.thana_id,
            COUNT(*)                                                                     AS case_total,
            COUNT(*) FILTER (WHERE cf.status = 'open')                                  AS case_open_count,
            COUNT(*) FILTER (WHERE cf.status = 'closed')                                AS case_closed_count,
            COUNT(*) FILTER (WHERE cf.status = 'under_investigation')                   AS case_under_investigation_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'theft')                              AS case_theft_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'robbery')                            AS case_robbery_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'murder')                             AS case_murder_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'assault')                            AS case_assault_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'kidnapping')                         AS case_kidnapping_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'fraud')                              AS case_fraud_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'cyber_crime')                        AS case_cyber_crime_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'drug_offense')                       AS case_drug_offense_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'domestic_violence')                  AS case_domestic_violence_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'extortion')                          AS case_extortion_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'illegal_firearms')                   AS case_illegal_firearms_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'human_trafficking')                  AS case_human_trafficking_count,
            COUNT(*) FILTER (WHERE cf.case_type = 'other')                              AS case_other_count,
            ROUND((COUNT(*) FILTER (WHERE cf.status = 'closed') * 100.0
                / NULLIF(COUNT(*), 0))::numeric, 2)                                     AS case_closure_rate
        FROM case_file cf
        ${toWhere(where.caseFile)}
        GROUP BY cf.thana_id
    ),

    arrest_stats AS (
        SELECT
            ar.thana_id,
            COUNT(*)                                                                         AS arrest_total,
            COUNT(*) FILTER (WHERE ar.custody_status = 'in_custody')                        AS arrest_in_custody_count,
            COUNT(*) FILTER (WHERE ar.custody_status = 'on_bail')                           AS arrest_on_bail_count,
            COUNT(*) FILTER (WHERE ar.custody_status = 'released')                          AS arrest_released_count,
            COUNT(*) FILTER (WHERE ar.custody_status = 'transferred')                       AS arrest_transferred_count,
            COUNT(*) FILTER (WHERE ar.bail_due_date IS NOT NULL
                AND ar.bail_due_date >= CURRENT_DATE)                                        AS arrest_upcoming_bail_count,
            MAX(ar.arrest_date)                                                              AS arrest_latest_date
        FROM arrest_record ar
        ${toWhere(where.arrest)}
        GROUP BY ar.thana_id
    ),

    criminal_stats AS (
        SELECT
            c.registered_thana_id                                                            AS thana_id,
            COUNT(*)                                                                         AS criminal_total,
            COUNT(*) FILTER (WHERE c.status = 'in_custody')                                 AS criminal_in_custody_count,
            COUNT(*) FILTER (WHERE c.status = 'on_bail')                                    AS criminal_on_bail_count,
            COUNT(*) FILTER (WHERE c.status = 'released')                                   AS criminal_released_count,
            COUNT(*) FILTER (WHERE c.status = 'escaped')                                    AS criminal_escaped_count,
            COUNT(*) FILTER (WHERE c.status = 'wanted')                                     AS criminal_wanted_count,
            ROUND(AVG(c.risk_level)::numeric, 2)                                             AS criminal_avg_risk_level,
            COUNT(*) FILTER (WHERE c.risk_level BETWEEN 1 AND 3)                            AS criminal_low_risk_count,
            COUNT(*) FILTER (WHERE c.risk_level BETWEEN 4 AND 6)                            AS criminal_medium_risk_count,
            COUNT(*) FILTER (WHERE c.risk_level BETWEEN 7 AND 8)                            AS criminal_high_risk_count,
            COUNT(*) FILTER (WHERE c.risk_level BETWEEN 9 AND 10)                           AS criminal_critical_risk_count
        FROM criminal c
        ${toWhere(where.criminal)}
        GROUP BY c.registered_thana_id
    ),

    bail_stats AS (
        SELECT
            ar.thana_id,
            COUNT(*)                                                                         AS bail_total,
            COUNT(*) FILTER (WHERE br.status = 'pending')                                   AS bail_pending_count,
            COUNT(*) FILTER (WHERE br.status = 'granted')                                   AS bail_granted_count,
            COUNT(*) FILTER (WHERE br.status = 'rejected')                                  AS bail_rejected_count,
            ROUND((AVG(br.bail_amount)
                FILTER (WHERE br.status = 'granted' AND br.bail_amount IS NOT NULL))::numeric, 2) AS bail_avg_granted_amount
        FROM bail_record br
        JOIN arrest_record ar ON ar.arrest_id = br.arrest_id
        ${toWhere(where.bail)}
        GROUP BY ar.thana_id
    ),

    incarceration_stats AS (
        SELECT
            ar.thana_id,
            COUNT(*)                                                                         AS incarceration_total,
            COUNT(*) FILTER (WHERE i.released_at IS NULL)                                   AS incarceration_active_count,
            COUNT(*) FILTER (WHERE i.released_at IS NOT NULL)                               AS incarceration_released_count
        FROM incarceration i
        JOIN arrest_record ar ON ar.arrest_id = i.arrest_id
        ${toWhere(where.incarceration)}
        GROUP BY ar.thana_id
    )

    SELECT
        ft.*,
        -- Officers
        COALESCE(os.officer_total, 0)              AS officer_total,
        COALESCE(os.officer_constable_count, 0)    AS officer_constable_count,
        COALESCE(os.officer_si_count, 0)           AS officer_si_count,
        COALESCE(os.officer_inspector_count, 0)    AS officer_inspector_count,
        COALESCE(os.officer_oc_count, 0)           AS officer_oc_count,
        COALESCE(os.officer_male_count, 0)         AS officer_male_count,
        COALESCE(os.officer_female_count, 0)       AS officer_female_count,
        COALESCE(os.officer_other_count, 0)        AS officer_other_count,
        COALESCE(os.officer_avg_age, 0)            AS officer_avg_age,
        -- GD Reports
        COALESCE(gs.gd_total, 0)                   AS gd_total,
        COALESCE(gs.gd_submitted_count, 0)         AS gd_submitted_count,
        COALESCE(gs.gd_assigned_count, 0)          AS gd_assigned_count,
        COALESCE(gs.gd_approved_count, 0)          AS gd_approved_count,
        COALESCE(gs.gd_rejected_count, 0)          AS gd_rejected_count,
        COALESCE(gs.gd_theft_count, 0)             AS gd_theft_count,
        COALESCE(gs.gd_lost_document_count, 0)     AS gd_lost_document_count,
        COALESCE(gs.gd_missing_person_count, 0)    AS gd_missing_person_count,
        COALESCE(gs.gd_accident_count, 0)          AS gd_accident_count,
        COALESCE(gs.gd_assault_count, 0)           AS gd_assault_count,
        COALESCE(gs.gd_robbery_count, 0)           AS gd_robbery_count,
        COALESCE(gs.gd_fraud_count, 0)             AS gd_fraud_count,
        COALESCE(gs.gd_domestic_violence_count, 0) AS gd_domestic_violence_count,
        COALESCE(gs.gd_property_dispute_count, 0)  AS gd_property_dispute_count,
        COALESCE(gs.gd_suspicious_activity_count,0)AS gd_suspicious_activity_count,
        COALESCE(gs.gd_threat_count, 0)            AS gd_threat_count,
        COALESCE(gs.gd_noise_disturbance_count, 0) AS gd_noise_disturbance_count,
        COALESCE(gs.gd_other_count, 0)             AS gd_other_count,
        COALESCE(gs.gd_approval_rate, 0)           AS gd_approval_rate,
        -- Cases
        COALESCE(cs.case_total, 0)                 AS case_total,
        COALESCE(cs.case_open_count, 0)            AS case_open_count,
        COALESCE(cs.case_closed_count, 0)          AS case_closed_count,
        COALESCE(cs.case_under_investigation_count,0) AS case_under_investigation_count,
        COALESCE(cs.case_theft_count, 0)           AS case_theft_count,
        COALESCE(cs.case_robbery_count, 0)         AS case_robbery_count,
        COALESCE(cs.case_murder_count, 0)          AS case_murder_count,
        COALESCE(cs.case_assault_count, 0)         AS case_assault_count,
        COALESCE(cs.case_kidnapping_count, 0)      AS case_kidnapping_count,
        COALESCE(cs.case_fraud_count, 0)           AS case_fraud_count,
        COALESCE(cs.case_cyber_crime_count, 0)     AS case_cyber_crime_count,
        COALESCE(cs.case_drug_offense_count, 0)    AS case_drug_offense_count,
        COALESCE(cs.case_domestic_violence_count,0)AS case_domestic_violence_count,
        COALESCE(cs.case_extortion_count, 0)       AS case_extortion_count,
        COALESCE(cs.case_illegal_firearms_count, 0)AS case_illegal_firearms_count,
        COALESCE(cs.case_human_trafficking_count,0)AS case_human_trafficking_count,
        COALESCE(cs.case_other_count, 0)           AS case_other_count,
        COALESCE(cs.case_closure_rate, 0)          AS case_closure_rate,
        -- Arrests
        COALESCE(arst.arrest_total, 0)             AS arrest_total,
        COALESCE(arst.arrest_in_custody_count, 0)  AS arrest_in_custody_count,
        COALESCE(arst.arrest_on_bail_count, 0)     AS arrest_on_bail_count,
        COALESCE(arst.arrest_released_count, 0)    AS arrest_released_count,
        COALESCE(arst.arrest_transferred_count, 0) AS arrest_transferred_count,
        COALESCE(arst.arrest_upcoming_bail_count,0)AS arrest_upcoming_bail_count,
        arst.arrest_latest_date,
        -- Criminals
        COALESCE(crm.criminal_total, 0)            AS criminal_total,
        COALESCE(crm.criminal_in_custody_count, 0) AS criminal_in_custody_count,
        COALESCE(crm.criminal_on_bail_count, 0)    AS criminal_on_bail_count,
        COALESCE(crm.criminal_released_count, 0)   AS criminal_released_count,
        COALESCE(crm.criminal_escaped_count, 0)    AS criminal_escaped_count,
        COALESCE(crm.criminal_wanted_count, 0)     AS criminal_wanted_count,
        COALESCE(crm.criminal_avg_risk_level, 0)   AS criminal_avg_risk_level,
        COALESCE(crm.criminal_low_risk_count, 0)   AS criminal_low_risk_count,
        COALESCE(crm.criminal_medium_risk_count, 0)AS criminal_medium_risk_count,
        COALESCE(crm.criminal_high_risk_count, 0)  AS criminal_high_risk_count,
        COALESCE(crm.criminal_critical_risk_count,0)AS criminal_critical_risk_count,
        -- Bail
        COALESCE(bs.bail_total, 0)                 AS bail_total,
        COALESCE(bs.bail_pending_count, 0)         AS bail_pending_count,
        COALESCE(bs.bail_granted_count, 0)         AS bail_granted_count,
        COALESCE(bs.bail_rejected_count, 0)        AS bail_rejected_count,
        COALESCE(bs.bail_avg_granted_amount, 0)    AS bail_avg_granted_amount,
        -- Incarcerations
        COALESCE(ins.incarceration_total, 0)       AS incarceration_total,
        COALESCE(ins.incarceration_active_count, 0)AS incarceration_active_count,
        COALESCE(ins.incarceration_released_count,0)AS incarceration_released_count,
        COUNT(*) OVER()                            AS filtered_thana_count
    FROM filtered_thanas ft
    LEFT JOIN officer_stats       os   ON os.thana_id   = ft.thana_id
    LEFT JOIN gd_stats            gs   ON gs.thana_id   = ft.thana_id
    LEFT JOIN case_stats          cs   ON cs.thana_id   = ft.thana_id
    LEFT JOIN arrest_stats        arst ON arst.thana_id = ft.thana_id
    LEFT JOIN criminal_stats      crm  ON crm.thana_id  = ft.thana_id
    LEFT JOIN bail_stats          bs   ON bs.thana_id   = ft.thana_id
    LEFT JOIN incarceration_stats ins  ON ins.thana_id  = ft.thana_id
    ORDER BY
        COALESCE(gs.gd_total, 0)   DESC,
        COALESCE(cs.case_total, 0) DESC,
        COALESCE(arst.arrest_total, 0) DESC,
        ft.thana_name ASC;
`;

// ─── Row Mapper ───────────────────────────────────────────────────────────────

const mapRow = (row) => ({
    thana: {
        thana_id:            row.thana_id,
        thana_name:          row.thana_name,
        district:            row.district,
        zone:                row.zone,
        address:             row.address,
        phone:               row.phone,
        email:               row.email,
        created_by_admin_id: row.created_by_admin_id,
        head_officer: row.head_officer_id
            ? {
                officer_id: row.head_officer_id,
                full_name:  row.head_officer_name,
                rank_code:  row.head_officer_rank_code,
                email:      row.head_officer_email,
                phone:      row.head_officer_phone,
            }
            : null,
    },
    officers: {
        total:             coalesceNumber(row.officer_total),
        constables:        coalesceNumber(row.officer_constable_count),
        sub_inspectors:    coalesceNumber(row.officer_si_count),
        inspectors:        coalesceNumber(row.officer_inspector_count),
        officers_in_charge:coalesceNumber(row.officer_oc_count),
        male:              coalesceNumber(row.officer_male_count),
        female:            coalesceNumber(row.officer_female_count),
        other:             coalesceNumber(row.officer_other_count),
        average_age:       coalesceNumber(row.officer_avg_age),
    },
    gd_reports: {
        total:        coalesceNumber(row.gd_total),
        submitted:    coalesceNumber(row.gd_submitted_count),
        assigned:     coalesceNumber(row.gd_assigned_count),
        approved:     coalesceNumber(row.gd_approved_count),
        rejected:     coalesceNumber(row.gd_rejected_count),
        approval_rate:coalesceNumber(row.gd_approval_rate),
        type_breakdown: {
            theft:               coalesceNumber(row.gd_theft_count),
            lost_document:       coalesceNumber(row.gd_lost_document_count),
            missing_person:      coalesceNumber(row.gd_missing_person_count),
            accident:            coalesceNumber(row.gd_accident_count),
            assault:             coalesceNumber(row.gd_assault_count),
            robbery:             coalesceNumber(row.gd_robbery_count),
            fraud:               coalesceNumber(row.gd_fraud_count),
            domestic_violence:   coalesceNumber(row.gd_domestic_violence_count),
            property_dispute:    coalesceNumber(row.gd_property_dispute_count),
            suspicious_activity: coalesceNumber(row.gd_suspicious_activity_count),
            threat:              coalesceNumber(row.gd_threat_count),
            noise_disturbance:   coalesceNumber(row.gd_noise_disturbance_count),
            other:               coalesceNumber(row.gd_other_count),
        },
    },
    cases: {
        total:              coalesceNumber(row.case_total),
        open:               coalesceNumber(row.case_open_count),
        closed:             coalesceNumber(row.case_closed_count),
        under_investigation:coalesceNumber(row.case_under_investigation_count),
        closure_rate:       coalesceNumber(row.case_closure_rate),
        type_breakdown: {
            theft:            coalesceNumber(row.case_theft_count),
            robbery:          coalesceNumber(row.case_robbery_count),
            murder:           coalesceNumber(row.case_murder_count),
            assault:          coalesceNumber(row.case_assault_count),
            kidnapping:       coalesceNumber(row.case_kidnapping_count),
            fraud:            coalesceNumber(row.case_fraud_count),
            cyber_crime:      coalesceNumber(row.case_cyber_crime_count),
            drug_offense:     coalesceNumber(row.case_drug_offense_count),
            domestic_violence:coalesceNumber(row.case_domestic_violence_count),
            extortion:        coalesceNumber(row.case_extortion_count),
            illegal_firearms: coalesceNumber(row.case_illegal_firearms_count),
            human_trafficking:coalesceNumber(row.case_human_trafficking_count),
            other:            coalesceNumber(row.case_other_count),
        },
    },
    arrests: {
        total:            coalesceNumber(row.arrest_total),
        in_custody:       coalesceNumber(row.arrest_in_custody_count),
        on_bail:          coalesceNumber(row.arrest_on_bail_count),
        released:         coalesceNumber(row.arrest_released_count),
        transferred:      coalesceNumber(row.arrest_transferred_count),
        upcoming_bail_due:coalesceNumber(row.arrest_upcoming_bail_count),
        latest_date:      row.arrest_latest_date,
    },
    criminals: {
        total:             coalesceNumber(row.criminal_total),
        in_custody:        coalesceNumber(row.criminal_in_custody_count),
        on_bail:           coalesceNumber(row.criminal_on_bail_count),
        released:          coalesceNumber(row.criminal_released_count),
        escaped:           coalesceNumber(row.criminal_escaped_count),
        wanted:            coalesceNumber(row.criminal_wanted_count),
        average_risk_level:coalesceNumber(row.criminal_avg_risk_level),
        risk_breakdown: {
            low:      coalesceNumber(row.criminal_low_risk_count),
            medium:   coalesceNumber(row.criminal_medium_risk_count),
            high:     coalesceNumber(row.criminal_high_risk_count),
            critical: coalesceNumber(row.criminal_critical_risk_count),
        },
    },
    bail: {
        total:                coalesceNumber(row.bail_total),
        pending:              coalesceNumber(row.bail_pending_count),
        granted:              coalesceNumber(row.bail_granted_count),
        rejected:             coalesceNumber(row.bail_rejected_count),
        average_granted_amount:coalesceNumber(row.bail_avg_granted_amount),
    },
    incarcerations: {
        total:   coalesceNumber(row.incarceration_total),
        active:  coalesceNumber(row.incarceration_active_count),
        released:coalesceNumber(row.incarceration_released_count),
    },
    filtered_thana_count: coalesceNumber(row.filtered_thana_count),
});

// ─── Summary Aggregator ───────────────────────────────────────────────────────

const buildSummary = (data) => {
    const totals = data.reduce(
        (acc, item) => {
            acc.total_thanas          += 1;
            acc.total_officers        += item.officers.total;
            acc.total_gd_reports      += item.gd_reports.total;
            acc.total_cases           += item.cases.total;
            acc.total_arrests         += item.arrests.total;
            acc.total_criminals       += item.criminals.total;
            acc.total_bail_records    += item.bail.total;
            acc.total_incarcerations  += item.incarcerations.total;
            acc.gd_approval_rate_sum  += item.gd_reports.approval_rate;
            acc.case_closure_rate_sum += item.cases.closure_rate;
            acc.criminal_risk_sum     += item.criminals.average_risk_level;
            return acc;
        },
        {
            total_thanas: 0, total_officers: 0, total_gd_reports: 0,
            total_cases: 0, total_arrests: 0, total_criminals: 0,
            total_bail_records: 0, total_incarcerations: 0,
            gd_approval_rate_sum: 0, case_closure_rate_sum: 0, criminal_risk_sum: 0,
        },
    );

    const n = data.length || 1;
    return {
        total_thanas:                totals.total_thanas,
        total_officers:              totals.total_officers,
        total_gd_reports:            totals.total_gd_reports,
        total_cases:                 totals.total_cases,
        total_arrests:               totals.total_arrests,
        total_criminals:             totals.total_criminals,
        total_bail_records:          totals.total_bail_records,
        total_incarcerations:        totals.total_incarcerations,
        average_gd_approval_rate:    Number((totals.gd_approval_rate_sum  / n).toFixed(2)),
        average_case_closure_rate:   Number((totals.case_closure_rate_sum / n).toFixed(2)),
        average_criminal_risk_level: Number((totals.criminal_risk_sum     / n).toFixed(2)),
    };
};

// ─── Exported Filter Normalizer (for response echo) ──────────────────────────

const normalizeFilters = (f) =>
    Object.fromEntries(
        Object.entries(f).map(([k, v]) => [k, normalizeText(v)])
    );

// ─── Main Repository Function ─────────────────────────────────────────────────

export const getThanaAnalyticsRepository = async (rawFilters = {}) => {
    const f      = buildFilters(rawFilters);
    const params = [];
    const where  = buildWhereClauses(f, params);
    const query  = buildQuery(where);

    const result = await pool.query(query, params);
    const data   = result.rows.map(mapRow);

    return {
        filters: normalizeFilters(f),
        summary: buildSummary(data),
        data,
    };
};
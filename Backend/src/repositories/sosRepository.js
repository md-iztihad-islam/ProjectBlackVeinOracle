import pool from "../config/dbConnection.js";

let sosSchemaReady = false;

export const ensureSosSchemaRepository = async () => {
  if (sosSchemaReady) return;

  const query = `
    CREATE TABLE IF NOT EXISTS sos_alert (
      sos_id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
      district VARCHAR(100) NOT NULL,
      thana_id TEXT NOT NULL REFERENCES thana(thana_id) ON DELETE CASCADE,
      description TEXT,
      image_url TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'triggered'
        CHECK (status IN ('triggered', 'assigned', 'acknowledged', 'resolved', 'cancelled')),
      assigned_officer_id TEXT REFERENCES officer(officer_id),
      assigned_by_thana_id TEXT REFERENCES thana(thana_id),
      acknowledged_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_sos_alert_thana_status
      ON sos_alert(thana_id, status, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_sos_alert_officer_status
      ON sos_alert(assigned_officer_id, status, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_sos_alert_user_created
      ON sos_alert(user_id, created_at DESC);

    ALTER TABLE sos_alert
      ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS detected_address TEXT;
  `;

  await pool.query(query);
  sosSchemaReady = true;
};

export const getDistrictThanaOptionsRepository = async () => {
  const query = `
    SELECT
      district,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'thana_id', thana_id,
          'thana_name', thana_name,
          'zone', zone,
          'address', address
        )
        ORDER BY thana_name
      ) AS thanas
    FROM thana
    GROUP BY district
    ORDER BY district;
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const createSosAlertRepository = async ({ userId, district, thanaId, description, imageUrl }) => {
  const query = `
    INSERT INTO sos_alert (
      user_id,
      district,
      thana_id,
      description,
      image_url,
      latitude,
      longitude,
      detected_address
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    userId,
    district,
    thanaId,
    description || null,
    imageUrl || null,
    null,
    null,
    null,
  ]);

  return result.rows[0];
};

export const createSosAlertWithGpsRepository = async ({
  userId,
  district,
  thanaId,
  description,
  imageUrl,
  latitude,
  longitude,
  detectedAddress,
}) => {
  const query = `
    INSERT INTO sos_alert (
      user_id,
      district,
      thana_id,
      description,
      image_url,
      latitude,
      longitude,
      detected_address
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    userId,
    district,
    thanaId,
    description || null,
    imageUrl || null,
    latitude ?? null,
    longitude ?? null,
    detectedAddress || null,
  ]);

  return result.rows[0];
};

export const getOneThanaByDistrictRepository = async (district) => {
  const query = `
    SELECT thana_id, thana_name, district
    FROM thana
    WHERE
      regexp_replace(lower(district), '[^a-z]', '', 'g') = regexp_replace(lower($1), '[^a-z]', '', 'g')
      OR lower(district) LIKE '%' || lower($1) || '%'
      OR lower($1) LIKE '%' || lower(district) || '%'
    ORDER BY
      CASE
        WHEN regexp_replace(lower(district), '[^a-z]', '', 'g') = regexp_replace(lower($1), '[^a-z]', '', 'g') THEN 1
        WHEN lower(district) = lower($1) THEN 2
        WHEN lower(district) LIKE '%' || lower($1) || '%' THEN 3
        ELSE 4
      END,
      thana_name ASC
    LIMIT 1;
  `;

  const result = await pool.query(query, [district]);
  return result.rows[0] || null;
};

export const getAnyThanaRepository = async () => {
  const query = `
    SELECT thana_id, thana_name, district
    FROM thana
    ORDER BY thana_name ASC
    LIMIT 1;
  `;

  const result = await pool.query(query);
  return result.rows[0] || null;
};

export const addNotificationRepository = async ({ targetRole, targetId, title, message }) => {
  const query = `
    INSERT INTO notification (target_role, target_id, title, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = await pool.query(query, [targetRole, targetId, title, message]);
  return result.rows[0];
};

export const getUserBasicsRepository = async (userId) => {
  const query = `
    SELECT user_id, full_name, phone, address
    FROM "user"
    WHERE user_id = $1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

export const getThanaBasicsRepository = async (thanaId) => {
  const query = `
    SELECT thana_id, thana_name, district
    FROM thana
    WHERE thana_id = $1;
  `;
  const result = await pool.query(query, [thanaId]);
  return result.rows[0] || null;
};

export const getSosAlertsForUserRepository = async (userId) => {
  const query = `
    SELECT
      sa.sos_id,
      sa.user_id,
      sa.district,
      sa.thana_id,
      t.thana_name,
      sa.description,
      sa.image_url,
      sa.latitude,
      sa.longitude,
      sa.detected_address,
      sa.status,
      sa.assigned_officer_id,
      o.full_name AS assigned_officer_name,
      o.phone AS assigned_officer_phone,
      sa.acknowledged_at,
      sa.created_at,
      sa.updated_at
    FROM sos_alert sa
    JOIN thana t ON t.thana_id = sa.thana_id
    LEFT JOIN officer o ON o.officer_id = sa.assigned_officer_id
    WHERE sa.user_id = $1
    ORDER BY sa.created_at DESC
    LIMIT 20;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getSosAlertsForThanaRepository = async (thanaId) => {
  const query = `
    SELECT
      sa.sos_id,
      sa.user_id,
      u.full_name AS user_name,
      u.phone AS user_phone,
      u.address AS user_address,
      sa.district,
      sa.description,
      sa.image_url,
      sa.latitude,
      sa.longitude,
      sa.detected_address,
      sa.status,
      sa.assigned_officer_id,
      o.full_name AS assigned_officer_name,
      sa.created_at,
      sa.updated_at
    FROM sos_alert sa
    JOIN "user" u ON u.user_id = sa.user_id
    LEFT JOIN officer o ON o.officer_id = sa.assigned_officer_id
    WHERE sa.thana_id = $1
      AND sa.status IN ('triggered', 'assigned')
    ORDER BY
      CASE sa.status
        WHEN 'triggered' THEN 1
        WHEN 'assigned' THEN 2
        ELSE 4
      END,
      sa.created_at DESC
    LIMIT 50;
  `;

  const result = await pool.query(query, [thanaId]);
  return result.rows;
};

export const assignOfficerToSosRepository = async ({ sosId, thanaId, officerId }) => {
  const query = `
    UPDATE sos_alert sa
    SET
      assigned_officer_id = $3,
      assigned_by_thana_id = $2,
      status = 'assigned',
      updated_at = NOW()
    FROM officer o
    WHERE sa.sos_id = $1
      AND sa.thana_id = $2
      AND o.officer_id = $3
      AND o.thana_id = $2
      AND sa.status IN ('triggered', 'assigned')
    RETURNING sa.*;
  `;

  const result = await pool.query(query, [sosId, thanaId, officerId]);
  return result.rows[0] || null;
};

export const getSosAlertsForOfficerRepository = async (officerId) => {
  const query = `
    SELECT
      sa.sos_id,
      sa.user_id,
      u.full_name AS user_name,
      u.phone AS user_phone,
      u.address AS user_address,
      sa.description,
      sa.image_url,
      sa.latitude,
      sa.longitude,
      sa.detected_address,
      sa.status,
      sa.district,
      sa.thana_id,
      t.thana_name,
      sa.created_at,
      sa.updated_at,
      sa.acknowledged_at
    FROM sos_alert sa
    JOIN "user" u ON u.user_id = sa.user_id
    JOIN thana t ON t.thana_id = sa.thana_id
    WHERE sa.assigned_officer_id = $1
      AND (
        sa.status = 'assigned'
        OR (
          sa.status = 'acknowledged'
          AND sa.acknowledged_at IS NOT NULL
          AND sa.acknowledged_at >= NOW() - INTERVAL '1 minute'
        )
      )
    ORDER BY sa.created_at DESC
    LIMIT 50;
  `;

  const result = await pool.query(query, [officerId]);
  return result.rows;
};

export const acknowledgeSosByOfficerRepository = async ({ sosId, officerId }) => {
  const query = `
    UPDATE sos_alert
    SET
      status = 'acknowledged',
      acknowledged_at = COALESCE(acknowledged_at, NOW()),
      updated_at = NOW()
    WHERE sos_id = $1
      AND assigned_officer_id = $2
      AND status = 'assigned'
    RETURNING *;
  `;

  const result = await pool.query(query, [sosId, officerId]);
  return result.rows[0] || null;
};

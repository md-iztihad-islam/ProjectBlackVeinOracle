import pool from "../config/dbConnection.js";



export const addCriminalLocationRepository = async (data) => {
  try {
    const { criminal_id, location_id } = data;
    const query = `
            INSERT INTO criminal_location (criminal_id, location_id)
            VALUES ($1, $2) RETURNING *;
        `;
    const result = await pool.query(query, [criminal_id, location_id]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at addCriminalLocationRepository:", error);
    throw error;
  }
};

export const getAllCriminalLocationsRepository = async () => {
  try {
    const query = `
            SELECT cl.*, c.full_name AS criminal_name, l.district, l.address, l.zone
            FROM criminal_location cl
            JOIN criminal c ON cl.criminal_id = c.criminal_id
            JOIN location l ON cl.location_id = l.location_id
            ORDER BY cl.noted_at DESC;
        `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.log("Error at getAllCriminalLocationsRepository:", error);
    throw error;
  }
};

export const getLocationsByCriminalRepository = async (criminalId) => {
  try {
    const query = `
            SELECT cl.*, l.district, l.address, l.zone
            FROM criminal_location cl
            JOIN location l ON cl.location_id = l.location_id
            WHERE cl.criminal_id = $1
            ORDER BY cl.noted_at DESC;
        `;
    const result = await pool.query(query, [criminalId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getLocationsByCriminalRepository:", error);
    throw error;
  }
};

export const getCriminalsByLocationRepository = async (locationId) => {
  try {
    const query = `
            SELECT cl.*, c.full_name AS criminal_name, c.risk_level
            FROM criminal_location cl
            JOIN criminal c ON cl.criminal_id = c.criminal_id
            WHERE cl.location_id = $1
            ORDER BY cl.noted_at DESC;
        `;
    const result = await pool.query(query, [locationId]);
    return result.rows;
  } catch (error) {
    console.log("Error at getCriminalsByLocationRepository:", error);
    throw error;
  }
};

export const deleteCriminalLocationRepository = async (clId) => {
  try {
    const query = `DELETE FROM criminal_location WHERE criminal_location_id = $1 RETURNING *;`;
    const result = await pool.query(query, [clId]);
    return result.rows[0];
  } catch (error) {
    console.log("Error at deleteCriminalLocationRepository:", error);
    throw error;
  }
};
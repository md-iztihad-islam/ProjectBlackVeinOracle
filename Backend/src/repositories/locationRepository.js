import pool from "../config/dbConnection.js";

export const addLocationRepository = async (locationData) => {
    try {
        const { district, address, zone } = locationData;
        const query = `
            INSERT INTO location (district, address, zone)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [district, address, zone];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error adding location at addLocationRepository:', error);
        throw error;
    }
}


export const getAllLocationsRepository = async () => {
    try {
        const query = 'SELECT * FROM location;';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log('Error fetching all locations at getAllLocationsRepository:', error);
        throw error;
    }
}


export const getLocationByIdRepository = async (locationId) => {
    try {
        const query = 'SELECT * FROM location WHERE location_id = $1;';
        const result = await pool.query(query, [locationId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error fetching location by ID at getLocationByIdRepository:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const updateLocationRepository = async (locationId, data) => {
    try {
        const { address, district, zone } = data;
        const query = `
            UPDATE location SET address = $1, district = $2, zone = $3
            WHERE location_id = $4
            RETURNING *;
        `;
        const values = [address, district, zone, locationId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log('Error updating location at updateLocationRepository:', error);
        throw error;
    }
}


export const deleteLocationRepository = async (locationId) => {
    try {
        const query = 'DELETE FROM location WHERE location_id = $1 RETURNING *;';
        const result = await pool.query(query, [locationId]);
        return result.rows[0];
    } catch (error) {
        console.log('Error deleting location at deleteLocationRepository:', error);
        throw error;
    }
}


export const getLocationsByDistrictRepository = async (district) => {
    try {
        const query = 'SELECT * FROM location WHERE district = $1;';
        const result = await pool.query(query, [district]);
        return result.rows;
    } catch (error) {
        console.log('Error fetching locations by district at getLocationsByDistrictRepository:', error);
        throw error;
    }
}
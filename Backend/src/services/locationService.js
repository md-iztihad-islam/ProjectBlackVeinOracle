import { addLocationRepository, getAllLocationsRepository, getLocationByIdRepository, updateLocationRepository, deleteLocationRepository, getLocationsByDistrictRepository } from "../repositories/locationRepository.js";

export const addLocationService = async (locationData) => {
    try {
        const newLocation = await addLocationRepository(locationData);  
        return newLocation;
    } catch (error) {
        console.log('Error adding location at addLocationService:', error);
        throw error;
    }
}

// by Rayyan 2.0

export const getAllLocationsService = async () => {
    try {
        const locations = await getAllLocationsRepository();
        return locations;
    } catch (error) {
        console.log('Error fetching all locations at getAllLocationsService:', error);
        throw error;
    }
}

// by Rayyan 2.0

export const getLocationByIdService = async (locationId) => {
    try {
        const location = await getLocationByIdRepository(locationId);
        return location;
    } catch (error) {
        console.log('Error fetching location by ID at getLocationByIdService:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const updateLocationService = async (locationId, data) => {
    try {
        const updatedLocation = await updateLocationRepository(locationId, data);
        return updatedLocation;
    } catch (error) {
        console.log('Error updating location at updateLocationService:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const deleteLocationService = async (locationId) => {
    try {
        const deletedLocation = await deleteLocationRepository(locationId);
        return deletedLocation;
    } catch (error) {
        console.log('Error deleting location at deleteLocationService:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const getLocationsByDistrictService = async (district) => {
    try {
        const locations = await getLocationsByDistrictRepository(district);
        return locations;
    } catch (error) {
        console.log('Error fetching locations by district at getLocationsByDistrictService:', error);
        throw error;
    }
}
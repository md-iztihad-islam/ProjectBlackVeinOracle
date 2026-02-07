import { addLocationRepository } from "../repositories/locationRepository.js";

export const addLocationService = async (locationData) => {
    try {
        const newLocation = await addLocationRepository(locationData);  
        return newLocation;
    } catch (error) {
        console.log('Error adding location at addLocationService:', error);
        throw error;
    }
}
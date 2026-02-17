import { addCriminalRepository, getCriminalByIdRepository } from "../repositories/criminalRepository.js";

export const addCriminalService = async (criminalData) => {
    try {
        const newCriminal = await addCriminalRepository(criminalData);
        return newCriminal;
    } catch (error) {
        console.log('Error adding criminal at addCriminalService:', error);
        throw error;
    }
}

export const getCriminalByIdService = async (criminalId) => {
    try {
        const criminalDetails = await getCriminalByIdRepository(criminalId);
        return criminalDetails;
    } catch (error) {
        console.log('Error fetching criminal by ID at getCriminalByIdService:', error);
        throw error;
    }
}
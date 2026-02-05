import { addCriminalRepository } from "../repositories/criminalRepository.js";

export const addCriminalService = async (criminalData) => {
    try {
        const newCriminal = await addCriminalRepository(criminalData);
        return newCriminal;
    } catch (error) {
        console.log('Error adding criminal at addCriminalService:', error);
        throw error;
    }
}
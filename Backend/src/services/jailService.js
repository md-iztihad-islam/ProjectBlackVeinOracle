import { addJailRepository, getAllJailsRepository, getJailByIdRepository } from "../repositories/jailRepository.js";

export const addJailService = async (jailService) => {
    try {
        const newJail = await addJailRepository(jailService);
        return newJail;
    } catch (error) {
        console.log('Error adding jail at addJailService:', error);
        throw error;
    }
}

export const getAllJailsService = async () => {
    try {
        const jails = await getAllJailsRepository();
        return jails;
    } catch (error) {
        console.log('Error fetching jails at getAllJailsService:', error);
        throw error;
    }
}

export const getJailByIdService = async (jailId) => {
    try {
        const jail = await getJailByIdRepository(jailId);
        return jail;
    } catch (error) {
        console.log('Error fetching jail by ID at getJailByIdService:', error);
        throw error;
    }
}
import { addJailRepository } from "../repositories/jailRepository.js";

export const addJailService = async (jailService) => {
    try {
        const newJail = await addJailRepository(jailService);
        return newJail;
    } catch (error) {
        console.log('Error adding jail at addJailService:', error);
        throw error;
    }
}
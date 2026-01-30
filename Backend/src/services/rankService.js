import { addRankRepository } from "../repositories/rankRepository.js";

export const addRankService = async (rankData) => {
    try {
        const newRank = await addRankRepository(rankData);
        return newRank;
    } catch (error) {
        console.log('Error adding rank at addRankService:', error);
        throw error;
    }
}
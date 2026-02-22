import { addRankRepository, getAllRanksRepository, getRankByIdRepository, updateRankRepository, deleteRankRepository } from "../repositories/rankRepository.js";

export const addRankService = async (rankData) => {
    try {
        const newRank = await addRankRepository(rankData);
        return newRank;
    } catch (error) {
        console.log('Error adding rank at addRankService:', error);
        throw error;
    }
}

// by Rayyan 2.0

export const getAllRanksService = async () => {
    try {
        const ranks = await getAllRanksRepository();
        return ranks;
    } catch (error) {
        console.log('Error fetching all ranks at getAllRanksService:', error);
        throw error;
    }
}



export const getRankByIdService = async (rankId) => {
    try {
        const rank = await getRankByIdRepository(rankId);
        return rank;
    } catch (error) {
        console.log('Error fetching rank by ID at getRankByIdService:', error);
        throw error;
    }
}


export const updateRankService = async (rankId, data) => {
    try {
        const updatedRank = await updateRankRepository(rankId, data);
        return updatedRank;
    } catch (error) {
        console.log('Error updating rank at updateRankService:', error);
        throw error;
    }
}


export const deleteRankService = async (rankId) => {
    try {
        const deletedRank = await deleteRankRepository(rankId);
        return deletedRank;
    } catch (error) {
        console.log('Error deleting rank at deleteRankService:', error);
        throw error;
    }
}
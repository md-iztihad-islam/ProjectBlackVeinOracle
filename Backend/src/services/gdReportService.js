import { addGeneralDairyRepository, getGeneralDairiesByUserIdRepository, getGeneralDairyByIdRepository, updateGeneralDairyStatusRepository } from "../repositories/gdReportRepository.js";

export const addGeneralDairyService = async (dairyData) => {
    try {
        const newDairy = await addGeneralDairyRepository(dairyData);
        return newDairy;
    } catch (error) {
        console.log('Error adding general dairy at addGeneralDairyService:', error);
        throw error;
    }
}

export const getGeneralDairiesByUserIdService = async (userId) => {
    try {
        const dairies = await getGeneralDairiesByUserIdRepository(userId);
        return dairies;
    } catch (error) {
        console.log('Error fetching general dairies by user ID at getGeneralDairiesByUserIdService:', error);
        throw error;
    }
}

export const getGeneralDairyByIdService = async (dairyId) => {
    try {
        const dairy = await getGeneralDairyByIdRepository(dairyId);
        return dairy;
    } catch (error) {
        console.log('Error fetching general dairy by ID at getGeneralDairyByIdService:', error);
        throw error;
    }
}

export const updateGeneralDairyStatusService = async (dairyId, status, approvedByOfficerId, assignedOfficerId) => {
    try {
        const updatedDairy = await updateGeneralDairyStatusRepository(dairyId, status, approvedByOfficerId, assignedOfficerId);
        return updatedDairy;
    } catch (error) {
        console.log('Error updating general dairy status at updateGeneralDairyStatusService:', error);
        throw error;
    }
}
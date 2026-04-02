import { addCriminalRepository, getCriminalByIdRepository, getCriminalsByThanaIdRepository, getCriminalFullProfileRepository, getCriminalTimelineRepository, getCriminalCaseHistoryRepository, recalculateCriminalRiskRepository, getAllCriminalsRepository, updateCriminalRepository, deleteCriminalRepository, getCriminalsByStatusRepository, searchCriminalsRepository, getWantedCriminalsRepository, getCriminalsByAreaRepository, getCriminalByNameRepository } from "../repositories/criminalRepository.js"; 

const VALID_GENDERS = ["male", "female", "other"];

const validateCriminalProfile = (criminalData, { requireImage = false } = {}) => {
    if (requireImage && (!criminalData?.image_url || String(criminalData.image_url).trim() === "")) {
        throw new Error("image_url is required");
    }

    if (criminalData?.birth_date) {
        const parsedBirthDate = new Date(criminalData.birth_date);
        if (Number.isNaN(parsedBirthDate.getTime()) || parsedBirthDate > new Date()) {
            throw new Error("Invalid birth_date");
        }
    }

    if (criminalData?.gender) {
        const normalizedGender = String(criminalData.gender).trim().toLowerCase();
        if (!VALID_GENDERS.includes(normalizedGender)) {
            throw new Error("Invalid gender");
        }
        criminalData.gender = normalizedGender;
    }
};

export const addCriminalService = async (criminalData) => {
    try {
        validateCriminalProfile(criminalData, { requireImage: true });
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

export const getCriminalsByThanaIdService = async (thanaId) => {
    try {
        const criminals = await getCriminalsByThanaIdRepository(thanaId);
        return criminals;
    } catch (error) {
        console.log('Error fetching criminals by thana ID at getCriminalsByThanaIdService:', error);
        throw error;
    }
}

// by Rayyan 2.0

export const getCriminalFullProfileService = async (criminalId) => {
    try {
        return await getCriminalFullProfileRepository(criminalId);
    } catch (error) {
        console.log("Error at getCriminalFullProfileService:", error);
        throw error;
    }
};

export const getCriminalTimelineService = async (criminalId) => {
    try {
        return await getCriminalTimelineRepository(criminalId);
    } catch (error) {
        console.log("Error at getCriminalTimelineService:", error);
        throw error;
    }
};

export const getCriminalCaseHistoryService = async (criminalId) => {
    try {
        return await getCriminalCaseHistoryRepository(criminalId);
    } catch (error) {
        console.log("Error at getCriminalCaseHistoryService:", error);
        throw error;
    }
};

export const recalculateCriminalRiskService = async (criminalId) => {
    try {
        return await recalculateCriminalRiskRepository(criminalId);
    } catch (error) {
        console.log("Error at recalculateCriminalRiskService:", error);
        throw error;
    }
};


export const getAllCriminalsService = async () => {
    try {
        return await getAllCriminalsRepository();
    } catch (error) {
        console.log('Error at getAllCriminalsService:', error);
        throw error;
    }
};

export const updateCriminalService = async (criminalId, data) => {
    try {
        validateCriminalProfile(data);
        return await updateCriminalRepository(criminalId, data);
    } catch (error) {
        console.log('Error at updateCriminalService:', error);
        throw error;
    }
};


export const deleteCriminalService = async (criminalId) => {
    try {
        return await deleteCriminalRepository(criminalId);
    } catch (error) {
        console.log('Error at deleteCriminalService:', error);
        throw error;
    }
};


export const getCriminalsByStatusService = async (status) => {
    try {
        return await getCriminalsByStatusRepository(status);
    } catch (error) {
        console.log('Error at getCriminalsByStatusService:', error);
        throw error;
    }
};


export const searchCriminalsService = async (searchTerm) => {
    try {
        return await searchCriminalsRepository(searchTerm);
    } catch (error) {
        console.log('Error at searchCriminalsService:', error);
        throw error;
    }
};


export const getWantedCriminalsService = async () => {
    try {
        return await getWantedCriminalsRepository();
    } catch (error) {
        console.log('Error at getWantedCriminalsService:', error);
        throw error;
    }
};


export const getCriminalsByAreaService = async (district) => {
    try {
        return await getCriminalsByAreaRepository(district);
    } catch (error) {
        console.log('Error at getCriminalsByAreaService:', error);
        throw error;
    }
};

export const getCriminalByNameService = async (name) => {
    try {        
        const criminals = await getCriminalByNameRepository(name);
        return criminals.length > 0 ? criminals : null;
    } catch (error) {
        console.log('Error at getCriminalByNameService:', error);
        throw error;
    }
};
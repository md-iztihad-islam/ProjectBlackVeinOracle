import {
  addIncarcerationRepository,
  getAllIncarcerationsRepository,
  getIncarcerationByIdRepository,
  getIncarcerationsByCriminalRepository,
  getIncarcerationsByJailRepository,
  updateIncarcerationRepository,
  releaseIncarcerationRepository,
  deleteIncarcerationRepository,
  findAvailableCellRepository,
  transferCriminalRepository,
  getTransferHistoryRepository,
} from "../repositories/incarcerationRepository.js";



export const addIncarcerationService = async (data) => {
  try {
    return await addIncarcerationRepository(data);
  } catch (e) {
    throw e;
  }
};


export const getAllIncarcerationsService = async () => {
  try {
    return await getAllIncarcerationsRepository();
  } catch (e) {
    throw e;
  }
};



export const getIncarcerationByIdService = async (id) => {
  try {
    return await getIncarcerationByIdRepository(id);
  } catch (e) {
    throw e;
  }
};


export const getIncarcerationsByCriminalService = async (criminalId) => {
  try {
    return await getIncarcerationsByCriminalRepository(criminalId);
  } catch (e) {
    throw e;
  }
};


export const getIncarcerationsByJailService = async (jailId) => {
  try {
    return await getIncarcerationsByJailRepository(jailId);
  } catch (e) {
    throw e;
  }
};


export const updateIncarcerationService = async (id, data) => {
  try {
    return await updateIncarcerationRepository(id, data);
  } catch (e) {
    throw e;
  }
};


export const releaseIncarcerationService = async (id) => {
  try {
    return await releaseIncarcerationRepository(id);
  } catch (e) {
    throw e;
  }
};


export const deleteIncarcerationService = async (id) => {
  try {
    return await deleteIncarcerationRepository(id);
  } catch (e) {
    throw e;
  }
};


// by Rayyan 2.0

export const findAvailableCellService = async (jailId) => {
    try {
        return await findAvailableCellRepository(jailId);
    } catch (error) {
        console.log("Error at findAvailableCellService:", error);
        throw error;
    }
};

export const transferCriminalService = async (criminalId, fromJailId, toJailId, toCellId, reason, authorizedBy) => {
    try {
        return await transferCriminalRepository(criminalId, fromJailId, toJailId, toCellId, reason, authorizedBy);
    } catch (error) {
        console.log("Error at transferCriminalService:", error);
        throw error;
    }
};

export const getTransferHistoryService = async (criminalId) => {
    try {
        return await getTransferHistoryRepository(criminalId);
    } catch (error) {
        console.log("Error at getTransferHistoryService:", error);
        throw error;
    }
};
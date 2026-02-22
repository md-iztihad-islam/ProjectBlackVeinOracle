import {
  addBailRecordRepository,
  getAllBailRecordsRepository,
  getBailRecordByIdRepository,
  getBailRecordsByCriminalRepository,
  getBailRecordsByArrestRepository,
  updateBailRecordRepository,
  deleteBailRecordRepository,
  processBailDecisionRepository,
} from "../repositories/bailRecordRepository.js";



export const addBailRecordService = async (data) => {
  try {
    return await addBailRecordRepository(data);
  } catch (e) {
    throw e;
  }
};


export const getAllBailRecordsService = async () => {
  try {
    return await getAllBailRecordsRepository();
  } catch (e) {
    throw e;
  }
};


export const getBailRecordByIdService = async (id) => {
  try {
    return await getBailRecordByIdRepository(id);
  } catch (e) {
    throw e;
  }
};


export const getBailRecordsByCriminalService = async (criminalId) => {
  try {
    return await getBailRecordsByCriminalRepository(criminalId);
  } catch (e) {
    throw e;
  }
};


export const getBailRecordsByArrestService = async (arrestId) => {
  try {
    return await getBailRecordsByArrestRepository(arrestId);
  } catch (e) {
    throw e;
  }
};


export const updateBailRecordService = async (id, data) => {
  try {
    return await updateBailRecordRepository(id, data);
  } catch (e) {
    throw e;
  }
};


export const deleteBailRecordService = async (id) => {
  try {
    return await deleteBailRecordRepository(id);
  } catch (e) {
    throw e;
  }
};


// by Rayyan 2.0

export const processBailDecisionService = async (bailId, decision, bailAmount, suretyName) => {
    try {
        return await processBailDecisionRepository(bailId, decision, bailAmount, suretyName);
    } catch (error) {
        console.log("Error at processBailDecisionService:", error);
        throw error;
    }
};
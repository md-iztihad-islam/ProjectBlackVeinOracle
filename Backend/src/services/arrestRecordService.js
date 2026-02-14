import {
  addArrestRecordRepository,
  getAllArrestRecordsRepository,
  getArrestRecordByIdRepository,
  getArrestRecordsByCriminalRepository,
  getArrestRecordsByThanaRepository,
  updateArrestRecordRepository,
  deleteArrestRecordRepository,
} from "../repositories/arrestRecordRepository.js";



export const addArrestRecordService = async (data) => {
  try {
    return await addArrestRecordRepository(data);
  } catch (e) {
    throw e;
  }
};


export const getAllArrestRecordsService = async () => {
  try {
    return await getAllArrestRecordsRepository();
  } catch (e) {
    throw e;
  }
};


export const getArrestRecordByIdService = async (id) => {
  try {
    return await getArrestRecordByIdRepository(id);
  } catch (e) {
    throw e;
  }
};


export const getArrestRecordsByCriminalService = async (criminalId) => {
  try {
    return await getArrestRecordsByCriminalRepository(criminalId);
  } catch (e) {
    throw e;
  }
};


export const getArrestRecordsByThanaService = async (thanaId) => {
  try {
    return await getArrestRecordsByThanaRepository(thanaId);
  } catch (e) {
    throw e;
  }
};


export const updateArrestRecordService = async (id, data) => {
  try {
    return await updateArrestRecordRepository(id, data);
  } catch (e) {
    throw e;
  }
};


export const deleteArrestRecordService = async (id) => {
  try {
    return await deleteArrestRecordRepository(id);
  } catch (e) {
    throw e;
  }
};
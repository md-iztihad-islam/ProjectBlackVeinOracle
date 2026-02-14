import {
  addCaseFileRepository,
  getAllCaseFilesRepository,
  getCaseFileByIdRepository,
  getCaseFilesByThanaRepository,
  getCaseFilesByCriminalRepository,
  updateCaseFileRepository,
  deleteCaseFileRepository,
} from "../repositories/caseFileRepository.js";

export const addCaseFileService = async (data) => {
  try {
    return await addCaseFileRepository(data);
  } catch (e) {
    throw e;
  }
};
export const getAllCaseFilesService = async () => {
  try {
    return await getAllCaseFilesRepository();
  } catch (e) {
    throw e;
  }
};
export const getCaseFileByIdService = async (id) => {
  try {
    return await getCaseFileByIdRepository(id);
  } catch (e) {
    throw e;
  }
};
export const getCaseFilesByThanaService = async (thanaId) => {
  try {
    return await getCaseFilesByThanaRepository(thanaId);
  } catch (e) {
    throw e;
  }
};
export const getCaseFilesByCriminalService = async (criminalId) => {
  try {
    return await getCaseFilesByCriminalRepository(criminalId);
  } catch (e) {
    throw e;
  }
};
export const updateCaseFileService = async (id, data) => {
  try {
    return await updateCaseFileRepository(id, data);
  } catch (e) {
    throw e;
  }
};
export const deleteCaseFileService = async (id) => {
  try {
    return await deleteCaseFileRepository(id);
  } catch (e) {
    throw e;
  }
};
import {
  addCellRepository,
  getAllCellsRepository,
  getCellByIdRepository,
  getCellsByBlockRepository,
  updateCellRepository,
  deleteCellRepository,
  getAvailableCellsRepository,
} from "../repositories/cellRepository.js";

export const addCellService = async (data) => {
  try {
    return await addCellRepository(data);
  } catch (e) {
    throw e;
  }
};
export const getAllCellsService = async () => {
  try {
    return await getAllCellsRepository();
  } catch (e) {
    throw e;
  }
};
export const getCellByIdService = async (id) => {
  try {
    return await getCellByIdRepository(id);
  } catch (e) {
    throw e;
  }
};
export const getCellsByBlockService = async (blockId) => {
  try {
    return await getCellsByBlockRepository(blockId);
  } catch (e) {
    throw e;
  }
};
export const updateCellService = async (id, data) => {
  try {
    return await updateCellRepository(id, data);
  } catch (e) {
    throw e;
  }
};
export const deleteCellService = async (id) => {
  try {
    return await deleteCellRepository(id);
  } catch (e) {
    throw e;
  }
};
export const getAvailableCellsService = async (jailId) => {
  try {
    return await getAvailableCellsRepository(jailId);
  } catch (e) {
    throw e;
  }
};
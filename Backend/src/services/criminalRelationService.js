import {
  addCriminalRelationRepository,
  getAllCriminalRelationsRepository,
  getRelationsByCriminalRepository,
  updateCriminalRelationRepository,
  deleteCriminalRelationRepository,
} from "../repositories/criminalRelationRepository.js";



export const addCriminalRelationService = async (data) => {
  try {
    return await addCriminalRelationRepository(data);
  } catch (e) {
    throw e;
  }
};


export const getAllCriminalRelationsService = async () => {
  try {
    return await getAllCriminalRelationsRepository();
  } catch (e) {
    throw e;
  }
};


export const getRelationsByCriminalService = async (criminalId) => {
  try {
    return await getRelationsByCriminalRepository(criminalId);
  } catch (e) {
    throw e;
  }
};


export const updateCriminalRelationService = async (id, data) => {
  try {
    return await updateCriminalRelationRepository(id, data);
  } catch (e) {
    throw e;
  }
};


export const deleteCriminalRelationService = async (id) => {
  try {
    return await deleteCriminalRelationRepository(id);
  } catch (e) {
    throw e;
  }
};
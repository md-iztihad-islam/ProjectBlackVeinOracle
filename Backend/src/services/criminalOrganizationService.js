import {
  addCriminalOrganizationRepository,
  getCriminalsByOrganizationRepository,
  getOrganizationsByCriminalRepository,
  updateCriminalOrganizationRepository,
  getAllCriminalOrganizationsRepository,
  deleteCriminalOrganizationRepository,
} from "../repositories/criminalOrganizationRepository.js";



export const addCriminalOrganizationService = async (data) => {
  try {
    return await addCriminalOrganizationRepository(data);
  } catch (e) {
    throw e;
  }
};


export const getCriminalsByOrganizationService = async (orgId) => {
  try {
    return await getCriminalsByOrganizationRepository(orgId);
  } catch (e) {
    throw e;
  }
};

export const getAllCriminalOrganizationsService = async () => {
  try {
    return await getAllCriminalOrganizationsRepository();
  } catch (e) {
    throw e;
  }
};


export const getOrganizationsByCriminalService = async (criminalId) => {
  try {
    return await getOrganizationsByCriminalRepository(criminalId);
  } catch (e) {
    throw e;
  }
};


export const updateCriminalOrganizationService = async (criminalId, orgId, data) => {
  try {
    return await updateCriminalOrganizationRepository(criminalId, orgId, data);
  } catch (e) {
    throw e;
  }
};


export const deleteCriminalOrganizationService = async (criminalId, orgId) => {
  try {
    return await deleteCriminalOrganizationRepository(criminalId, orgId);
  } catch (e) {
    throw e;
  }
};
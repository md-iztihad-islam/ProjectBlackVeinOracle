import {
  addCriminalLocationRepository,
  getAllCriminalLocationsRepository,
  getLocationsByCriminalRepository,
  getCriminalsByLocationRepository,
  deleteCriminalLocationRepository,
} from "../repositories/criminalLocationRepository.js";



export const addCriminalLocationService = async (data) => {
  try {
    return await addCriminalLocationRepository(data);
  } catch (e) {
    throw e;
  }
};


export const getAllCriminalLocationsService = async () => {
  try {
    return await getAllCriminalLocationsRepository();
  } catch (e) {
    throw e;
  }
};


export const getLocationsByCriminalService = async (criminalId) => {
  try {
    return await getLocationsByCriminalRepository(criminalId);
  } catch (e) {
    throw e;
  }
};


export const getCriminalsByLocationService = async (locationId) => {
  try {
    return await getCriminalsByLocationRepository(locationId);
  } catch (e) {
    throw e;
  }
};


export const deleteCriminalLocationService = async (id) => {
  try {
    return await deleteCriminalLocationRepository(id);
  } catch (e) {
    throw e;
  }
};
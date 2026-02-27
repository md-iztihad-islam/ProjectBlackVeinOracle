import {
  addCriminalLocationService,
  getAllCriminalLocationsService,
  getLocationsByCriminalService,
  getCriminalsByLocationService,
  deleteCriminalLocationService,
} from "../services/criminalLocationService.js";

export const addCriminalLocationController = async (req, res) => {
  try {
    const result = await addCriminalLocationService(req.body);
    if (!result)
      return res
        .status(400)
        .json({ success: false, message: "Failed to add criminal location" });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("Error at addCriminalLocationController:", error);
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getAllCriminalLocationsController = async (_, res) => {
  try {
    const result = await getAllCriminalLocationsService();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getLocationsByCriminalController = async (req, res) => {
  try {
    const result = await getLocationsByCriminalService(req.params.criminalId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getCriminalsByLocationController = async (req, res) => {
  try {
    const result = await getCriminalsByLocationService(req.params.locationId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const deleteCriminalLocationController = async (req, res) => {
  try {
    const result = await deleteCriminalLocationService(
      req.params.criminalLocationId,
    );
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Criminal location not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
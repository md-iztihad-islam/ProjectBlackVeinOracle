import {
  addCriminalRelationService,
  getAllCriminalRelationsService,
  getRelationsByCriminalService,
  updateCriminalRelationService,
  deleteCriminalRelationService,
} from "../services/criminalRelationService.js";



export const addCriminalRelationController = async (req, res) => {
  try {
    const result = await addCriminalRelationService(req.body);
    if (!result)
      return res
        .status(400)
        .json({ success: false, message: "Failed to add relation" });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("Error at addCriminalRelationController:", error);
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getAllCriminalRelationsController = async (_, res) => {
  try {
    const result = await getAllCriminalRelationsService();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getRelationsByCriminalController = async (req, res) => {
  try {
    const result = await getRelationsByCriminalService(req.params.criminalId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const updateCriminalRelationController = async (req, res) => {
  try {
    const result = await updateCriminalRelationService(
      req.params.relationId,
      req.body,
    );
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Relation not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const deleteCriminalRelationController = async (req, res) => {
  try {
    const result = await deleteCriminalRelationService(req.params.relationId);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Relation not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
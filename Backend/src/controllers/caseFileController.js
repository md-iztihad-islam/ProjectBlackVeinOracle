import {
  addCaseFileService,
  getAllCaseFilesService,
  getCaseFileByIdService,
  getCaseFilesByThanaService,
  getCaseFilesByCriminalService,
  updateCaseFileService,
  deleteCaseFileService,
} from "../services/caseFileService.js";

export const addCaseFileController = async (req, res) => {
  try {
    const result = await addCaseFileService(req.body);
    if (!result)
      return res
        .status(400)
        .json({ success: false, message: "Failed to add case file" });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("Error at addCaseFileController:", error);
    if (error?.message?.includes("case_title") || error?.message?.includes("case_type") || error?.message?.includes("description")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getAllCaseFilesController = async (_, res) => {
  try {
    const result = await getAllCaseFilesService();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("Error at getAllCaseFilesController:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getCaseFileByIdController = async (req, res) => {
  try {
    const result = await getCaseFileByIdService(req.params.caseId);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Case file not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getCaseFilesByThanaController = async (req, res) => {
  try {
    const result = await getCaseFilesByThanaService(req.params.thanaId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getCaseFilesByCriminalController = async (req, res) => {
  try {
    const result = await getCaseFilesByCriminalService(req.params.criminalId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const updateCaseFileController = async (req, res) => {
  try {
    const result = await updateCaseFileService(req.params.caseId, req.body);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Case file not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error?.message?.includes("case_title") || error?.message?.includes("case_type") || error?.message?.includes("description")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const deleteCaseFileController = async (req, res) => {
  try {
    const result = await deleteCaseFileService(req.params.caseId);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Case file not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
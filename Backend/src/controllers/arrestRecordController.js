import {
  addArrestRecordService,
  getAllArrestRecordsService,
  getArrestRecordByIdService,
  getArrestRecordsByCriminalService,
  getArrestRecordsByThanaService,
  updateArrestRecordService,
  deleteArrestRecordService,
} from "../services/arrestRecordService.js";



export const addArrestRecordController = async (req, res) => {
  try {
    const result = await addArrestRecordService(req.body);
    if (!result)
      return res
        .status(400)
        .json({ success: false, message: "Failed to add arrest record" });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("Error at addArrestRecordController:", error);
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getAllArrestRecordsController = async (_, res) => {
  try {
    const result = await getAllArrestRecordsService();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getArrestRecordByIdController = async (req, res) => {
  try {
    const result = await getArrestRecordByIdService(req.params.arrestId);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Arrest record not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getArrestRecordsByCriminalController = async (req, res) => {
  try {
    const result = await getArrestRecordsByCriminalService(
      req.params.criminalId,
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getArrestRecordsByThanaController = async (req, res) => {
  try {
    const result = await getArrestRecordsByThanaService(req.params.thanaId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const updateArrestRecordController = async (req, res) => {
  try {
    const result = await updateArrestRecordService(
      req.params.arrestId,
      req.body,
    );
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Arrest record not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const deleteArrestRecordController = async (req, res) => {
  try {
    const result = await deleteArrestRecordService(req.params.arrestId);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Arrest record not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
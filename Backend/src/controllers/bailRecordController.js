import {
  addBailRecordService,
  getAllBailRecordsService,
  getBailRecordByIdService,
  getBailRecordsByCriminalService,
  getBailRecordsByArrestService,
  updateBailRecordService,
  deleteBailRecordService,
} from "../services/bailRecordService.js";



export const addBailRecordController = async (req, res) => {
  try {
    const result = await addBailRecordService(req.body);
    if (!result)
      return res
        .status(400)
        .json({ success: false, message: "Failed to add bail record" });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("Error at addBailRecordController:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getAllBailRecordsController = async (_, res) => {
  try {
    const result = await getAllBailRecordsService();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getBailRecordByIdController = async (req, res) => {
  try {
    const result = await getBailRecordByIdService(req.params.bailId);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Bail record not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getBailRecordsByCriminalController = async (req, res) => {
  try {
    const result = await getBailRecordsByCriminalService(req.params.criminalId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getBailRecordsByArrestController = async (req, res) => {
  try {
    const result = await getBailRecordsByArrestService(req.params.arrestId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const updateBailRecordController = async (req, res) => {
  try {
    const result = await updateBailRecordService(req.params.bailId, req.body);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Bail record not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const deleteBailRecordController = async (req, res) => {
  try {
    const result = await deleteBailRecordService(req.params.bailId);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Bail record not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
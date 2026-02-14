import {
  addIncarcerationService,
  getAllIncarcerationsService,
  getIncarcerationByIdService,
  getIncarcerationsByCriminalService,
  getIncarcerationsByJailService,
  updateIncarcerationService,
  releaseIncarcerationService,
  deleteIncarcerationService,
} from "../services/incarcerationService.js";



export const addIncarcerationController = async (req, res) => {
  try {
    const result = await addIncarcerationService(req.body);
    if (!result)
      return res
        .status(400)
        .json({ success: false, message: "Failed to add incarceration" });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("Error at addIncarcerationController:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



export const getAllIncarcerationsController = async (_, res) => {
  try {
    const result = await getAllIncarcerationsService();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



export const getIncarcerationByIdController = async (req, res) => {
  try {
    const result = await getIncarcerationByIdService(
      req.params.incarcerationId,
    );
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Incarceration not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getIncarcerationsByCriminalController = async (req, res) => {
  try {
    const result = await getIncarcerationsByCriminalService(
      req.params.criminalId,
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getIncarcerationsByJailController = async (req, res) => {
  try {
    const result = await getIncarcerationsByJailService(req.params.jailId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const updateIncarcerationController = async (req, res) => {
  try {
    const result = await updateIncarcerationService(
      req.params.incarcerationId,
      req.body,
    );
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Incarceration not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



export const releaseIncarcerationController = async (req, res) => {
  try {
    const result = await releaseIncarcerationService(
      req.params.incarcerationId,
    );
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Incarceration not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



export const deleteIncarcerationController = async (req, res) => {
  try {
    const result = await deleteIncarcerationService(req.params.incarcerationId);
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Incarceration not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
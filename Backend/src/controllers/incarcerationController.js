import {
  addIncarcerationService,
  getAllIncarcerationsService,
  getIncarcerationByIdService,
  getIncarcerationsByCriminalService,
  getIncarcerationsByJailService,
  updateIncarcerationService,
  releaseIncarcerationService,
  deleteIncarcerationService,
  findAvailableCellService,
  transferCriminalService,
  getTransferHistoryService,
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
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
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
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
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


// by Rayyan 2.0


export const findAvailableCellController = async (req, res) => {
    try {
        const data = await findAvailableCellService(req.params.jailId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at findAvailableCellController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const transferCriminalController = async (req, res) => {
    try {
        const { criminalId, fromJailId, toJailId, toCellId, reason, authorizedBy } = req.body;
        const data = await transferCriminalService(criminalId, fromJailId, toJailId, toCellId, reason, authorizedBy);
        return res.status(200).json({ success: true, message: "Transfer successful", data });
    } catch (error) {
        console.log("Error at transferCriminalController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getTransferHistoryController = async (req, res) => {
    try {
        const data = await getTransferHistoryService(req.params.criminalId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getTransferHistoryController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
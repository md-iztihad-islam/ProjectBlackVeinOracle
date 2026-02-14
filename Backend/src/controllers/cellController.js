import {
  addCellService,
  getAllCellsService,
  getCellByIdService,
  getCellsByBlockService,
  updateCellService,
  deleteCellService,
  getAvailableCellsService,
} from "../services/cellService.js";



export const addCellController = async (req, res) => {
  try {
    const r = await addCellService(req.body);
    if (!r) return res.status(400).json({ success: false, message: "Failed" });
    return res.status(201).json({ success: true, data: r });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getAllCellsController = async (_, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, data: await getAllCellsService() });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getCellByIdController = async (req, res) => {
  try {
    const r = await getCellByIdService(req.params.cellId);
    if (!r)
      return res
        .status(404)
        .json({ success: false, message: "Cell not found" });
    return res.status(200).json({ success: true, data: r });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getCellsByBlockController = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: await getCellsByBlockService(req.params.blockId),
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const updateCellController = async (req, res) => {
  try {
    const r = await updateCellService(req.params.cellId, req.body);
    if (!r)
      return res
        .status(404)
        .json({ success: false, message: "Cell not found" });
    return res.status(200).json({ success: true, data: r });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const deleteCellController = async (req, res) => {
  try {
    const r = await deleteCellService(req.params.cellId);
    if (!r)
      return res
        .status(404)
        .json({ success: false, message: "Cell not found" });
    return res.status(200).json({ success: true, data: r });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getAvailableCellsController = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: await getAvailableCellsService(req.params.jailId),
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
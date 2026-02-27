import {
  addCriminalOrganizationService,
  getAllCriminalOrganizationsService,
  getCriminalsByOrganizationService,
  getOrganizationsByCriminalService,
  updateCriminalOrganizationService,
  deleteCriminalOrganizationService,
} from "../services/criminalOrganizationService.js";

export const addCriminalOrganizationController = async (req, res) => {
  try {
    const result = await addCriminalOrganizationService(req.body);
    if (!result)
      return res.status(400).json({
        success: false,
        message: "Failed to link criminal to organization",
      });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("Error at addCriminalOrganizationController:", error);
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const getAllCriminalOrganizationsController = async (_, res) => {
  try {
    const result = await getAllCriminalOrganizationsService();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const getCriminalsByOrganizationController = async (req, res) => {
  try {
    const result = await getCriminalsByOrganizationService(req.params.orgId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const getOrganizationsByCriminalController = async (req, res) => {
  try {
    const result = await getOrganizationsByCriminalService(
      req.params.criminalId,
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const updateCriminalOrganizationController = async (req, res) => {
  try {
    const { criminalId, orgId } = req.params;
    const result = await updateCriminalOrganizationService(
      criminalId,
      orgId,
      req.body,
    );
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const deleteCriminalOrganizationController = async (req, res) => {
  try {
    const { criminalId, orgId } = req.params;
    const result = await deleteCriminalOrganizationService(
      criminalId,
      orgId,
    );
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
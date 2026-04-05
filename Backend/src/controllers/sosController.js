import {
  acknowledgeSosByOfficerService,
  autoTriggerSosService,
  assignOfficerToSosService,
  getDistrictThanaOptionsService,
  getMySosAlertsService,
  getOfficerSosAlertsService,
  getThanaSosAlertsService,
  triggerSosService,
} from "../services/sosService.js";

export const getDistrictThanaOptionsController = async (_req, res) => {
  try {
    const data = await getDistrictThanaOptionsService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("Error at getDistrictThanaOptionsController:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const triggerSosController = async (req, res) => {
  try {
    const userId = req.id;
    const { district, thana_id: thanaId, description, image_url: imageUrl } = req.body;

    if (!district || !thanaId) {
      return res.status(400).json({
        success: false,
        message: "district and thana_id are required",
      });
    }

    const data = await triggerSosService({
      userId,
      district,
      thanaId,
      description,
      imageUrl,
    });

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.log("Error at triggerSosController:", error);
    if (
      error?.message === "User not found" ||
      error?.message === "Thana not found" ||
      error?.message === "Selected thana does not belong to selected district"
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const autoTriggerSosController = async (req, res) => {
  try {
    const userId = req.id;
    const {
      district,
      detected_address: detectedAddress,
      latitude,
      longitude,
      description,
      image_url: imageUrl,
    } = req.body;

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required as numbers",
      });
    }

    const data = await autoTriggerSosService({
      userId,
      district,
      detectedAddress,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      description,
      imageUrl,
    });

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.log("Error at autoTriggerSosController:", error);
    if (
      error?.message === "User not found" ||
      error?.message === "Unable to detect district from GPS location" ||
      String(error?.message || "").startsWith("No thana found for detected district:")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMySosAlertsController = async (req, res) => {
  try {
    const data = await getMySosAlertsService(req.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("Error at getMySosAlertsController:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getThanaSosAlertsController = async (req, res) => {
  try {
    const data = await getThanaSosAlertsService(req.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("Error at getThanaSosAlertsController:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const assignOfficerToSosController = async (req, res) => {
  try {
    const { sosId } = req.params;
    const { officer_id: officerId } = req.body;

    if (!officerId) {
      return res.status(400).json({ success: false, message: "officer_id is required" });
    }

    const data = await assignOfficerToSosService({
      sosId: Number(sosId),
      thanaId: req.id,
      officerId,
      assignedById: req.id,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "SOS alert not found or officer is not in this thana",
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("Error at assignOfficerToSosController:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getOfficerSosAlertsController = async (req, res) => {
  try {
    const data = await getOfficerSosAlertsService(req.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("Error at getOfficerSosAlertsController:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const acknowledgeSosByOfficerController = async (req, res) => {
  try {
    const { sosId } = req.params;
    const data = await acknowledgeSosByOfficerService({ sosId: Number(sosId), officerId: req.id });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "SOS alert not found or not assigned to this officer",
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("Error at acknowledgeSosByOfficerController:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

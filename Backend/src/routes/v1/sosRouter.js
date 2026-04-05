import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";
import requireRole from "../../utils/requireRole.js";
import {
  acknowledgeSosByOfficerController,
  autoTriggerSosController,
  assignOfficerToSosController,
  getDistrictThanaOptionsController,
  getMySosAlertsController,
  getOfficerSosAlertsController,
  getThanaSosAlertsController,
  triggerSosController,
} from "../../controllers/sosController.js";

const router = express.Router();

router.get("/options", isAuthenticated, getDistrictThanaOptionsController);

router.post("/trigger", isAuthenticated, requireRole("user"), triggerSosController);
router.post("/auto-trigger", isAuthenticated, requireRole("user"), autoTriggerSosController);
router.get("/my-alerts", isAuthenticated, requireRole("user"), getMySosAlertsController);

router.get("/thana-alerts", isAuthenticated, requireRole("thana"), getThanaSosAlertsController);
router.post("/:sosId/assign-officer", isAuthenticated, requireRole("thana"), assignOfficerToSosController);

router.get("/officer-alerts", isAuthenticated, requireRole("officer"), getOfficerSosAlertsController);
router.post("/:sosId/acknowledge", isAuthenticated, requireRole("officer"), acknowledgeSosByOfficerController);

export default router;

import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";
import {
  addCriminalOrganizationController,
  getAllCriminalOrganizationsController,
  getCriminalsByOrganizationController,
  getOrganizationsByCriminalController,
  updateCriminalOrganizationController,
  deleteCriminalOrganizationController,
} from "../../controllers/criminalOrganizationController.js";



const router = express.Router();



router.post("/add-link", isAuthenticated, addCriminalOrganizationController);
router.get("/get-all-links", getAllCriminalOrganizationsController);
router.get(
  "/get-criminals-by-org/:orgId",
  getCriminalsByOrganizationController,
);
router.get(
  "/get-orgs-by-criminal/:criminalId",
  getOrganizationsByCriminalController,
);
router.put(
  "/update-link/:criminalId/:orgId",
  isAuthenticated,
  updateCriminalOrganizationController,
);
router.delete(
  "/delete-link/:criminalId/:orgId",
  isAuthenticated,
  deleteCriminalOrganizationController,
);

export default router;
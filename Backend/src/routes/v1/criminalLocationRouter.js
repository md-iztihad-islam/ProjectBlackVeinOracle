import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";
import {
  addCriminalLocationController,
  getAllCriminalLocationsController,
  getLocationsByCriminalController,
  getCriminalsByLocationController,
  deleteCriminalLocationController,
} from "../../controllers/criminalLocationController.js";

const router = express.Router();



router.post(
  "/add-criminal-location",
  isAuthenticated,
  addCriminalLocationController,
);


router.get("/get-all-criminal-locations", getAllCriminalLocationsController);
router.get(
  "/get-locations-by-criminal/:criminalId",
  getLocationsByCriminalController,
);


router.get(
  "/get-criminals-by-location/:locationId",
  getCriminalsByLocationController,
);


router.delete(
  "/delete-criminal-location/:criminalLocationId",
  isAuthenticated,
  deleteCriminalLocationController,
);

export default router;
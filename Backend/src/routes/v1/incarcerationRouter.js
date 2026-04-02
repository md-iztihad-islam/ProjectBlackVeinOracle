import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";
import requireRole from "../../utils/requireRole.js";
import {
  addIncarcerationController,
  getAllIncarcerationsController,
  getIncarcerationByIdController,
  getIncarcerationsByCriminalController,
  getIncarcerationsByJailController,
  updateIncarcerationController,
  releaseIncarcerationController,
  deleteIncarcerationController,
  findAvailableCellController,
  transferCriminalController,
  getTransferHistoryController,
} from "../../controllers/incarcerationController.js";



const router = express.Router();



router.post("/add-incarceration", isAuthenticated, addIncarcerationController);
router.get("/get-incarcerations", getAllIncarcerationsController);
router.get(
  "/get-incarceration/:incarcerationId",
  getIncarcerationByIdController,
);
router.get(
  "/get-incarcerations-by-criminal/:criminalId",
  getIncarcerationsByCriminalController,
);
router.get(
  "/get-incarcerations-by-jail/:jailId",
  getIncarcerationsByJailController,
);
router.put(
  "/update-incarceration/:incarcerationId",
  isAuthenticated,
  updateIncarcerationController,
);
router.put(
  "/release-incarceration/:incarcerationId",
  isAuthenticated,
  releaseIncarcerationController,
);
router.delete(
  "/delete-incarceration/:incarcerationId",
  isAuthenticated,
  deleteIncarcerationController,
);

router.get("/find-cell/:jailId", isAuthenticated, findAvailableCellController);
router.post(
  "/transfer",
  isAuthenticated,
  requireRole("jail"),
  transferCriminalController,
);
router.get(
  "/transfers/:criminalId",
  isAuthenticated,
  requireRole("admin", "jail", "thana", "officer"),
  getTransferHistoryController,
);



export default router;
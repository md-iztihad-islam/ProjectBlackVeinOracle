import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";


import {
  addBailRecordController,
  getAllBailRecordsController,
  getBailRecordByIdController,
  getBailRecordsByCriminalController,
  getBailRecordsByArrestController,
  updateBailRecordController,
  deleteBailRecordController,
  processBailDecisionController,
} from "../../controllers/bailRecordController.js";


const router = express.Router();



router.post("/add-bail-record", isAuthenticated, addBailRecordController);
router.get("/get-bail-records", getAllBailRecordsController);
router.get("/get-bail-record/:bailId", getBailRecordByIdController);
router.get(
  "/get-bail-records-by-criminal/:criminalId",
  getBailRecordsByCriminalController,
);
router.get(
  "/get-bail-records-by-arrest/:arrestId",
  getBailRecordsByArrestController,
);
router.put(
  "/update-bail-record/:bailId",
  isAuthenticated,
  updateBailRecordController,
);
router.delete(
  "/delete-bail-record/:bailId",
  isAuthenticated,
  deleteBailRecordController,
);
router.post("/process-decision", isAuthenticated, processBailDecisionController);

export default router;
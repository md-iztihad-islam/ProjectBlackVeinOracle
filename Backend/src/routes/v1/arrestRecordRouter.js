import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";


import {
  addArrestRecordController,
  getAllArrestRecordsController,
  getArrestRecordByIdController,
  getArrestRecordsByCriminalController,
  getArrestRecordsByThanaController,
  updateArrestRecordController,
  deleteArrestRecordController,
} from "../../controllers/arrestRecordController.js";


const router = express.Router();

router.post("/add-arrest-record", isAuthenticated, addArrestRecordController);
router.get("/get-arrest-records", getAllArrestRecordsController);
router.get("/get-arrest-record/:arrestId", getArrestRecordByIdController);
router.get(
  "/get-arrest-records-by-criminal/:criminalId",
  getArrestRecordsByCriminalController,
);
router.get(
  "/get-arrest-records-by-thana/:thanaId",
  getArrestRecordsByThanaController,
);
router.put(
  "/update-arrest-record/:arrestId",
  isAuthenticated,
  updateArrestRecordController,
);
router.delete(
  "/delete-arrest-record/:arrestId",
  isAuthenticated,
  deleteArrestRecordController,
);

export default router;
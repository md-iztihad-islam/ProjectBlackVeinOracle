import express from "express";

import isAuthenticated from "../../utils/isAuthenticated.js";


import {
  addCaseFileController,
  getAllCaseFilesController,
  getCaseFileByIdController,
  getCaseFilesByThanaController,
  getCaseFilesByCriminalController,
  updateCaseFileController,
  deleteCaseFileController,
} from "../../controllers/caseFileController.js";

const router = express.Router();


router.post("/add-case-file", isAuthenticated, addCaseFileController);
router.get("/get-case-files", getAllCaseFilesController);
router.get("/get-case-file/:caseId", getCaseFileByIdController);
router.get("/get-case-files-by-thana/:thanaId", getCaseFilesByThanaController);
router.get(
  "/get-case-files-by-criminal/:criminalId",
  getCaseFilesByCriminalController,
);
router.put(
  "/update-case-file/:caseId",
  isAuthenticated,
  updateCaseFileController,
);
router.delete(
  "/delete-case-file/:caseId",
  isAuthenticated,
  deleteCaseFileController,
);

export default router;
import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";
import {
  addCriminalRelationController,
  getAllCriminalRelationsController,
  getRelationsByCriminalController,
  updateCriminalRelationController,
  deleteCriminalRelationController,
} from "../../controllers/criminalRelationController.js";



const router = express.Router();



router.post("/add-relation", isAuthenticated, addCriminalRelationController);
router.get("/get-all-relations", getAllCriminalRelationsController);
router.get("/get-relations/:criminalId", getRelationsByCriminalController);
router.put(
  "/update-relation/:relationId",
  isAuthenticated,
  updateCriminalRelationController,
);
router.delete(
  "/delete-relation/:relationId",
  isAuthenticated,
  deleteCriminalRelationController,
);



export default router;
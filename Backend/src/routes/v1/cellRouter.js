import express from "express";

import isAuthenticated from "../../utils/isAuthenticated.js";


import {
  addCellController,
  getAllCellsController,
  getCellByIdController,
  getCellsByBlockController,
  updateCellController,
  deleteCellController,
  getAvailableCellsController,
} from "../../controllers/cellController.js";

const router = express.Router();



router.post("/add-cell", isAuthenticated, addCellController);
router.get("/get-cells", getAllCellsController);
router.get("/get-cell/:cellId", getCellByIdController);
router.get("/get-cells-by-block/:blockId", getCellsByBlockController);
router.get("/get-available-cells/:jailId", getAvailableCellsController);
router.put("/update-cell/:cellId", isAuthenticated, updateCellController);
router.delete("/delete-cell/:cellId", isAuthenticated, deleteCellController);

export default router;
import express from "express";
import isAuthenticated  from "../../utils/isAuthenticated.js";
import {
    addCellBlockController,
    getAllCellBlocksController,
    getCellBlockByIdController,
    getCellBlocksByJailController,
    updateCellBlockController,
    deleteCellBlockController
} from "../../controllers/cellBlockController.js";

const router = express.Router();

router.post("/add-cell-block", isAuthenticated, addCellBlockController );
router.get("/get-all-cell-blocks",  getAllCellBlocksController);
router.get("/get-cell-block/:blockId",  getCellBlockByIdController);
router.get("/get-cell-blocks-by-jail/:jailId",  getCellBlocksByJailController);
router.put("/update-cell-block/:blockId", isAuthenticated, updateCellBlockController);
router.delete("/delete-cell-block/:blockId", isAuthenticated, deleteCellBlockController);

export default router;
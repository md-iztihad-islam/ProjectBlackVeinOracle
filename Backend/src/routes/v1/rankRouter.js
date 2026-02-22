import express from 'express';
import { addRankController, getAllRanksController, getRankByIdController, updateRankController, deleteRankController } from '../../controllers/rankController.js';
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0

const router = express.Router();

router.post('/add-rank', isAuthenticated, requireRole("admin"), addRankController);
router.get('/get-all-ranks', isAuthenticated, getAllRanksController);
router.get('/get-rank/:rankId', isAuthenticated, getRankByIdController);

// by Rayyan 2.0
router.put('/update-rank/:rankId', isAuthenticated, requireRole("admin"), updateRankController);
router.delete('/delete-rank/:rankId', isAuthenticated, requireRole("admin"), deleteRankController);

export default router;
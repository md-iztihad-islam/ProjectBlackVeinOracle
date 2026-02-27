import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0
import { addCriminalController, getCriminalByIdController, getCriminalsByThanaIdController, getCriminalFullProfileController, getCriminalTimelineController, recalculateCriminalRiskController, getAllCriminalsController, updateCriminalController, deleteCriminalController, getCriminalsByStatusController, searchCriminalsController, getWantedCriminalsController, getCriminalsByAreaController } from '../../controllers/criminalController.js'; // by Rayyan 2.0

const router = express.Router();

// by Rayyan 2.0 - public routes (no auth)
router.get('/wanted', getWantedCriminalsController);
router.get('/area/:district', getCriminalsByAreaController);

router.post('/add-criminal', isAuthenticated, requireRole("admin", "thana", "officer"), addCriminalController);
router.get('/get-criminal/:criminalid', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalByIdController);
router.get('/get-criminals-by-thana/:thanaId', isAuthenticated, requireRole("admin", "thana"), getCriminalsByThanaIdController);

// by Rayyan 2.0
router.get('/profile/:id', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalFullProfileController);
router.get('/timeline/:id', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalTimelineController);
router.put('/recalculate-risk/:id', isAuthenticated, requireRole("admin"), recalculateCriminalRiskController);
// by Rayyan 2.0
router.get('/get-criminals', isAuthenticated, requireRole("admin", "thana", "officer"), getAllCriminalsController);
router.put('/update-criminal/:criminalId', isAuthenticated, requireRole("admin", "thana"), updateCriminalController);
router.delete('/delete-criminal/:criminalId', isAuthenticated, requireRole("admin"), deleteCriminalController);
router.get('/get-criminals-by-status/:status', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalsByStatusController);
router.get('/search-criminals', searchCriminalsController);

export default router;
import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js';
import { addCriminalController, getCriminalByIdController, getCriminalsByThanaIdController, getCriminalFullProfileController, getCriminalTimelineController, getCriminalCaseHistoryController, recalculateCriminalRiskController, getAllCriminalsController, updateCriminalController, deleteCriminalController, getCriminalsByStatusController, searchCriminalsController, getWantedCriminalsController, getCriminalsByAreaController, getCriminalByNameController } from '../../controllers/criminalController.js'; // by Rayyan 2.0

const router = express.Router();

router.get('/wanted', getWantedCriminalsController);
router.get('/area/:district', getCriminalsByAreaController);

router.post('/add-criminal', isAuthenticated, requireRole("admin", "thana", "officer"), addCriminalController);
router.get('/get-criminal/:criminalid', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalByIdController);
router.get('/get-criminals-by-thana/:thanaId', isAuthenticated, requireRole("admin", "thana"), getCriminalsByThanaIdController);

router.get('/profile/:id', isAuthenticated, requireRole("admin", "thana", "officer", "user"), getCriminalFullProfileController);
router.get('/timeline/:id', isAuthenticated, requireRole("admin", "thana", "officer", "user", "jail"), getCriminalTimelineController);
router.get('/case-history/:id', isAuthenticated, requireRole("admin", "thana", "officer", "user", "jail"), getCriminalCaseHistoryController);
router.put('/recalculate-risk/:id', isAuthenticated, requireRole("admin"), recalculateCriminalRiskController);

router.get('/get-criminals', isAuthenticated, requireRole("admin", "thana", "officer"), getAllCriminalsController);
router.put('/update-criminal/:criminalId', isAuthenticated, requireRole("admin", "thana"), updateCriminalController);
router.delete('/delete-criminal/:criminalId', isAuthenticated, requireRole("admin"), deleteCriminalController);
router.get('/get-criminals-by-status/:status', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalsByStatusController);
router.get('/search-criminals', searchCriminalsController);

router.get('/get-criminal-by-name/:name', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalByNameController);

export default router;
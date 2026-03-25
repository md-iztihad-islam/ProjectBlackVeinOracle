import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js';
import { addGeneralDairyController, getGeneralDairiesByUserIdController, getGeneralDairyByIdController, updateGeneralDairyStatusController, getAllGeneralDairiesController, getGeneralDairiesByThanaController, deleteGeneralDairyController } from '../../controllers/gdReportController.js'; // by Rayyan 2.0

const router = express.Router();

router.post('/add-general-dairy', isAuthenticated, requireRole("user"), addGeneralDairyController);
router.get('/get-general-dairies-by-user', isAuthenticated, requireRole("user"), getGeneralDairiesByUserIdController);
router.get('/get-general-dairy-by-id/:dairyId', isAuthenticated, getGeneralDairyByIdController);
router.put('/update-general-dairy-status/:dairyId', isAuthenticated, requireRole("admin", "thana", "officer"), updateGeneralDairyStatusController);
router.get('/get-all-general-dairies', isAuthenticated, requireRole("admin"), getAllGeneralDairiesController);
router.get('/get-general-dairies-by-thana/:thanaId', isAuthenticated, requireRole("admin", "thana", "officer"), getGeneralDairiesByThanaController);
router.delete('/delete-general-dairy/:dairyId', isAuthenticated, requireRole("admin"), deleteGeneralDairyController);

export default router;
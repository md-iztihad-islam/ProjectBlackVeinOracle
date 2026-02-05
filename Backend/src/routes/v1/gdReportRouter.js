import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import { addGeneralDairyController, getGeneralDairiesByUserIdController, getGeneralDairyByIdController, updateGeneralDairyStatusController } from '../../controllers/gdReportController.js';

const router = express.Router();

router.post('/add-general-dairy', isAuthenticated, addGeneralDairyController);
router.get('/get-general-dairies-by-user', isAuthenticated, getGeneralDairiesByUserIdController);
router.get('/get-general-dairy-by-id/:dairyId', isAuthenticated, getGeneralDairyByIdController);
router.put('/update-general-dairy-status/:dairyId', isAuthenticated, updateGeneralDairyStatusController);

export default router;
import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import { addCriminalController, getCriminalByIdController } from '../../controllers/criminalController.js';

const router = express.Router();

router.post('/add-criminal', isAuthenticated, addCriminalController);
router.get('/get-criminal/:criminalid', isAuthenticated, getCriminalByIdController);

export default router;
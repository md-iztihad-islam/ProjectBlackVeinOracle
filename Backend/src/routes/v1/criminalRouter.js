import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import { addCriminalController, getCriminalByIdController, getCriminalsByThanaIdController } from '../../controllers/criminalController.js';

const router = express.Router();

router.post('/add-criminal', isAuthenticated, addCriminalController);
router.get('/get-criminal/:criminalid', isAuthenticated, getCriminalByIdController);
router.get('/get-criminals-by-thana/:thanaId', isAuthenticated, getCriminalsByThanaIdController);

export default router;
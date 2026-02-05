import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import { addCriminalController } from '../../controllers/criminalController.js';

const router = express.Router();

router.post('/add-criminal', isAuthenticated, addCriminalController);

export default router;
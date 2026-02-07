import express from 'express';
import { addLocationController } from '../../controllers/locationController.js';
import isAuthenticated from '../../utils/isAuthenticated.js';

const router = express.Router();

router.post('/add-location', isAuthenticated, addLocationController);

export default router;
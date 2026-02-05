import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import { addOrganizationController } from '../../controllers/organizationController.js';

const router = express.Router();

router.post('/add-organization', isAuthenticated, addOrganizationController);

export default router;
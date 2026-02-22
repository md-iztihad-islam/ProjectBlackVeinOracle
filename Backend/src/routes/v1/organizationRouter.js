import express from 'express';
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0
import { addOrganizationController, getAllOrganizationsController, getOrganizationByIdController, updateOrganizationController, deleteOrganizationController, searchOrganizationsController } from '../../controllers/organizationController.js';

const router = express.Router();

router.post('/add-organization', isAuthenticated, requireRole("admin", "thana", "officer"), addOrganizationController);
router.get('/get-all-organizations', isAuthenticated, getAllOrganizationsController);
router.get('/get-organization/:orgId', isAuthenticated, getOrganizationByIdController);

// by Rayyan 2.0
router.put('/update-organization/:orgId', isAuthenticated, requireRole("admin"), updateOrganizationController);
router.delete('/delete-organization/:orgId', isAuthenticated, requireRole("admin"), deleteOrganizationController);
router.get('/search-organizations', isAuthenticated, searchOrganizationsController);

export default router;
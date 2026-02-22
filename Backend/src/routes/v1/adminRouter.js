import express from 'express';
import { addAdminController, signinAdminController, signoutAdminController, getAllAdminsController, getAdminByIdController, updateAdminController, deleteAdminController } from '../../controllers/adminController.js';
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0

const router = express.Router();

router.post('/add-admin', addAdminController);
router.post('/signin-admin', signinAdminController);
router.post('/signout-admin', isAuthenticated, signoutAdminController);

// by Rayyan 2.0
router.get('/get-admins', isAuthenticated, requireRole("admin"), getAllAdminsController);
router.get('/get-admin/:adminId', isAuthenticated, requireRole("admin"), getAdminByIdController);
router.put('/update-admin/:adminId', isAuthenticated, requireRole("admin"), updateAdminController);
router.delete('/delete-admin/:adminId', isAuthenticated, requireRole("admin"), deleteAdminController);

export default router;
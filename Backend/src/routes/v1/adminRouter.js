import express from 'express';
import { addAdminController, signinAdminController, signoutAdminController } from '../../controllers/adminController.js';

const router = express.Router();

router.post('/add-admin', addAdminController);
router.post('/signin-admin', signinAdminController);
router.post('/signout-admin', signoutAdminController);

export default router;
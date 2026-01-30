import express from 'express';
import { addOfficerController, signinOfficerController, signoutOfficerController } from '../../controllers/officerController.js';
import isAuthenticated from '../../utils/isAuthenticated.js';

const router = express.Router();

router.post('/add-officer', isAuthenticated, addOfficerController);
router.post('/signin-officer', signinOfficerController);
router.post('/signout-officer', signoutOfficerController);

export default router;
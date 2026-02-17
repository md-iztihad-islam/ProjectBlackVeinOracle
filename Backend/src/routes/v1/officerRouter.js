import express from 'express';
import { addOfficerController, getAllOfficersController, getOfficersByThanaIdController, signinOfficerController, signoutOfficerController } from '../../controllers/officerController.js';
import isAuthenticated from '../../utils/isAuthenticated.js';

const router = express.Router();

router.post('/add-officer', isAuthenticated, addOfficerController);
router.post('/signin-officer', signinOfficerController);
router.post('/signout-officer', signoutOfficerController);
router.get('/get-officers', getAllOfficersController);
router.get('/get-officers-by-thana/:thana_id', isAuthenticated, getOfficersByThanaIdController);

export default router;
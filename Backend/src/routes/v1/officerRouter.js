import express from 'express';
import { addOfficerController, getAllOfficersController, getOfficersByThanaIdController, signinOfficerController, signoutOfficerController, getOfficersByRankController, updateOfficerController, deleteOfficerController, searchOfficersController } from '../../controllers/officerController.js'; // by Rayyan 2.0
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0

const router = express.Router();

router.post('/add-officer', isAuthenticated, requireRole("admin", "thana"), addOfficerController);
router.post('/signin-officer', signinOfficerController);
router.post('/signout-officer', isAuthenticated, signoutOfficerController);
router.get('/get-officers', isAuthenticated, requireRole("admin", "thana"), getAllOfficersController);
router.get('/get-officers-by-thana/:thana_id', isAuthenticated, requireRole("admin", "thana"), getOfficersByThanaIdController);
// by Rayyan 2.0
router.get('/get-officers-by-rank/:rankId', isAuthenticated, requireRole("admin", "thana"), getOfficersByRankController);
router.put('/update-officer/:officerId', isAuthenticated, requireRole("admin", "thana"), updateOfficerController);
router.delete('/delete-officer/:officerId', isAuthenticated, requireRole("admin"), deleteOfficerController);
router.get('/search-officers', isAuthenticated, requireRole("admin", "thana"), searchOfficersController);

export default router;
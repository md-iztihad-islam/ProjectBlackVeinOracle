import express from 'express';
import { addHeadOfficerToThanaController, addThanaContoller, getAllThanasController, getThanasByDistrictController, signinThanaController, signoutThanaController, getThanaByIdController, updateThanaController, deleteThanaController, getThanaByNameController } from '../../controllers/thanaControler.js'; // by Rayyan 2.0
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0

const router = express.Router();

router.post('/add-thana', isAuthenticated, requireRole("admin"), addThanaContoller);
router.post('/signin-thana', signinThanaController);
router.post('/signout-thana', isAuthenticated, signoutThanaController);
router.post('/add-head-officer', isAuthenticated, requireRole("admin"), addHeadOfficerToThanaController);
router.get('/get-thanas-by-district/:district', isAuthenticated, requireRole("admin", "thana", "user"), getThanasByDistrictController); // by Rayyan 2.0 — added "user" role so AddGDReport page works
router.get('/get-all-thanas', isAuthenticated, requireRole("admin", "user", "thana", "officer", "jail"), getAllThanasController); // by Rayyan 2.0 — added flexible role access for dashboard population
router.get('/get-thana-by-id/:thanaId', isAuthenticated, requireRole("admin", "thana"), getThanaByIdController);
router.put('/update-thana/:thanaId', isAuthenticated, requireRole("admin"), updateThanaController);
router.delete('/delete-thana/:thanaId', isAuthenticated, requireRole("admin"), deleteThanaController);
router.get('/get-thana-by-name/:name', isAuthenticated, requireRole("admin", "thana", "user", "officer"), getThanaByNameController);
export default router;
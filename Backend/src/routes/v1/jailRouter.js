import express from 'express';
import { addJailController, getAllJailsController, getJailByDistrictController, getJailByIdController, getJailByNameController, getJailByZoneController, signinJailController, signoutJailController, updateJailController, deleteJailController } from '../../controllers/jailController.js';
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0

const router = express.Router();

router.post('/add-jail', isAuthenticated, requireRole("admin"), addJailController);
router.post('/signin-jail', signinJailController);
router.post('/signout-jail', isAuthenticated, signoutJailController);
router.get('/get-jails', isAuthenticated, requireRole("admin", "jail"), getAllJailsController);
router.get('/get-jail/:jailId', isAuthenticated, requireRole("admin", "jail"), getJailByIdController);
router.get('/get-jail-by-name/:jailName', isAuthenticated, requireRole("admin", "jail"), getJailByNameController);
router.get('/get-jail-by-zone/:zone', isAuthenticated, requireRole("admin", "jail"), getJailByZoneController);
router.get('/get-jail-by-district/:district', isAuthenticated, requireRole("admin", "jail"), getJailByDistrictController);
router.put('/update-jail/:jailId', isAuthenticated, requireRole("admin"), updateJailController);
router.delete('/delete-jail/:jailId', isAuthenticated, requireRole("admin"), deleteJailController);

export default router;
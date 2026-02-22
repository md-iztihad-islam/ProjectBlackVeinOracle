import express from 'express';
import { addLocationController, getAllLocationsController, getLocationByIdController, updateLocationController, deleteLocationController, getLocationsByDistrictController } from '../../controllers/locationController.js';
import isAuthenticated from '../../utils/isAuthenticated.js';
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0

const router = express.Router();

router.post('/add-location', isAuthenticated, requireRole("admin", "thana", "officer"), addLocationController);
router.get('/get-all-locations', isAuthenticated, getAllLocationsController);
router.get('/get-location/:locationId', isAuthenticated, getLocationByIdController);

// by Rayyan 2.0
router.put('/update-location/:locationId', isAuthenticated, requireRole("admin", "thana"), updateLocationController);
router.delete('/delete-location/:locationId', isAuthenticated, requireRole("admin"), deleteLocationController);
router.get('/get-locations-by-district/:district', isAuthenticated, getLocationsByDistrictController);

export default router;
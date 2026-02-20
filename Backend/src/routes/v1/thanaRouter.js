import express from 'express';
import { addHeadOfficerToThanaController, addThanaContoller, getThanasByDistrictController, signinThanaController, signoutThanaController } from '../../controllers/thanaControler.js';
import isAuthenticated from '../../utils/isAuthenticated.js';

const router = express.Router();

router.post('/add-thana', isAuthenticated, addThanaContoller);
router.post('/signin-thana', signinThanaController);
router.post('/signout-thana', signoutThanaController);
router.post('/add-head-officer', isAuthenticated, addHeadOfficerToThanaController);
router.get('/get-thanas-by-district/:district', getThanasByDistrictController);

export default router;
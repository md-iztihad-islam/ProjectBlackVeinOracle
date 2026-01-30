import express from 'express';
import { addThanaContoller, signinThanaController, signoutThanaController } from '../../controllers/thanaControler.js';
import isAuthenticated from '../../utils/isAuthenticated.js';

const router = express.Router();

router.post('/add-thana', isAuthenticated, addThanaContoller);
router.post('/signin-thana', signinThanaController);
router.post('/signout-thana', signoutThanaController);

export default router;
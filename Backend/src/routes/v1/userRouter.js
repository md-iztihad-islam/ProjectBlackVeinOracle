import express from 'express';
import { addUserController, signinUserController, signoutUserController } from '../../controllers/userController.js';

const router = express.Router();

router.post('/add-user', addUserController);
router.post('/signin-user', signinUserController);
router.post('/signout-user', signoutUserController);

export default router;
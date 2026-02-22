import express from 'express';
import { addUserController, getUserByIdController, signinUserController, signoutUserController, getAllUsersController, updateUserController, deleteUserController } from '../../controllers/userController.js'; // by Rayyan 2.0
import isAuthenticated from '../../utils/isAuthenticated.js'; // by Rayyan 2.0
import requireRole from '../../utils/requireRole.js'; // by Rayyan 2.0

const router = express.Router();

router.post('/add-user', addUserController);
router.post('/signin-user', signinUserController);
router.post('/signout-user', isAuthenticated, signoutUserController);
router.get('/get-user/:userId', isAuthenticated, getUserByIdController);
// by Rayyan 2.0
router.get('/get-users', isAuthenticated, requireRole("admin"), getAllUsersController);
router.put('/update-user/:userId', isAuthenticated, updateUserController);
router.delete('/delete-user/:userId', isAuthenticated, requireRole("admin"), deleteUserController);

export default router;
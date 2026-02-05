import express from 'express';
import { addJailController, getAllJailsController, getJailByIdController } from '../../controllers/jailController.js';

const router = express.Router();

router.post('/add-jail', addJailController);
router.get('/get-jails', getAllJailsController);
router.get('/get-jail/:jailId', getJailByIdController);

export default router;
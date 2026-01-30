import express from 'express';
import { addJailController } from '../../controllers/jailController.js';

const router = express.Router();

router.post('/add-jail', addJailController);

export default router;
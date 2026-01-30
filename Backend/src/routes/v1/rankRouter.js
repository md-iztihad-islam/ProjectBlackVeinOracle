import express from 'express';
import { addReankController } from '../../controllers/rankController.js';

const router = express.Router();

router.post('/add-rank', addReankController);

export default router;
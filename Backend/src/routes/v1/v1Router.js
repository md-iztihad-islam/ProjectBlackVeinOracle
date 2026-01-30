import express from 'express';
import jailRouter from './jailRouter.js';
import rankRouter from './rankRouter.js';
import officerRouter from './officerRouter.js';
import thanaRouter from './thanaRouter.js';
import adminRouter from './adminRouter.js';

const router = express.Router();

router.use('/jail', jailRouter);
router.use('/rank', rankRouter);
router.use('/officer', officerRouter);
router.use('/thana', thanaRouter);
router.use('/admin', adminRouter);

export default router;
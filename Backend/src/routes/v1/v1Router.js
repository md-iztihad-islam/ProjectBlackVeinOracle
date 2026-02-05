import express from 'express';
import jailRouter from './jailRouter.js';
import rankRouter from './rankRouter.js';
import officerRouter from './officerRouter.js';
import thanaRouter from './thanaRouter.js';
import adminRouter from './adminRouter.js';
import userRouter from './userRouter.js';
import gdReportRouter from './gdReportRouter.js';
import criminalRouter from './criminalRouter.js';
import organizationRouter from './organizationRouter.js';

const router = express.Router();

router.use('/jail', jailRouter);
router.use('/rank', rankRouter);
router.use('/officer', officerRouter);
router.use('/thana', thanaRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/gd-report', gdReportRouter);
router.use('/criminal', criminalRouter);
router.use('/organization', organizationRouter);

export default router;
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
import locationRouter from './locationRouter.js';
import cellBlockRouter from "./cellBlockRouter.js";
import cellRouter from "./cellRouter.js";
import caseFileRouter from "./caseFileRouter.js";
import arrestRecordRouter from "./arrestRecordRouter.js";
import incarcerationRouter from "./incarcerationRouter.js";
import bailRecordRouter from "./bailRecordRouter.js";
import criminalOrganizationRouter from "./criminalOrganizationRouter.js";
import criminalRelationRouter from "./criminalRelationRouter.js";
// import criminalLocationRouter from "./criminalLocationRouter.js";
import analyticsRouter from "./analyticsRouter.js";
import notificationRouter from "./notificationRouter.js";

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
router.use('/location', locationRouter);
router.use("/cell-block", cellBlockRouter);
router.use("/cell", cellRouter);
router.use("/case-file", caseFileRouter);
router.use("/arrest-record", arrestRecordRouter);
router.use("/incarceration", incarcerationRouter);
router.use("/bail-record", bailRecordRouter);
router.use("/criminal-organization", criminalOrganizationRouter);
router.use("/criminal-relation", criminalRelationRouter);
// router.use("/criminal-location", criminalLocationRouter);
router.use("/analytics", analyticsRouter);
router.use("/notification", notificationRouter);


export default router;
// by Rayyan 2.0

import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";
import {
    getMyNotificationsController,
    getUnreadCountController,
    markNotificationReadController,
    markAllReadController,
} from "../../controllers/notificationController.js";

const router = express.Router();

router.get("/my-notifications", isAuthenticated, getMyNotificationsController);
router.get("/unread-count", isAuthenticated, getUnreadCountController);
router.put("/read/:id", isAuthenticated, markNotificationReadController);
router.put("/read-all", isAuthenticated, markAllReadController);

export default router;

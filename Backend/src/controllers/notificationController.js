// by Rayyan 2.0

import {
    getNotificationsByRoleService,
    getUnreadCountService,
    markNotificationReadService,
    markAllReadService,
} from "../services/notificationService.js";



const getUserRole = (id) => {
    if (!id) return "unknown";
    if (id.startsWith("ADM")) return "admin";
    if (id.startsWith("THN")) return "thana";
    if (id.startsWith("OFC")) return "officer";
    if (id.startsWith("JAL")) return "jail"; 
    if (id.startsWith("USR")) return "user";
    return "unknown";
};



export const getMyNotificationsController = async (req, res) => {
    try {
        const role = getUserRole(req.id);
        const targetId = req.id;
        const data = await getNotificationsByRoleService(role, targetId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getMyNotificationsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getUnreadCountController = async (req, res) => {
    try {
        const data = await getUnreadCountService(getUserRole(req.id), req.id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getUnreadCountController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const markNotificationReadController = async (req, res) => {
    try {
        const data = await markNotificationReadService(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Notification not found" });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at markNotificationReadController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const markAllReadController = async (req, res) => {
    try {
        const data = await markAllReadService(getUserRole(req.id), req.id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at markAllReadController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

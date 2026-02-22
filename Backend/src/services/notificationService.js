// by Rayyan 2.0

import {
    getNotificationsByRoleRepository,
    getUnreadCountRepository,
    markNotificationReadRepository,
    markAllReadRepository,
} from "../repositories/notificationRepository.js";


export const getNotificationsByRoleService = async (role, targetId) => {
    try {
        return await getNotificationsByRoleRepository(role, targetId);
    } catch (error) {
        console.log("Error at getNotificationsByRoleService:", error);
        throw error;
    }
};

export const getUnreadCountService = async (role, targetId) => {
    try {
        return await getUnreadCountRepository(role, targetId);
    } catch (error) {
        console.log("Error at getUnreadCountService:", error);
        throw error;
    }
};

export const markNotificationReadService = async (notificationId) => {
    try {
        return await markNotificationReadRepository(notificationId);
    } catch (error) {
        console.log("Error at markNotificationReadService:", error);
        throw error;
    }
};

export const markAllReadService = async (role, targetId) => {
    try {
        return await markAllReadRepository(role, targetId);
    } catch (error) {
        console.log("Error at markAllReadService:", error);
        throw error;
    }
};

// by Rayyan 2.0

import pool from "../config/dbConnection.js";



export const getNotificationsByRoleRepository = async (role, targetId = null) => {
    try {
        const query = `
            SELECT * FROM notification
            WHERE target_role = $1
              AND (target_id IS NULL OR target_id = $2)
            ORDER BY created_at DESC
            LIMIT 50
        `;
        const result = await pool.query(query, [role, targetId]);
        return result.rows;
    } catch (error) {
        console.log("Error at getNotificationsByRoleRepository:", error);
        throw error;
    }
};


export const getUnreadCountRepository = async (role, targetId = null) => {
    try {
        const query = `
            SELECT COUNT(*) AS unread_count FROM notification
            WHERE target_role = $1
              AND (target_id IS NULL OR target_id = $2)
              AND is_read = FALSE
        `;
        const result = await pool.query(query, [role, targetId]);
        return result.rows[0];
    } catch (error) {
        console.log("Error at getUnreadCountRepository:", error);
        throw error;
    }
};



export const markNotificationReadRepository = async (notificationId) => {
    try {
        const query = `UPDATE notification SET is_read = TRUE WHERE notification_id = $1 RETURNING *`;
        const result = await pool.query(query, [notificationId]);
        return result.rows[0];
    } catch (error) {
        console.log("Error at markNotificationReadRepository:", error);
        throw error;
    }
};


export const markAllReadRepository = async (role, targetId = null) => {
    try {
        const query = `
            UPDATE notification SET is_read = TRUE
            WHERE target_role = $1
              AND (target_id IS NULL OR target_id = $2)
              AND is_read = FALSE
        `;
        await pool.query(query, [role, targetId]);
        return { success: true };
    } catch (error) {
        console.log("Error at markAllReadRepository:", error);
        throw error;
    }
};

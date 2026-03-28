import axiosInstance from "@/helpers/axiosInstance";

export async function getMyNotifications() {
  try {
    const res = await axiosInstance.get("/notification/my-notifications");
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getUnreadNotificationCount() {
  try {
    const res = await axiosInstance.get("/notification/unread-count");
    return res.data;
  } catch {
    return { success: false, data: { unread_count: 0 } };
  }
}

export async function markNotificationRead(id) {
  try {
    const res = await axiosInstance.put(`/notification/read/${id}`);
    return res.data;
  } catch {
    return { success: false, message: "Failed" };
  }
}

export async function markAllNotificationsRead() {
  try {
    const res = await axiosInstance.put("/notification/read-all");
    return res.data;
  } catch {
    return { success: false, message: "Failed" };
  }
}

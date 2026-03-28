import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/Notification/notificationApi";

function NotificationCenter() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["myNotifications"],
    queryFn: getMyNotifications,
  });
  const { data: unreadData } = useQuery({
    queryKey: ["myNotificationUnreadCount"],
    queryFn: getUnreadNotificationCount,
  });

  const notifications = data?.data || [];
  const unreadCount = Number(unreadData?.data?.unread_count || 0);

  const readOneMut = useMutation({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["myNotificationUnreadCount"] });
    },
  });

  const readAllMut = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["myNotificationUnreadCount"] });
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Notification Center</h1>
                <p className="text-sm text-slate-400 mt-1">Operational alerts</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => readAllMut.mutate()}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
            >
              Mark all read
            </button>
            <button
              onClick={() => navigate("/thana/dashboard")}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
          {isLoading ? (
            <p className="p-6 text-slate-500">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="p-6 text-slate-500">No notifications found.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {notifications.map((n) => (
                <li key={n.notification_id} className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-100">{n.title}</p>
                    <p className="text-sm text-slate-400 mt-1 whitespace-pre-line">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${n.is_read ? "bg-slate-700 text-slate-300" : "bg-amber-500/20 text-amber-300"}`}
                    >
                      {n.is_read ? "Read" : "Unread"}
                    </span>
                    {!n.is_read && (
                      <button
                        onClick={() => readOneMut.mutate(n.notification_id)}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCenter;

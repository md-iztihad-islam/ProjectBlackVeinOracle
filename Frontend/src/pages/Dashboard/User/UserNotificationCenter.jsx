import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/Notification/notificationApi";
import getOfficerByIdApi from "@/services/Officer/getOfficerByIdApi";
import { useState } from "react";

const pickFirst = (...values) => values.find((v) => typeof v === "string" && v.trim() !== "") || null;

const parseNotificationMessageMeta = (message) => {
  const text = String(message || "");

  const criminalIdMatch =
    text.match(/Criminal\s*ID\s*:\s*([^\n]+)/i) ||
    text.match(/Criminal\s*:\s*.*\(([^)]+)\)/i) ||
    text.match(/\b(CRM-[A-Za-z0-9-]+|CR-[A-Za-z0-9-]+|CID-[A-Za-z0-9-]+)\b/i);

  const locationMatch =
    text.match(/Last\s*Known\s*Location\s*:\s*([^\n]+)/i) ||
    text.match(/Last\s*known\s*:\s*([^\n.]+)/i) ||
    text.match(/Location\s*:\s*([^\n]+)/i);

  const escapedFromMatch = text.match(/Escaped\s*From\s*:\s*([^\n]+)/i);
  const officerIdMatch =
    text.match(/Assigned\s*Officer\s*ID\s*:\s*([^\s\n.]+)/i) ||
    text.match(/Officer\s*ID\s*:\s*([^\s\n.]+)/i);

  return {
    criminalId: criminalIdMatch?.[1]?.trim() || null,
    location: locationMatch?.[1]?.trim() || null,
    escapedFrom: escapedFromMatch?.[1]?.trim() || null,
    officerId: officerIdMatch?.[1]?.trim() || null,
  };
};

const getNotificationMeta = (n) => {
  const parsed = parseNotificationMessageMeta(n?.message);

  return {
    criminalId: pickFirst(n?.criminal_id, n?.criminalId, parsed.criminalId),
    location: pickFirst(
      n?.last_known_location,
      n?.lastKnownLocation,
      n?.location_name,
      n?.location,
      parsed.location
    ),
    escapedFrom: pickFirst(n?.escape_from, n?.escaped_from, n?.escapedFrom, parsed.escapedFrom),
    officerId: pickFirst(n?.officer_id, n?.officerId, parsed.officerId),
  };
};

function UserNotificationCenter() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [officerProfile, setOfficerProfile] = useState(null);
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [isOfficerLoading, setIsOfficerLoading] = useState(false);

  const handleBack = () => {
    if (location.state?.modal) {
      navigate(-1);
      return;
    }
    navigate("/user/dashboard");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userNotifications"],
    queryFn: getMyNotifications,
  });
  const { data: unreadData } = useQuery({
    queryKey: ["userNotificationUnreadCount"],
    queryFn: getUnreadNotificationCount,
  });

  const notifications = data?.data || [];
  const unreadCount = Number(unreadData?.data?.unread_count || 0);

  const readOneMut = useMutation({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["userNotificationUnreadCount"] });
    },
  });

  const readAllMut = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["userNotificationUnreadCount"] });
    },
  });

  const handleOpenOfficerProfile = async (officerId) => {
    if (!officerId) return;
    setIsOfficerLoading(true);
    setIsOfficerModalOpen(true);
    try {
      const res = await getOfficerByIdApi(officerId);
      if (res?.success) {
        setOfficerProfile(res.data || null);
      } else {
        setOfficerProfile(null);
      }
    } catch {
      setOfficerProfile(null);
    } finally {
      setIsOfficerLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-slate-200">
      <div className="bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
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
              disabled={readAllMut.isPending || unreadCount === 0}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm disabled:opacity-50"
            >
              Mark all read
            </button>
            <button
              onClick={handleBack}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
            >
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
            <p className="text-xs uppercase text-slate-500">Total Alerts</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{notifications.length}</p>
          </div>
          <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
            <p className="text-xs uppercase text-slate-500">Unread</p>
            <p className="text-2xl font-bold text-amber-300 mt-1">{unreadCount}</p>
          </div>
          <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
            <p className="text-xs uppercase text-slate-500">Read</p>
            <p className="text-2xl font-bold text-emerald-300 mt-1">
              {Math.max(notifications.length - unreadCount, 0)}
            </p>
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
                <li
                  key={n.notification_id}
                  className="p-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-100">{n.title}</p>
                    {(() => {
                      const meta = getNotificationMeta(n);
                      if (!meta.criminalId && !meta.location && !meta.escapedFrom && !meta.officerId) return null;

                      return (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {meta.criminalId && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/20">
                              Criminal ID: {meta.criminalId}
                            </span>
                          )}
                          {meta.location && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-400/20 max-w-full truncate">
                              Last Location: {meta.location}
                            </span>
                          )}
                          {meta.escapedFrom && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-400/20 max-w-full truncate">
                              Escaped From: {meta.escapedFrom}
                            </span>
                          )}
                          {meta.officerId && (
                            <button
                              onClick={() => handleOpenOfficerProfile(meta.officerId)}
                              className="text-[11px] px-2 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/20 hover:bg-blue-500/25 transition-colors"
                            >
                              View Assigned Officer: {meta.officerId}
                            </button>
                          )}
                        </div>
                      );
                    })()}
                    <p className="text-sm text-slate-400 mt-1 whitespace-pre-line">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        n.is_read
                          ? "bg-slate-700 text-slate-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
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

      {isOfficerModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-gray-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-100">Assigned Officer Profile</h2>
              <button
                onClick={() => {
                  setIsOfficerModalOpen(false);
                  setOfficerProfile(null);
                }}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Close
              </button>
            </div>

            {isOfficerLoading ? (
              <p className="text-slate-400 text-sm">Loading officer details...</p>
            ) : !officerProfile ? (
              <p className="text-rose-300 text-sm">Officer details could not be loaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase text-slate-500">Officer ID</p>
                  <p className="text-sm text-slate-200 font-mono">{officerProfile.officer_id || "—"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase text-slate-500">Name</p>
                  <p className="text-sm text-slate-200">{officerProfile.full_name || "—"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase text-slate-500">Badge No</p>
                  <p className="text-sm text-slate-200">{officerProfile.badge_no || "—"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase text-slate-500">Rank</p>
                  <p className="text-sm text-slate-200">{officerProfile.rank_name || officerProfile.rank_code || "—"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase text-slate-500">Phone</p>
                  <p className="text-sm text-slate-200">{officerProfile.phone || "—"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase text-slate-500">Email</p>
                  <p className="text-sm text-slate-200 break-all">{officerProfile.email || "—"}</p>
                </div>
                <div className="sm:col-span-2 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase text-slate-500">Thana</p>
                  <p className="text-sm text-slate-200">
                    {officerProfile?.thana?.thana_name || officerProfile?.thana_id || "—"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserNotificationCenter;

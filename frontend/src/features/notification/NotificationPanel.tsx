"use client";

import { useUIStore } from "@/store/useUIStore";
import { useNotifications, useMarkNotificationsRead } from "./hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef } from "react";

const formatRelativeTime = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

export default function NotificationPanel() {
  const { isNotificationOpen, toggleNotification } = useUIStore();
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationsRead();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside on desktop
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        toggleNotification();
      }
    };
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen, toggleNotification]);

  useEffect(() => {
    if (isNotificationOpen) {
      markAsRead();
    }
  }, [isNotificationOpen, markAsRead]);

  return (
    <AnimatePresence>
      {isNotificationOpen && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 sm:left-20 lg:left-64 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-black border-r border-gray-300 dark:border-zinc-800 shadow-xl z-40 overflow-y-auto"
          ref={panelRef}
        >
          <div className="p-4 pt-8">
            <h2 className="text-2xl font-bold mb-6 px-2">Notifications</h2>
            
            {isLoading ? (
              <div className="space-y-4 px-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold px-2 mb-4">New</h3>
                  <div className="space-y-1">
                    {notifications.filter(n => !n.isRead).length > 0 ? (
                      notifications.filter(n => !n.isRead).map((notif) => (
                        <NotificationRow key={notif.id} notification={notif} />
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm px-2">No new notifications</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold px-2 mb-4">Earlier</h3>
                  <div className="space-y-1">
                    {notifications.filter(n => n.isRead).map((notif) => (
                      <NotificationRow key={notif.id} notification={notif} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center mb-4">
                  <HeartIcon />
                </div>
                <h3 className="text-lg font-semibold">Activity On Your Posts</h3>
                <p className="text-gray-500">When someone likes or comments on one of your posts, you'll see it here.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NotificationRow({ notification }: { notification: any }) {
  return (
    <div className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
      <Avatar className="w-11 h-11 border border-gray-200 dark:border-zinc-800">
        <AvatarImage src={notification.actor.profilePicture} alt={notification.actor.username} />
        <AvatarFallback>{notification.actor.username.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-sm">
        <span className="font-semibold mr-1">{notification.actor.username}</span>
        <span>{notification.text}</span>
        <span className="text-gray-500 ml-1">{formatRelativeTime(notification.createdAt)}</span>
      </div>

      {notification.type === 'follow' ? (
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-lg text-sm transition-colors">
          Follow
        </button>
      ) : notification.targetImage ? (
        <img 
          src={notification.targetImage} 
          alt="Post thumbnail" 
          className="w-11 h-11 object-cover rounded"
        />
      ) : null}
      
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-blue-500 ml-2 shrink-0" />
      )}
    </div>
  );
}

function HeartIcon() {
  return (
    <svg aria-label="Activity" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
    </svg>
  );
}

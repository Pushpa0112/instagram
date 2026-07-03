import { AppNotification, MOCK_NOTIFICATIONS } from "./mockData";

// TODO: Replace with real backend endpoint
export const getNotifications = async (): Promise<AppNotification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_NOTIFICATIONS);
    }, 800); // simulate network delay
  });
};

// TODO: Replace with real backend endpoint
export const markNotificationsAsRead = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

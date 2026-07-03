import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationsAsRead } from "./service";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      // Optimistically update notifications to be read
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;
        return old.map((n: any) => ({ ...n, isRead: true }));
      });
    },
  });
};

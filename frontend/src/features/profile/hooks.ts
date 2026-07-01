import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axios";
import { User } from "@/types/api";

interface SuggestedUsersResponse {
  success: boolean;
  users: User[];
}

export const useSuggestedUsers = () => {
  return useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get<SuggestedUsersResponse>("/user/suggested");
      return response.data.users || []; // Extract the users array
    },
  });
};

interface FollowResponse {
  success: boolean;
  message: string;
}

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.post<FollowResponse>(`/user/followorunfollow/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate both suggested users and user's own profile to update the following count
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUserProfile"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to follow/unfollow user");
    },
  });
};

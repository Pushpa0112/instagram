import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axios";
import { User, Post } from "@/types/api";

interface SuggestedUsersResponse {
  success: boolean;
  users: User[];
}

export const useSuggestedUsers = () => {
  return useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get<SuggestedUsersResponse>("/user/suggested");
      return response.data.users || []; 
    },
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const response = await axiosInstance.get<{ success: boolean; user: User }>(`/user/${userId}/profile`);
      return response.data.user;
    },
    enabled: !!userId,
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post<{ success: boolean; user: User; message: string }>(
        "/user/profile/edit", 
        formData, 
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["userProfile", data.user._id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(`/user/followorunfollow/${userId}`);
      return response.data;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["userProfile", userId] });
      await queryClient.cancelQueries({ queryKey: ["suggestedUsers"] });
      
      const previousProfile = queryClient.getQueryData(["userProfile", userId]);
      const previousSuggested = queryClient.getQueryData(["suggestedUsers"]);
      
      return { previousProfile, previousSuggested };
    },
    onError: (error: any, userId, context) => {
      if (context?.previousProfile) queryClient.setQueryData(["userProfile", userId], context.previousProfile);
      if (context?.previousSuggested) queryClient.setQueryData(["suggestedUsers"], context.previousSuggested);
      toast.error(error.response?.data?.message || "Failed to follow/unfollow user");
    },
    onSuccess: (data, userId) => {
      // Not strictly optimistic without cache manipulation, but we invalidate reliably here to keep it simple and robust.
      // True optimistic updates for arrays of relations is complex and often error-prone without the auth user ID.
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUserProfile"] }); // custom key for own profile if needed
    },
  });
};

export function useMyPosts() {
  return useQuery({
    queryKey: ["myPosts"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/post/userpost/all");
      return (data.posts || []) as Post[];
    },
  });
}

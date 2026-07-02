import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import { Message } from "@/types/api";
import { toast } from "sonner";

export const useMessages = (userId: string | null) => {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: async () => {
      const response = await axiosInstance.get<{ success: boolean; messages: Message[] }>(`/message/all/${userId}`);
      return response.data.messages || [];
    },
    enabled: !!userId,
  });
};

export const useSendMessage = (receiverId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (textMessage: string) => {
      const response = await axiosInstance.post<{ success: boolean; newMessage: Message }>(
        `/message/send/${receiverId}`,
        { textMessage }
      );
      // Backend automatically emits 'newMessage' over socket.io on success,
      // so we don't need to manually emit it here.
      return response.data;
    },
    onMutate: async (textMessage) => {
      if (!receiverId) return;
      await queryClient.cancelQueries({ queryKey: ["messages", receiverId] });
      
      const previousMessages = queryClient.getQueryData(["messages", receiverId]);
      
      queryClient.setQueryData(["messages", receiverId], (old: Message[] = []) => [
        ...old,
        {
          _id: Date.now().toString(),
          senderId: "me", // this gets overwritten on actual network success
          receiverId,
          message: textMessage,
        }
      ]);
      
      return { previousMessages };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousMessages && receiverId) {
        queryClient.setQueryData(["messages", receiverId], context.previousMessages);
      }
      toast.error(err.response?.data?.message || "Failed to send message");
    },
    onSettled: (data, error, variables, context) => {
      if (receiverId) {
        queryClient.invalidateQueries({ queryKey: ["messages", receiverId] });
      }
    }
  });
};

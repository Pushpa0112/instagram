import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/api/axios';
import { Post, Comment } from '@/types/api';

export function useLikeToggle(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isLikedByMe: boolean) => {
      const endpoint = isLikedByMe ? `/post/${postId}/dislike` : `/post/${postId}/like`;
      await axiosInstance.get(endpoint);
    },
    onMutate: async (isLikedByMe) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      const previousFeed = queryClient.getQueryData(['feed']);

      // Optimistically update the feed
      queryClient.setQueryData(['feed'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: Post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLikedByMe: !isLikedByMe,
                  likeCount: isLikedByMe ? post.likeCount - 1 : post.likeCount + 1,
                };
              }
              return post;
            }),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
  });
}

export function useBookmarkToggle(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // API assumes this is a toggle
      await axiosInstance.get(`/post/${postId}/bookmark`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: Post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  isBookmarkedByMe: !post.isBookmarkedByMe,
                };
              }
              return post;
            }),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      // Backend uses POST for fetching comments
      const { data } = await axiosInstance.post(`/post/${postId}/comment/all`);
      return (data.comments || []) as Comment[];
    },
    enabled: !!postId,
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      const { data } = await axiosInstance.post(`/post/${postId}/comment`, { text });
      return data.comment as Comment;
    },
    onSuccess: (newComment) => {
      // Invalidate both comments and feed (to update comment count)
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, onUploadProgress }: { formData: FormData, onUploadProgress?: (progressEvent: any) => void }) => {
      const { data } = await axiosInstance.post('/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await axiosInstance.delete(`/post/delete/${postId}`);
      return data;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['myPosts'] });

      const previousFeed = queryClient.getQueryData(['feed']);
      const previousMyPosts = queryClient.getQueryData(['myPosts']);

      // Optimistically remove from feed
      queryClient.setQueryData(['feed'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.filter((post: Post) => post.id !== postId),
          })),
        };
      });

      // Optimistically remove from myPosts
      queryClient.setQueryData(['myPosts'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((post: Post) => post.id !== postId);
      });

      return { previousFeed, previousMyPosts };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
      if (context?.previousMyPosts) {
        queryClient.setQueryData(['myPosts'], context.previousMyPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    }
  });
}

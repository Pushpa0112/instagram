import axiosInstance from '@/lib/api/axios';
import { Post } from '@/types/api';
import { useAuthStore } from '@/store/useAuthStore';

interface FeedResponse {
  posts: Post[];
  nextCursor?: string;
}

export async function getFeed({ pageParam }: { pageParam?: string }): Promise<FeedResponse> {
  const { data } = await axiosInstance.get('/post/all', {
    params: pageParam ? { cursor: pageParam } : undefined,
  });

  // IMPORTANT: The backend `GET /api/v1/post/all` currently returns an array of posts or an object containing them.
  // We are assuming a UI-mapped shape. If the backend returns a flat array, we map it here.
  // The backend might not support pagination yet, so we return undefined for nextCursor.
  
  // Example mapping if backend returns { success: true, posts: [...] }
  const rawPosts = data.posts || data || [];
  
  const mappedPosts: Post[] = rawPosts.map((post: any) => {
    // Determine if liked by current user. We need the current user's ID to know this if the backend doesn't provide `isLikedByMe`
    const currentUserId = useAuthStore.getState().user?._id;
    
    return {
      id: post._id,
      author: post.author,
      image: post.image,
      caption: post.caption,
      likeCount: post.likes?.length || 0,
      isLikedByMe: post.likes?.includes(currentUserId) || false,
      commentCount: post.comments?.length || 0,
      isBookmarkedByMe: useAuthStore.getState().user?.bookmarks?.includes(post._id) || false, // Fallback, backend should ideally provide this
      createdAt: post.createdAt || new Date().toISOString(), // Fallback if missing
    };
  });

  return {
    posts: mappedPosts,
    nextCursor: undefined, // Update this when backend pagination is confirmed
  };
}

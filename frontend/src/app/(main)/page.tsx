"use client";

import React, { useEffect } from 'react';
import { usePostsFeed } from '@/features/feed/hooks';
import { PostCard } from '@/features/post/PostCard';
import { PostCardSkeleton } from '@/features/post/PostCardSkeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Loader2, RefreshCcw } from 'lucide-react';

export default function Home() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePostsFeed();

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto py-10">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-lg mx-auto py-20 flex flex-col items-center justify-center text-center gap-4">
        <p className="text-zinc-500">Failed to load feed</p>
        <button 
          onClick={() => refetch()} 
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:opacity-80 transition-opacity text-sm font-medium"
        >
          <RefreshCcw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (posts.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto py-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-2">No Posts Yet</h2>
        <p className="text-zinc-500 text-sm">Follow people or wait for new posts to appear in your feed.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[470px] mx-auto py-8">
      {posts.map((post, index) => {
        // Attach observer to the last item
        if (index === posts.length - 1) {
          return (
            <div key={post.id} ref={ref}>
              <PostCard post={post} />
            </div>
          );
        }
        return <PostCard key={post.id} post={post} />;
      })}

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-zinc-400" />
        </div>
      )}
    </div>
  );
}

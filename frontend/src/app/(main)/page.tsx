"use client";

import SuggestedUsers from "@/features/profile/SuggestedUsers";
import { usePostsFeed } from "@/features/feed/hooks";
import { PostCard } from "@/features/post/PostCard";
import { PostCardSkeleton } from "@/features/post/PostCardSkeleton";

export default function MainPage() {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = usePostsFeed();

  return (
    <div className="flex justify-center max-w-5xl mx-auto w-full">
      {/* Main Feed Column */}
      <div className="flex-1 max-w-[630px] pt-10 px-4 sm:px-0 lg:ml-12">
        {isLoading ? (
          <div className="flex flex-col gap-8 pb-20">
             {[1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">Failed to load feed.</div>
        ) : (
          <div className="flex flex-col gap-8 pb-20">
            {data?.pages.map((page, i) => (
              <div key={i} className="flex flex-col gap-8">
                {page.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ))}
            
            {hasNextPage && (
              <button 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage}
                className="text-blue-500 font-semibold text-center w-full py-4"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            )}
            {(!data?.pages[0]?.posts || data.pages[0].posts.length === 0) && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg font-semibold text-black dark:text-white mb-2">Welcome to Instagram!</p>
                <p>When you follow people, you'll see the photos and videos they post here.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggested Users Column */}
      <SuggestedUsers />
    </div>
  );
}

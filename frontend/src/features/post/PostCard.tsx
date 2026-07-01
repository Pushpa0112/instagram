import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '@/types/api';
import { formatRelativeTime, cn } from '@/lib/utils';
import { useLikeToggle, useBookmarkToggle } from './hooks';
import { CommentDrawer } from './CommentDrawer';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const { mutate: toggleLike } = useLikeToggle(post.id);
  const { mutate: toggleBookmark } = useBookmarkToggle(post.id);

  const handleDoubleTap = () => {
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1000);
    
    // Only like if not already liked
    if (!post.isLikedByMe) {
      toggleLike(post.isLikedByMe);
    }
  };

  return (
    <>
      <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
        {/* Header */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0">
            {post.author?.profilePicture ? (
              <img src={post.author.profilePicture} alt={post.author.username} className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{post.author?.username || 'Unknown'}</span>
          </div>
          <span className="text-zinc-500 text-xs ml-auto">• {formatRelativeTime(post.createdAt)}</span>
        </div>

        {/* Image */}
        <div 
          className="relative w-full bg-zinc-100 dark:bg-zinc-900 aspect-square overflow-hidden cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          {post.image && (
            <Image 
              src={post.image} 
              alt={post.caption || "Post image"} 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 600px"
              priority={false}
            />
          )}

          {/* Double-tap Heart Animation */}
          <AnimatePresence>
            {showHeartAnimation && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5, x: '-50%', y: '-50%' }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="absolute top-1/2 left-1/2 drop-shadow-2xl z-10"
              >
                <Heart className="text-white fill-white w-24 h-24" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between p-3 mt-1">
          <div className="flex gap-4 items-center">
            <button onClick={() => toggleLike(post.isLikedByMe)} className="hover:opacity-60 transition-opacity">
              <Heart 
                size={26} 
                className={cn(
                  "transition-colors", 
                  post.isLikedByMe ? "fill-red-500 text-red-500" : "text-black dark:text-white"
                )} 
              />
            </button>
            <button onClick={() => setIsCommentDrawerOpen(true)} className="hover:opacity-60 transition-opacity text-black dark:text-white">
              <MessageCircle size={26} />
            </button>
            <button className="hover:opacity-60 transition-opacity text-black dark:text-white">
              <Send size={26} />
            </button>
          </div>
          <button onClick={() => toggleBookmark()} className="hover:opacity-60 transition-opacity">
            <Bookmark 
              size={26} 
              className={cn(
                "transition-colors", 
                post.isBookmarkedByMe ? "fill-black text-black dark:fill-white dark:text-white" : "text-black dark:text-white"
              )} 
            />
          </button>
        </div>

        {/* Details */}
        <div className="px-3 flex flex-col gap-1.5 text-sm">
          <span className="font-semibold">{post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}</span>
          
          {post.caption && (
            <p>
              <span className="font-semibold mr-2">{post.author?.username}</span>
              {post.caption}
            </p>
          )}

          {post.commentCount > 0 && (
            <button 
              onClick={() => setIsCommentDrawerOpen(true)} 
              className="text-zinc-500 self-start mt-1 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              View all {post.commentCount} comments
            </button>
          )}
        </div>
      </div>

      <CommentDrawer 
        post={post} 
        isOpen={isCommentDrawerOpen} 
        onClose={() => setIsCommentDrawerOpen(false)} 
      />
    </>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { useComments, useAddComment } from './hooks';
import { formatRelativeTime } from '@/lib/utils';
import { Post } from '@/types/api';

interface CommentDrawerProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentDrawer({ post, isOpen, onClose }: CommentDrawerProps) {
  const [text, setText] = useState('');
  const { data: comments, isLoading } = useComments(isOpen ? post.id : '');
  const { mutate: addComment, isPending } = useAddComment(post.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(text, {
      onSuccess: () => setText(''),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer / Modal content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col h-[75vh] md:h-[600px] md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white dark:bg-zinc-950 rounded-t-2xl md:rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-semibold">Comments</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
              {/* Post Caption as first "comment" */}
              {post.caption && (
                <div className="flex gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                    {post.author?.profilePicture && (
                      <img src={post.author.profilePicture} alt={post.author.username} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold mr-2">{post.author?.username}</span>
                      {post.caption}
                    </p>
                    <span className="text-xs text-zinc-500 mt-1 block">{formatRelativeTime(post.createdAt)}</span>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-zinc-400" />
                </div>
              ) : comments?.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                      {comment.author?.profilePicture && (
                        <img src={comment.author.profilePicture} alt={comment.author.username} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold mr-2">{comment.author?.username}</span>
                        {comment.text}
                      </p>
                      <span className="text-xs text-zinc-500 mt-1 block">
                        {comment.createdAt ? formatRelativeTime(comment.createdAt) : 'Just now'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-full px-4 py-2 text-sm outline-none border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors"
                disabled={isPending}
              />
              <button 
                type="submit" 
                disabled={!text.trim() || isPending}
                className="p-2 text-blue-500 disabled:text-blue-300 dark:disabled:text-blue-800 transition-colors"
              >
                {isPending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

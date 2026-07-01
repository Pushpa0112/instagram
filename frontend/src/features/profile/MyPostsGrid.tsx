"use client";

import { useState } from "react";
import Image from "next/image";
import { useMyPosts } from "./hooks";
import { useDeletePost } from "../post/hooks";
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/types/api";
import { toast } from "sonner";

export default function MyPostsGrid() {
  const { data: posts, isLoading } = useMyPosts();
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();
  
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="w-16 h-16 border-2 border-current rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 opacity-0" /> {/* Spacer */}
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">No Posts Yet</h2>
        <p>When you share photos, they will appear on your profile.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      const postIdToDelete = (postToDelete as any)._id || postToDelete.id;
      await deletePost(postIdToDelete);
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setPostToDelete(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {posts.map((post) => {
          // The backend returns MongoDB documents which have _id instead of id
          const postId = (post as any)._id || post.id;
          
          return (
            <div key={postId} className="relative aspect-square group bg-gray-100 dark:bg-zinc-900 cursor-pointer">
              <Image 
                src={post.image} 
                alt={post.caption || "Post"} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 300px"
              />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-6 text-white font-bold">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-white" />
                  <span>{post.likeCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 fill-white" />
                  <span>{post.commentCount}</span>
                </div>
              </div>

              {/* Options Menu */}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger 
                    className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-white outline-none" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem 
                      className="text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPostToDelete(post);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

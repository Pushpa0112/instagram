"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserProfile } from "@/features/profile/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import EditProfileModal from "@/features/profile/EditProfileModal";
import FollowButton from "@/features/profile/FollowButton";
import { Button } from "@/components/ui/button";
import { useMessageStore } from "@/store/useMessageStore";
import { useRouter } from "next/navigation";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const { data: user, isLoading, isError } = useUserProfile(id);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const isOwnProfile = authUser?._id === id;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 pt-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-full max-w-md" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="text-gray-500 mt-2">The link you followed may be broken, or the page may have been removed.</p>
      </div>
    );
  }

  // Safely extract counts
  const postCount = user.posts?.length || 0;
  const followerCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 border border-gray-200 dark:border-zinc-800">
          <AvatarImage src={user.profilePicture || ""} />
          <AvatarFallback className="text-4xl uppercase">{user.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-xl font-semibold">{user.username}</h1>
            {isOwnProfile ? (
              <EditProfileModal user={user} />
            ) : (
              <div className="flex gap-2">
                <FollowButton 
                  userId={user._id} 
                  isFollowing={authUser ? user.followers.includes(authUser._id) : false} 
                />
                <Button 
                  variant="secondary"
                  className="font-semibold h-8"
                  onClick={() => {
                    useMessageStore.getState().addKnownPartner(user);
                    useMessageStore.getState().setActiveUserId(user._id);
                    router.push("/messages");
                  }}
                >
                  Message
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-6 mb-4">
            <span className="cursor-pointer"><strong>{postCount}</strong> posts</span>
            <span className="cursor-pointer"><strong>{followerCount}</strong> followers</span>
            <span className="cursor-pointer"><strong>{followingCount}</strong> following</span>
          </div>
          <div className="font-semibold">{user.bio || ""}</div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
        <div className="flex justify-center gap-12 mb-4 text-xs font-semibold tracking-widest text-gray-500 uppercase">
          <span
            onClick={() => setActiveTab("posts")}
            className={`pt-4 -mt-4 cursor-pointer border-t ${activeTab === "posts" ? "text-black dark:text-white border-black dark:border-white" : "border-transparent"}`}
          >
            Posts
          </span>
          <span
            onClick={() => setActiveTab("saved")}
            className={`pt-4 -mt-4 cursor-pointer border-t ${activeTab === "saved" ? "text-black dark:text-white border-black dark:border-white" : "border-transparent"}`}
          >
            Saved
          </span>
        </div>

        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {user.posts?.map((post: any) => {
              const postId = post._id || post.id;
              return (
                <div key={postId} className="relative aspect-square group bg-gray-100 dark:bg-zinc-900 cursor-pointer">
                  <Image
                    src={post.image}
                    alt={post.caption || "Post"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 300px"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-6 text-white font-bold">
                      <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 fill-white" />
                        <span>{post.likes?.length || post.likeCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 fill-white" />
                        <span>{post.comments?.length || post.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {postCount === 0 && (
              <div className="col-span-3 text-center py-20 text-gray-500">
                No posts yet.
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-2xl font-bold mb-2">Saved</h2>
            <p>List view coming soon! This feature is pending a dedicated backend endpoint.</p>
          </div>
        )}
      </div>
    </div>
  );
}

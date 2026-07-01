"use client";

import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import MyPostsGrid from "@/features/profile/MyPostsGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const user = useAuthStore((state) => state.user);
  const isOwnProfile = user?.username === username;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 border border-gray-200 dark:border-zinc-800">
          <AvatarImage src={isOwnProfile ? user?.profilePicture : ""} />
          <AvatarFallback className="text-4xl uppercase">{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-xl font-semibold">{username}</h1>
            {isOwnProfile ? (
              <Button variant="secondary" className="font-semibold h-8">Edit Profile</Button>
            ) : (
              <Button className="bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold h-8">Follow</Button>
            )}
          </div>
          <div className="flex gap-6 mb-4">
            {/* The exact counts would come from the user's real profile API endpoint */}
            <span><strong>0</strong> posts</span>
            <span><strong>0</strong> followers</span>
            <span><strong>0</strong> following</span>
          </div>
          <div className="font-semibold">{isOwnProfile ? user?.bio : ""}</div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
        <div className="flex justify-center gap-12 mb-4 text-xs font-semibold tracking-widest text-gray-500 uppercase">
          <span className="text-black dark:text-white border-t border-black dark:border-white pt-4 -mt-4 cursor-pointer">Posts</span>
          <span className="cursor-pointer pt-4">Saved</span>
        </div>
        
        {/* Render grid if own profile, else placeholder until full profile API is built */}
        {isOwnProfile ? (
          <MyPostsGrid />
        ) : (
          <div className="text-center py-20 text-gray-500">This account is private.</div>
        )}
      </div>
    </div>
  );
}

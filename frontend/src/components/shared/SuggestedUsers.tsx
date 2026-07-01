"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useSuggestedUsers, useFollowUser } from "@/features/profile/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function SuggestedUsers() {
  const { data: users, isLoading } = useSuggestedUsers();
  const authUser = useAuthStore((state) => state.user);
  const { mutate: followUser, isPending } = useFollowUser();

  if (isLoading) {
    return (
      <div className="w-80 hidden lg:flex flex-col pl-10 pt-10">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-full w-full"></div>
          <div className="h-40 bg-gray-200 dark:bg-zinc-800 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  // If no users, don't show the section
  if (!users || users.length === 0) return null;

  return (
    <div className="w-80 hidden lg:flex flex-col pl-10 pt-10 text-sm">
      {/* Current User Profile Snippet */}
      {authUser && (
        <div className="flex items-center justify-between mb-6">
          <Link href={`/${authUser.username}`} className="flex items-center gap-3">
            <Avatar className="w-11 h-11 border border-gray-200 dark:border-zinc-800">
              <AvatarImage src={authUser.profilePicture || ""} alt={authUser.username} />
              <AvatarFallback className="uppercase">{authUser.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{authUser.username}</span>
              <span className="text-gray-500 text-xs">{authUser.bio || authUser.email}</span>
            </div>
          </Link>
          <button className="text-[#0095F6] font-semibold text-xs hover:text-black dark:hover:text-white transition-colors">
            Switch
          </button>
        </div>
      )}

      {/* Suggested Users Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 font-semibold text-sm">Suggested for you</span>
        <button className="text-xs font-semibold hover:text-gray-400 transition-colors">See All</button>
      </div>

      {/* Suggested Users List */}
      <div className="flex flex-col gap-4">
        {users.slice(0, 5).map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <Link href={`/${user.username}`} className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-200 dark:border-zinc-800">
                <AvatarImage src={user.profilePicture || ""} alt={user.username} />
                <AvatarFallback className="uppercase">{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm hover:underline">{user.username}</span>
                <span className="text-gray-500 text-xs">Suggested for you</span>
              </div>
            </Link>
            <button 
              onClick={() => followUser(user._id)}
              disabled={isPending}
              className="text-[#0095F6] font-semibold text-xs hover:text-[#1877F2] transition-colors disabled:opacity-50"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
      
      {/* Footer Links */}
      <div className="mt-8 text-xs text-gray-400 space-y-4">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span>About</span>
          <span>Help</span>
          <span>Press</span>
          <span>API</span>
          <span>Jobs</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Locations</span>
          <span>Language</span>
        </div>
        <p>© 2026 INSTAGRAM CLONE</p>
      </div>
    </div>
  );
}

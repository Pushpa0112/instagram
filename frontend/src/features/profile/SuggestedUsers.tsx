"use client";

import { useSuggestedUsers } from "./hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "./FollowButton";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuggestedUsers() {
  const { data: users, isLoading } = useSuggestedUsers();
  const authUser = useAuthStore((state) => state.user);

  if (isLoading) {
    return (
      <div className="hidden lg:block w-[320px] pt-10 pl-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="hidden lg:block w-[320px] pt-10 pl-8">
        <div className="text-sm text-gray-500">No suggestions right now.</div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-[320px] pt-10 pl-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500 font-semibold text-sm">Suggested for you</span>
          <button className="text-xs font-bold hover:text-gray-400">See All</button>
        </div>
        
        {users.slice(0, 5).map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <Link href={`/profile/${user._id}`} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profilePicture || ""} />
                <AvatarFallback className="uppercase">{user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm hover:underline">{user.username}</span>
                <span className="text-xs text-gray-500">Suggested for you</span>
              </div>
            </Link>
            <FollowButton 
              userId={user._id} 
              isFollowing={authUser ? user.followers.includes(authUser._id) : false} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

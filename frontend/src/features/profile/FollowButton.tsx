"use client";

import { Button } from "@/components/ui/button";
import { useFollowUser } from "./hooks";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

export default function FollowButton({ userId, isFollowing }: FollowButtonProps) {
  const { mutate: followUser, isPending } = useFollowUser();

  const handleFollowToggle = () => {
    followUser(userId);
  };

  if (isFollowing) {
    return (
      <Button 
        variant="secondary" 
        className="font-semibold h-8"
        onClick={handleFollowToggle}
        disabled={isPending}
      >
        {isPending ? "Updating..." : "Unfollow"}
      </Button>
    );
  }

  return (
    <Button 
      className="bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold h-8"
      onClick={handleFollowToggle}
      disabled={isPending}
    >
      {isPending ? "Updating..." : "Follow"}
    </Button>
  );
}

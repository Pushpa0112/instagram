"use client";

import { Button } from "@/components/ui/button";
import { useFollowUser } from "./hooks";
import { motion } from "framer-motion";

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
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={handleFollowToggle}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-4 py-2"
      >
        {isPending ? "Updating..." : "Unfollow"}
      </motion.button>
    );
  }

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onClick={handleFollowToggle}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold h-8 px-4 py-2"
    >
      {isPending ? "Updating..." : "Follow"}
    </motion.button>
  );
}

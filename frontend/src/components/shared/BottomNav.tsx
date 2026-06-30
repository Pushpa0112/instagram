"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { toggleSearch, toggleCreatePost } = useUIStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-12 bg-white dark:bg-black border-t dark:border-zinc-800 z-50 flex items-center justify-around px-2">
      <Link href="/">
        <Home className={cn("w-6 h-6", pathname === "/" && "stroke-[2.5]")} />
      </Link>
      
      <button onClick={toggleSearch}>
        <Search className="w-6 h-6" />
      </button>

      {/* Raised Create Button */}
      <button onClick={toggleCreatePost}>
        <PlusSquare className="w-6 h-6" />
      </button>

      <Link href="/reels">
        <Video className={cn("w-6 h-6", pathname === "/reels" && "stroke-[2.5]")} />
      </Link>

      <Link href={user ? `/profile/${user._id}` : "#"}>
        <div className={cn("w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-800 border", pathname.startsWith("/profile") && "border-2 border-black dark:border-white")}>
          {user ? (
            user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase">
                {user.username.charAt(0)}
              </div>
            )
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      </Link>
    </div>
  );
}

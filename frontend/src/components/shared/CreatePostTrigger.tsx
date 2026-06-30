"use client";

import { useUIStore } from "@/store/useUIStore";
import { PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreatePostTrigger({ className, iconOnly = false }: { className?: string, iconOnly?: boolean }) {
  const { toggleCreatePost } = useUIStore();

  return (
    <button 
      onClick={toggleCreatePost}
      className={cn(
        "flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group w-full",
        className
      )}
    >
      <PlusSquare className="w-6 h-6 group-hover:scale-105 transition-transform" />
      {!iconOnly && <span className="hidden lg:block text-base">Create</span>}
    </button>
  );
}

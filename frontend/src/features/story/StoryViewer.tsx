"use client";

import { useEffect, useState, useRef } from "react";
import { Story } from "./mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function StoryViewer({ story, onClose, onNext, onPrevious }: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const STORY_DURATION = 5000;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setProgress(0);
  }, [story.id]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const updateInterval = 50;
    const step = (updateInterval / STORY_DURATION) * 100;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(intervalRef.current!);
          onNext();
          return 100;
        }
        return prev + step;
      });
    }, updateInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [story.id, isPaused, onNext]);

  const handlePointerDown = () => setIsPaused(true);
  const handlePointerUp = () => setIsPaused(false);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const { innerWidth } = window;
    if (clientX < innerWidth / 3) {
      onPrevious();
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center sm:p-4">
      <div 
        className="relative w-full h-full sm:w-[400px] sm:h-[800px] sm:max-h-[90vh] bg-zinc-900 sm:rounded-xl overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-4 sm:pt-2">
          <div className="h-0.5 flex-1 bg-white/30 overflow-hidden rounded-full">
            <div 
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-6 sm:top-4 left-0 right-0 z-20 flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={story.user.avatarUrl} />
              <AvatarFallback>{story.user.username[0]}</AvatarFallback>
            </Avatar>
            <span className="text-white font-semibold text-sm drop-shadow-md">{story.user.username}</span>
            <span className="text-white/70 text-xs font-semibold drop-shadow-md">2h</span>
          </div>
          <div className="flex items-center gap-4">
            <MoreHorizontal className="w-6 h-6 text-white cursor-pointer drop-shadow-md" />
            <X className="w-8 h-8 text-white cursor-pointer drop-shadow-md" onClick={onClose} />
          </div>
        </div>

        {/* Media */}
        <div className="absolute inset-0 z-10" onClick={handleTap}>
          <Image 
            src={story.mediaUrl}
            alt="Story"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, 400px"
          />
        </div>

        {/* Bottom Interaction Area */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex gap-4 items-center">
          <div className="flex-1 border border-white/40 rounded-full px-4 py-2 bg-black/20 backdrop-blur-sm">
            <input 
              type="text" 
              placeholder="Send message" 
              className="bg-transparent text-white placeholder-white/80 w-full focus:outline-none text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

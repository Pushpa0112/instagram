"use client";

import { useEffect, useRef, useState } from "react";
import { Reel } from "./mockData";
import { Heart, MessageCircle, Send, MoreHorizontal, Music } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ReelPlayer({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.7 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
      />
      
      <button 
        onClick={toggleMute}
        className="absolute top-6 right-4 z-20 bg-black/40 p-2 rounded-full text-white backdrop-blur-sm"
      >
        {isMuted ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
        )}
      </button>

      <div className="absolute bottom-20 right-4 z-20 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <Heart className="w-8 h-8 text-white drop-shadow-md cursor-pointer hover:text-red-500 transition-colors" />
          <span className="text-white text-xs font-semibold drop-shadow-md">{reel.likeCount}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <MessageCircle className="w-8 h-8 text-white drop-shadow-md cursor-pointer hover:text-gray-300" />
          <span className="text-white text-xs font-semibold drop-shadow-md">{reel.commentCount}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Send className="w-8 h-8 text-white drop-shadow-md cursor-pointer hover:text-gray-300" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <MoreHorizontal className="w-8 h-8 text-white drop-shadow-md cursor-pointer hover:text-gray-300" />
        </div>
        <div className="mt-2 w-8 h-8 border-2 border-white rounded-md overflow-hidden relative">
           <Avatar className="w-full h-full rounded-none">
             <AvatarImage src={reel.user.avatarUrl} className="object-cover" />
           </Avatar>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-20 z-20 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-white">
            <AvatarImage src={reel.user.avatarUrl} />
            <AvatarFallback>{reel.user.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold text-sm drop-shadow-md">{reel.user.username}</span>
          <button className="border border-white/50 px-3 py-1 rounded-md text-white font-semibold text-xs backdrop-blur-sm">Follow</button>
        </div>
        <p className="text-white text-sm drop-shadow-md line-clamp-2">
          {reel.caption}
        </p>
        <div className="flex items-center gap-2 text-white text-xs font-semibold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm drop-shadow-md">
           <Music className="w-3 h-3" />
           <span>{reel.user.username} • Original Audio</span>
        </div>
      </div>
    </div>
  );
}

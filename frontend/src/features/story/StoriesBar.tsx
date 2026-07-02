"use client";

import { useEffect, useState } from "react";
import { Story } from "./mockData";
import { getStories } from "./service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus } from "lucide-react";
import { StoryViewer } from "./StoryViewer";

export function StoriesBar() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchStories = async () => {
      const data = await getStories();
      setStories(data);
      setIsLoading(false);
    };
    fetchStories();
  }, []);

  const handleCloseViewer = () => {
    setActiveStoryIndex(null);
  };

  const handleStoryEnd = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      handleCloseViewer();
    }
  };

  const handleStoryPrevious = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto py-4 mb-6 hide-scrollbar max-w-full border-b border-gray-200 dark:border-zinc-800 lg:border-none">
        {/* Your Story */}
        <div className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 ml-4 sm:ml-0">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-transparent">
              <AvatarImage src={authUser?.profilePicture || ""} />
              <AvatarFallback className="uppercase">{authUser?.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-[#0095F6] rounded-full border-2 border-white dark:border-black p-0.5 z-10">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <span className="text-xs text-gray-500 w-16 truncate text-center">Your story</span>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-12 h-3 mt-1 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
            </div>
          ))
        ) : (
          stories.map((story, index) => (
            <div 
              key={story.id} 
              className={`flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 ${index === stories.length - 1 ? 'mr-4 sm:mr-0' : ''}`}
              onClick={() => setActiveStoryIndex(index)}
            >
              <div className={`p-[2px] rounded-full ${story.viewed ? 'bg-gray-300 dark:bg-zinc-700' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600'}`}>
                <div className="bg-white dark:bg-black p-[2px] rounded-full">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={story.user.avatarUrl} />
                    <AvatarFallback>{story.user.username[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs w-16 truncate text-center">{story.user.username}</span>
            </div>
          ))
        )}
      </div>

      {activeStoryIndex !== null && (
        <StoryViewer 
          story={stories[activeStoryIndex]} 
          onClose={handleCloseViewer}
          onNext={handleStoryEnd}
          onPrevious={handleStoryPrevious}
        />
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Reel } from "@/features/reel/mockData";
import { getReels } from "@/features/reel/service";
import { ReelPlayer } from "@/features/reel/ReelPlayer";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      const data = await getReels();
      setReels(data);
      setIsLoading(false);
    };
    fetchReels();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center bg-black h-[100dvh] w-full">
        <div className="w-full sm:w-[450px] h-full bg-zinc-900 animate-pulse relative">
           <Skeleton className="absolute bottom-10 left-4 w-48 h-10" />
           <Skeleton className="absolute bottom-24 left-4 w-32 h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-black h-[100dvh] w-full relative sm:pl-20 lg:pl-64">
      <div className="w-full sm:w-[450px] h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        {reels.map((reel) => (
          <div key={reel.id} className="h-[100dvh] w-full snap-start relative">
            <ReelPlayer reel={reel} />
          </div>
        ))}
      </div>
    </div>
  );
}

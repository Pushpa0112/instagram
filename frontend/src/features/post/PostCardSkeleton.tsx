import { Skeleton } from '@/components/ui/skeleton';

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Image square */}
      <Skeleton className="w-full aspect-square rounded-sm" />

      {/* Action Row */}
      <div className="flex items-center justify-between p-3 mt-1">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      {/* Details */}
      <div className="px-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-full max-w-[200px]" />
        <Skeleton className="h-4 w-24 mt-1" />
      </div>
    </div>
  );
}

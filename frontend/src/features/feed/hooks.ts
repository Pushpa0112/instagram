import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeed } from './api';

export function usePostsFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

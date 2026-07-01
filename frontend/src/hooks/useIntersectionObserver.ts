import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  enabled = true,
}: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { root, rootMargin, threshold }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [root, rootMargin, threshold, enabled]);

  return { ref, isIntersecting };
}

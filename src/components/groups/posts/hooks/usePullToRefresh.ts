
import { useRef, useCallback, useState } from 'react';

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5
}: UsePullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const scrollElementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (scrollElementRef.current && scrollElementRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    if (deltaY > 0 && scrollElementRef.current && scrollElementRef.current.scrollTop === 0) {
      e.preventDefault();
      const distance = Math.min(deltaY / resistance, threshold * 1.5);
      setPullDistance(distance);
    }
  }, [isPulling, isRefreshing, resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  const bindToElement = useCallback((element: HTMLElement | null) => {
    if (scrollElementRef.current) {
      scrollElementRef.current.removeEventListener('touchstart', handleTouchStart);
      scrollElementRef.current.removeEventListener('touchmove', handleTouchMove);
      scrollElementRef.current.removeEventListener('touchend', handleTouchEnd);
    }

    scrollElementRef.current = element;

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd);
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    pullDistance,
    isRefreshing,
    isPulling: isPulling && pullDistance > 0,
    bindToElement,
    shouldTrigger: pullDistance >= threshold
  };
};


import { useRef, useCallback, useState, useEffect } from 'react';

interface UseOptimizedPullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  disabled?: boolean;
}

export const useOptimizedPullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  disabled = false
}: UseOptimizedPullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const scrollElementRef = useRef<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);
  const lastUpdate = useRef(0);

  // Throttled update function using requestAnimationFrame
  const throttledUpdate = useCallback((distance: number) => {
    const now = performance.now();
    if (now - lastUpdate.current > 16) { // ~60fps
      setPullDistance(distance);
      lastUpdate.current = now;
    }
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const element = scrollElementRef.current;
    if (element && element.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    const element = scrollElementRef.current;

    if (deltaY > 0 && element && element.scrollTop === 0) {
      // Only prevent default if we're actually pulling to refresh
      if (deltaY > 10) {
        e.preventDefault();
      }
      
      const distance = Math.min(deltaY / resistance, threshold * 1.5);
      
      // Use RAF for smooth updates
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        throttledUpdate(distance);
      });
    }
  }, [isPulling, disabled, isRefreshing, resistance, threshold, throttledUpdate]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return;

    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    // Smooth reset animation
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      setPullDistance(0);
    });
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, disabled]);

  const bindToElement = useCallback((element: HTMLElement | null) => {
    // Cleanup previous element
    if (scrollElementRef.current) {
      scrollElementRef.current.removeEventListener('touchstart', handleTouchStart);
      scrollElementRef.current.removeEventListener('touchmove', handleTouchMove);
      scrollElementRef.current.removeEventListener('touchend', handleTouchEnd);
    }

    scrollElementRef.current = element;

    if (element && !disabled) {
      // Use passive listeners where possible for better performance
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (scrollElementRef.current) {
        scrollElementRef.current.removeEventListener('touchstart', handleTouchStart);
        scrollElementRef.current.removeEventListener('touchmove', handleTouchMove);
        scrollElementRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    pullDistance,
    isRefreshing,
    isPulling: isPulling && pullDistance > 0,
    bindToElement,
    shouldTrigger: pullDistance >= threshold
  };
};

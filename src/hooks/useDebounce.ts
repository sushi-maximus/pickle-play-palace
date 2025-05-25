
import { useCallback, useRef } from 'react';

interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
}

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  options: UseDebounceOptions = {}
): T => {
  const { delay = 300, leading = false } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (leading && now - lastCallTimeRef.current >= delay) {
        lastCallTimeRef.current = now;
        return callback(...args);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastCallTimeRef.current = Date.now();
        callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay, leading]
  );

  return debouncedCallback as T;
};

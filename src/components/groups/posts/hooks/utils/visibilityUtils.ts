
import { useCallback, useEffect, useRef } from "react";

export const useVisibilityTracking = () => {
  const isVisibleRef = useRef(true);

  // Check if the page is visible or hidden
  const checkVisibility = useCallback(() => {
    const newVisibility = document.visibilityState === 'visible';
    if (isVisibleRef.current !== newVisibility) {
      isVisibleRef.current = newVisibility;
      console.log(`Page visibility changed: ${newVisibility ? 'visible' : 'hidden'}`);
    }
  }, []);
  
  // Setup visibility change listener
  useEffect(() => {
    // Add visibility change listener
    document.addEventListener('visibilitychange', checkVisibility);
    
    // Set initial visibility state
    checkVisibility();
    
    return () => {
      // Clean up event listener
      document.removeEventListener('visibilitychange', checkVisibility);
    };
  }, [checkVisibility]);

  return { isVisibleRef };
};


import { useEffect, useRef } from "react";
import { USER_INTERACTION_RESET_DELAY } from "./autoRefreshConstants";

export const useUserInteractionTracking = () => {
  const userInteractingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleUserActivity = () => {
      userInteractingRef.current = true;
      
      // Reset after a short delay
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        userInteractingRef.current = false;
      }, USER_INTERACTION_RESET_DELAY);
    };
    
    // Add event listeners for user interaction
    document.addEventListener('mousedown', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);
    document.addEventListener('touchstart', handleUserActivity);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('mousedown', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      document.removeEventListener('touchstart', handleUserActivity);
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { userInteractingRef, timeoutRef };
};

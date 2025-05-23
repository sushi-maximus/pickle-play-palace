
import { useEffect, useRef } from "react";
import { USER_INTERACTION_RESET_DELAY } from "./autoRefreshConstants";

export const useUserInteractionTracking = () => {
  const userInteractingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleUserActivity = () => {
      // Only update if changed to avoid unnecessary operations
      if (!userInteractingRef.current) {
        userInteractingRef.current = true;
        console.log("User interaction detected, pausing auto-refresh");
      }
      
      // Clear existing timeout to reset the delay
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Reset after delay
      timeoutRef.current = setTimeout(() => {
        userInteractingRef.current = false;
        console.log("User interaction timeout - auto-refresh resumed");
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
      
      // Clean up timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return { userInteractingRef, timeoutRef };
};

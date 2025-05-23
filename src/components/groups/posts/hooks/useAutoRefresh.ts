
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

interface UseAutoRefreshProps {
  refreshFunction: () => Promise<void>;
  loading: boolean;
  interval?: number;
}

export const useAutoRefresh = ({ 
  refreshFunction, 
  loading,
  interval = 30000 // 30 seconds default
}: UseAutoRefreshProps) => {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(interval / 1000);
  const userInteractingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track user interaction
  useEffect(() => {
    const handleUserActivity = () => {
      userInteractingRef.current = true;
      
      // Reset after a short delay
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        userInteractingRef.current = false;
      }, 5000); // Reset after 5 seconds of inactivity
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

  // Countdown timer effect
  useEffect(() => {
    // Only run countdown if auto-refresh is enabled and not loading
    if (!isAutoRefreshEnabled || loading) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      return;
    }

    // Reset countdown when enabled
    setNextRefreshIn(interval / 1000);
    
    // Set up countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) {
          return interval / 1000; // Reset when reaches 0
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isAutoRefreshEnabled, loading, interval]);
  
  // Auto-refresh effect
  useEffect(() => {
    // Don't set up auto-refresh if it's disabled
    if (!isAutoRefreshEnabled) return;
    
    console.log("Setting up auto-refresh interval");
    
    // Set up the interval for auto-refresh
    const intervalId = setInterval(async () => {
      if (isAutoRefreshEnabled && !loading && !userInteractingRef.current) {
        console.log("Auto-refreshing posts");
        await refreshFunction();
        setLastAutoRefresh(new Date());
        setNextRefreshIn(interval / 1000); // Reset countdown after refresh
      } else if (userInteractingRef.current) {
        console.log("Skipping auto-refresh: user is interacting with the page");
      } else if (loading) {
        console.log("Skipping auto-refresh: content is already loading");
      }
    }, interval);
    
    // Clean up the interval when the component unmounts
    return () => {
      console.log("Cleaning up auto-refresh interval");
      clearInterval(intervalId);
    };
  }, [isAutoRefreshEnabled, loading, refreshFunction, interval]);

  const toggleAutoRefresh = () => {
    const newValue = !isAutoRefreshEnabled;
    setIsAutoRefreshEnabled(newValue);
    
    const title = newValue ? "Auto-refresh enabled" : "Auto-refresh disabled";
    const description = newValue 
      ? `Posts will automatically refresh every ${interval/1000} seconds` 
      : "Posts will only refresh when you click the refresh button";
    
    // Call toast with the format it expects based on your sonner.tsx implementation
    toast(title, {
      description,
      duration: 3000
    });
  };

  const handleManualRefresh = async () => {
    if (loading || isRefreshing) return;
    
    setIsRefreshing(true);
    await refreshFunction();
    setLastAutoRefresh(new Date());
    setNextRefreshIn(interval / 1000); // Reset countdown after manual refresh
    setTimeout(() => setIsRefreshing(false), 500); // Give visual feedback
  };

  return {
    isAutoRefreshEnabled,
    isRefreshing,
    lastAutoRefresh,
    nextRefreshIn,
    toggleAutoRefresh,
    handleManualRefresh
  };
};

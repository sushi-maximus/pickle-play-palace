
import { useState, useEffect, useRef, useCallback } from "react";
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
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);
  const isVisibleRef = useRef(true);

  // Check if the page is visible or hidden
  const checkVisibility = useCallback(() => {
    isVisibleRef.current = document.visibilityState === 'visible';
    console.log(`Page visibility changed: ${isVisibleRef.current ? 'visible' : 'hidden'}`);
  }, []);
  
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
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', checkVisibility);
    
    // Set initial visibility state
    checkVisibility();
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('mousedown', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      document.removeEventListener('touchstart', handleUserActivity);
      document.removeEventListener('visibilitychange', checkVisibility);
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [checkVisibility]);

  // Component mount/unmount lifecycle
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    return () => {
      isComponentMountedRef.current = false;
      
      // Clean up all intervals and timeouts when component unmounts
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      console.log('Component unmounted, all intervals cleaned up');
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
        countdownIntervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, loading, interval]);
  
  // Auto-refresh effect
  useEffect(() => {
    // Don't set up auto-refresh if it's disabled
    if (!isAutoRefreshEnabled) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }
    
    console.log("Setting up auto-refresh interval");
    
    // Set up the interval for auto-refresh
    refreshIntervalRef.current = setInterval(async () => {
      const shouldRefresh = 
        isAutoRefreshEnabled && 
        !loading && 
        !userInteractingRef.current && 
        isComponentMountedRef.current &&
        isVisibleRef.current;
      
      if (shouldRefresh) {
        console.log("Auto-refreshing posts");
        await refreshFunction();
        
        // Only update state if component is still mounted
        if (isComponentMountedRef.current) {
          setLastAutoRefresh(new Date());
          setNextRefreshIn(interval / 1000); // Reset countdown after refresh
        }
      } else {
        console.log(
          `Skipping auto-refresh: ${!isAutoRefreshEnabled ? 'disabled' : ''} ${loading ? 'loading' : ''} ` +
          `${userInteractingRef.current ? 'user-interacting' : ''} ${!isComponentMountedRef.current ? 'unmounted' : ''} ` +
          `${!isVisibleRef.current ? 'page-hidden' : ''}`
        );
      }
    }, interval);
    
    // Clean up the interval when the component unmounts or dependencies change
    return () => {
      console.log("Cleaning up auto-refresh interval");
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, loading, refreshFunction, interval]);

  const toggleAutoRefresh = () => {
    const newValue = !isAutoRefreshEnabled;
    setIsAutoRefreshEnabled(newValue);
    
    // Call toast with the format it expects based on your implementation
    toast({
      title: newValue ? "Auto-refresh enabled" : "Auto-refresh disabled",
      description: newValue 
        ? `Posts will automatically refresh every ${interval/1000} seconds` 
        : "Posts will only refresh when you click the refresh button",
      duration: 3000
    });
  };

  const handleManualRefresh = async () => {
    if (loading || isRefreshing) return;
    
    setIsRefreshing(true);
    await refreshFunction();
    
    // Only update state if component is still mounted
    if (isComponentMountedRef.current) {
      setLastAutoRefresh(new Date());
      setNextRefreshIn(interval / 1000); // Reset countdown after manual refresh
      setTimeout(() => {
        if (isComponentMountedRef.current) {
          setIsRefreshing(false);
        }
      }, 500); // Give visual feedback
    }
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

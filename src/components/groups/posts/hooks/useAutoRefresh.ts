
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useVisibilityTracking } from "./utils/visibilityUtils";
import { useUserInteractionTracking } from "./utils/userInteractionUtils";
import { useCountdownTimer } from "./utils/countdownTimerUtils";
import { useAutoRefreshLogic } from "./utils/autoRefreshLogicUtils";
import { DEFAULT_AUTO_REFRESH_INTERVAL } from "./utils/autoRefreshConstants";
import { UseAutoRefreshProps, UseAutoRefreshResult } from "./types/autoRefreshTypes";

export const useAutoRefresh = ({ 
  refreshFunction, 
  loading,
  interval = DEFAULT_AUTO_REFRESH_INTERVAL
}: UseAutoRefreshProps): UseAutoRefreshResult => {
  // State hooks - using functional updates to avoid stale state issues
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(interval / 1000);
  
  // Refs for tracking state to avoid stale closures
  const isComponentMountedRef = useRef(true);
  const isRefreshingRef = useRef(false);
  const isAutoRefreshEnabledRef = useRef(isAutoRefreshEnabled);

  // Update ref when state changes
  useEffect(() => {
    isAutoRefreshEnabledRef.current = isAutoRefreshEnabled;
  }, [isAutoRefreshEnabled]);

  // Track visibility, user interaction
  const { isVisibleRef } = useVisibilityTracking();
  const { userInteractingRef, timeoutRef } = useUserInteractionTracking();
  
  // Wrap refreshFunction to handle the refreshing state
  const wrappedRefreshFunction = async () => {
    // Prevent overlapping refreshes
    if (isRefreshingRef.current || loading) {
      console.log("Auto refresh skipped, already refreshing or loading");
      return;
    }

    console.log("Auto refresh triggered at", new Date().toLocaleTimeString());
    try {
      // Set refreshing state before calling the refresh function
      isRefreshingRef.current = true;
      setIsRefreshing(true);
      await refreshFunction();
    } catch (error) {
      console.error("Error during auto-refresh:", error);
      if (isComponentMountedRef.current) {
        toast("Error refreshing data. Please try again.");
      }
    } finally {
      // Only update state if component is still mounted
      if (isComponentMountedRef.current) {
        // Add a slight delay before setting isRefreshing to false for visual feedback
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            console.log("Auto refresh completed, resetting state");
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          }
        }, 800);
      }
    }
  };
  
  // Set up countdown timer
  const { countdownIntervalRef } = useCountdownTimer(
    isAutoRefreshEnabled,
    loading || isRefreshing,
    interval, 
    setNextRefreshIn
  );
  
  // Set up auto-refresh logic
  const { refreshIntervalRef } = useAutoRefreshLogic(
    isAutoRefreshEnabled,
    loading || isRefreshing,
    interval,
    wrappedRefreshFunction,
    userInteractingRef,
    isComponentMountedRef,
    isVisibleRef,
    setLastAutoRefresh,
    setNextRefreshIn
  );

  // Component mount/unmount lifecycle
  useEffect(() => {
    console.log("useAutoRefresh - component mounted");
    isComponentMountedRef.current = true;
    
    return () => {
      console.log("useAutoRefresh - component unmounting, cleaning up");
      isComponentMountedRef.current = false;
      
      // Clean up all intervals and timeouts when component unmounts
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      console.log('Component unmounted, all intervals cleaned up');
    };
  }, []);

  // Toggle auto-refresh function with proper state updates
  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(prevState => {
      const newValue = !prevState;
      
      if (newValue) {
        toast(`Auto-refresh enabled. Posts will refresh every ${interval/1000} seconds.`);
        // Reset the countdown timer when enabled
        setNextRefreshIn(interval / 1000);
      } else {
        toast("Auto-refresh disabled. Posts will only refresh when you click the refresh button.");
      }
      
      return newValue;
    });
  };

  // Manual refresh function with proper state handling
  const handleManualRefresh = async () => {
    // Prevent overlapping refreshes
    if (loading || isRefreshing || isRefreshingRef.current) {
      console.log("Manual refresh prevented - already loading or refreshing");
      return;
    }
    
    console.log("Manual refresh triggered at", new Date().toLocaleTimeString());
    
    try {
      isRefreshingRef.current = true;
      setIsRefreshing(true);
      await refreshFunction();
      // Only update if component is still mounted
      if (isComponentMountedRef.current) {
        // Set the last refresh time after successful refresh
        setLastAutoRefresh(new Date());
        // Reset countdown after manual refresh
        setNextRefreshIn(interval / 1000);
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
      if (isComponentMountedRef.current) {
        toast("Error refreshing data. Please try again.");
      }
    } finally {
      // Only update state if component is still mounted
      if (isComponentMountedRef.current) {
        // Add a slight delay for visual feedback before hiding the progress indicator
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          }
        }, 1000);
      }
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

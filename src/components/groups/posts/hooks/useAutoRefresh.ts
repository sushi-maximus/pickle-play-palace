
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
  // All state hooks MUST be called unconditionally at the top level
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(interval / 1000);
  
  // All refs MUST be initialized at the top level
  const isComponentMountedRef = useRef(true);
  const isRefreshingRef = useRef(false);

  // All custom hooks MUST be called unconditionally at the top level
  const { isVisibleRef } = useVisibilityTracking();
  const { userInteractingRef, timeoutRef } = useUserInteractionTracking();
  const { countdownIntervalRef } = useCountdownTimer(
    isAutoRefreshEnabled, 
    loading || isRefreshing,
    interval, 
    setNextRefreshIn
  );
  
  // Wrap refreshFunction to handle the refreshing state
  const wrappedRefreshFunction = async () => {
    // Prevent overlapping refreshes
    if (isRefreshingRef.current) {
      console.log("Auto refresh skipped, already refreshing");
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
    } finally {
      // Only update state if component is still mounted
      if (isComponentMountedRef.current) {
        // Add a slight delay before setting isRefreshing to false for visual feedback
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          }
        }, 800);
      }
    }
  };
  
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

  // Component mount/unmount lifecycle - MUST be called after all other hooks
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

  // Log refresh state changes for debugging - MUST always be called
  useEffect(() => {
    console.log("useAutoRefresh - refreshing state changed:", isRefreshing);
  }, [isRefreshing]);

  const toggleAutoRefresh = () => {
    const newValue = !isAutoRefreshEnabled;
    setIsAutoRefreshEnabled(newValue);
    
    if (newValue) {
      toast({
        description: `Auto-refresh enabled. Posts will refresh every ${interval/1000} seconds.`
      });
    } else {
      toast({
        description: "Auto-refresh disabled. Posts will only refresh when you click the refresh button."
      });
    }
  };

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
      // Set the last refresh time after successful refresh
      setLastAutoRefresh(new Date());
      // Reset countdown after manual refresh
      setNextRefreshIn(interval / 1000);
    } catch (error) {
      console.error("Error during manual refresh:", error);
    } finally {
      // Only update state if component is still mounted
      if (isComponentMountedRef.current) {
        // Add a slight delay for visual feedback before hiding the progress indicator
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          }
        }, 1000); // Longer visual feedback
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

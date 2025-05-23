
import { useState, useEffect, useRef, useCallback } from "react";
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
  // All useState hooks first
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(interval / 1000);
  
  // All useRef hooks second
  const isComponentMountedRef = useRef(true);
  const isRefreshingRef = useRef(false);
  const isAutoRefreshEnabledRef = useRef(isAutoRefreshEnabled);

  // All custom hooks third (in consistent order)
  const { isVisibleRef } = useVisibilityTracking();
  const { userInteractingRef, timeoutRef } = useUserInteractionTracking();

  // Update ref when state changes
  useEffect(() => {
    isAutoRefreshEnabledRef.current = isAutoRefreshEnabled;
  }, [isAutoRefreshEnabled]);

  // Wrap refreshFunction to handle the refreshing state
  const wrappedRefreshFunction = useCallback(async () => {
    if (isRefreshingRef.current || loading) {
      console.log("Auto refresh skipped, already refreshing or loading");
      return;
    }

    console.log("Auto refresh triggered at", new Date().toLocaleTimeString());
    try {
      isRefreshingRef.current = true;
      setIsRefreshing(true);
      await refreshFunction();
    } catch (error) {
      console.error("Error during auto-refresh:", error);
      if (isComponentMountedRef.current) {
        toast("Error refreshing data. Please try again.");
      }
    } finally {
      if (isComponentMountedRef.current) {
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            console.log("Auto refresh completed, resetting state");
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          }
        }, 800);
      }
    }
  }, [refreshFunction, loading]);
  
  // Set up countdown timer (fourth)
  const { countdownIntervalRef } = useCountdownTimer(
    isAutoRefreshEnabled,
    loading || isRefreshing,
    interval, 
    setNextRefreshIn
  );
  
  // Set up auto-refresh logic (fifth)
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

  // Component mount/unmount lifecycle (last effect)
  useEffect(() => {
    console.log("useAutoRefresh - component mounted");
    isComponentMountedRef.current = true;
    
    return () => {
      console.log("useAutoRefresh - component unmounting, cleaning up");
      isComponentMountedRef.current = false;
      
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

  // Toggle auto-refresh function
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled(prevState => {
      const newValue = !prevState;
      
      if (newValue) {
        toast(`Auto-refresh enabled. Posts will refresh every ${interval/1000} seconds.`);
        setNextRefreshIn(interval / 1000);
      } else {
        toast("Auto-refresh disabled. Posts will only refresh when you click the refresh button.");
      }
      
      return newValue;
    });
  }, [interval]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    if (loading || isRefreshing || isRefreshingRef.current) {
      console.log("Manual refresh prevented - already loading or refreshing");
      return;
    }
    
    console.log("Manual refresh triggered at", new Date().toLocaleTimeString());
    
    try {
      isRefreshingRef.current = true;
      setIsRefreshing(true);
      await refreshFunction();
      if (isComponentMountedRef.current) {
        setLastAutoRefresh(new Date());
        setNextRefreshIn(interval / 1000);
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
      if (isComponentMountedRef.current) {
        toast("Error refreshing data. Please try again.");
      }
    } finally {
      if (isComponentMountedRef.current) {
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          }
        }, 1000);
      }
    }
  }, [refreshFunction, loading, isRefreshing, interval]);

  return {
    isAutoRefreshEnabled,
    isRefreshing,
    lastAutoRefresh,
    nextRefreshIn,
    toggleAutoRefresh,
    handleManualRefresh
  };
};

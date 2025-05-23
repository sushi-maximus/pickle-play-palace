
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
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(interval / 1000);
  
  // Reference to track if component is mounted
  const isComponentMountedRef = useRef(true);

  // Track visibility using Page Visibility API
  const { isVisibleRef } = useVisibilityTracking();
  
  // Track user interaction
  const { userInteractingRef, timeoutRef } = useUserInteractionTracking();
  
  // Setup countdown timer
  const { countdownIntervalRef } = useCountdownTimer(
    isAutoRefreshEnabled, 
    loading, 
    interval, 
    setNextRefreshIn
  );
  
  // Setup auto-refresh logic
  const { refreshIntervalRef } = useAutoRefreshLogic(
    isAutoRefreshEnabled,
    loading,
    interval,
    refreshFunction,
    userInteractingRef,
    isComponentMountedRef,
    isVisibleRef,
    setLastAutoRefresh,
    setNextRefreshIn
  );

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
  }, [countdownIntervalRef, refreshIntervalRef, timeoutRef]);

  const toggleAutoRefresh = () => {
    const newValue = !isAutoRefreshEnabled;
    setIsAutoRefreshEnabled(newValue);
    
    // Use the correct format for Sonner toast (simple message with optional description)
    if (newValue) {
      toast(`Auto-refresh enabled. Posts will refresh every ${interval/1000} seconds.`);
    } else {
      toast("Auto-refresh disabled. Posts will only refresh when you click the refresh button.");
    }
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

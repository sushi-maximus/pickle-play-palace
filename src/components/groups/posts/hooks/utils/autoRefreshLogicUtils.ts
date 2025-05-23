
import { useEffect, useRef } from "react";

export const useAutoRefreshLogic = (
  isAutoRefreshEnabled: boolean,
  loading: boolean,
  interval: number,
  refreshFunction: () => Promise<void>,
  userInteractingRef: React.RefObject<boolean>,
  isComponentMountedRef: React.RefObject<boolean>,
  isVisibleRef: React.RefObject<boolean>,
  setLastAutoRefresh: React.Dispatch<React.SetStateAction<Date | null>>,
  setNextRefreshIn: React.Dispatch<React.SetStateAction<number>>
) => {
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [
    isAutoRefreshEnabled, 
    loading, 
    refreshFunction, 
    interval, 
    userInteractingRef, 
    isComponentMountedRef, 
    isVisibleRef, 
    setLastAutoRefresh, 
    setNextRefreshIn
  ]);

  return { refreshIntervalRef };
};

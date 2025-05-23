
import { useEffect, useRef, MutableRefObject } from 'react';

export const useAutoRefreshLogic = (
  isAutoRefreshEnabled: boolean,
  isLoading: boolean,
  interval: number,
  refreshFunction: () => Promise<void>,
  userInteractingRef: MutableRefObject<boolean>,
  isComponentMountedRef: MutableRefObject<boolean>,
  isVisibleRef: MutableRefObject<boolean>,
  setLastAutoRefresh: (date: Date) => void,
  setNextRefreshIn: (seconds: number) => void
) => {
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set up and clean up the refresh interval
  useEffect(() => {
    console.log(`Auto-refresh ${isAutoRefreshEnabled ? 'enabled' : 'disabled'}, cleaning up existing intervals`);
    
    // Always clear existing interval first to prevent duplicates
    if (refreshIntervalRef.current) {
      console.log("Clearing existing refresh interval");
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Only set up the interval if auto-refresh is enabled
    if (isAutoRefreshEnabled && isComponentMountedRef.current) {
      console.log(`Setting up NEW auto-refresh interval: ${interval/1000}s`);
      
      // Set up the recurring interval
      refreshIntervalRef.current = setInterval(() => {
        // Only proceed if all conditions are met
        if (
          isComponentMountedRef.current && 
          isAutoRefreshEnabled &&
          !isLoading && 
          !userInteractingRef.current && 
          isVisibleRef.current
        ) {
          console.log('Auto-refresh conditions met, refreshing data...');
          
          // Update last refresh timestamp first for immediate UI feedback
          setLastAutoRefresh(new Date());
          
          // Reset the countdown timer
          setNextRefreshIn(interval / 1000);
          
          // Execute the refresh function
          refreshFunction()
            .catch(error => {
              console.error('Error during auto-refresh:', error);
            });
        } else {
          console.log('Auto-refresh conditions not met:', {
            mounted: isComponentMountedRef.current,
            enabled: isAutoRefreshEnabled,
            loading: isLoading,
            userInteracting: userInteractingRef.current,
            visible: isVisibleRef.current
          });
        }
      }, interval);
    }

    return () => {
      if (refreshIntervalRef.current) {
        console.log("Cleaning up refresh interval on effect cleanup");
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [
    isAutoRefreshEnabled, 
    interval,
    isLoading,
    refreshFunction,
    setLastAutoRefresh,
    setNextRefreshIn
  ]);

  return { refreshIntervalRef };
};

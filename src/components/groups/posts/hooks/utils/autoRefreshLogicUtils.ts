
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
  
  // Helper function to clear interval
  const clearRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      console.log("Clearing existing refresh interval");
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };
  
  // Effect for setting up and cleaning up the refresh interval
  useEffect(() => {
    // Always clear existing interval first to prevent duplicates
    clearRefreshInterval();

    // Only set up the interval if component is mounted and auto-refresh is enabled
    if (!isComponentMountedRef.current || !isAutoRefreshEnabled) {
      console.log(`Auto-refresh ${!isComponentMountedRef.current ? 'component not mounted' : 'disabled'}`);
      return clearRefreshInterval;
    }

    console.log(`Auto-refresh enabled, setting up interval: ${interval/1000}s`);
    
    // Set up the recurring interval
    refreshIntervalRef.current = setInterval(() => {
      // Capture the current state values to prevent stale closures
      const isCurrentlyEnabled = isAutoRefreshEnabled;
      const isCurrentlyLoading = isLoading;
      const isCurrentlyInteracting = userInteractingRef.current;
      const isCurrentlyVisible = isVisibleRef.current;
      const isCurrentlyMounted = isComponentMountedRef.current;
      
      // Only proceed if all conditions are met
      if (
        isCurrentlyMounted && 
        isCurrentlyEnabled &&
        !isCurrentlyLoading && 
        !isCurrentlyInteracting && 
        isCurrentlyVisible
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
          mounted: isCurrentlyMounted,
          enabled: isCurrentlyEnabled,
          loading: isCurrentlyLoading,
          userInteracting: isCurrentlyInteracting,
          visible: isCurrentlyVisible
        });
      }
    }, interval);

    // Return cleanup function
    return clearRefreshInterval;
  }, [
    isAutoRefreshEnabled, 
    interval,
    isLoading,
    refreshFunction,
    setLastAutoRefresh,
    setNextRefreshIn,
    userInteractingRef,
    isComponentMountedRef,
    isVisibleRef
  ]);

  return { refreshIntervalRef };
};

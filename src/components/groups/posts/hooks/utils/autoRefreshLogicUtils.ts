
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
  const initialRefreshCompletedRef = useRef<boolean>(false);
  
  // Single useEffect for setting up and cleaning up the refresh interval
  useEffect(() => {
    // Clear existing interval when autoRefresh state changes
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Only set up the interval if auto-refresh is enabled
    if (isAutoRefreshEnabled) {
      console.log(`Setting up auto-refresh interval: ${interval/1000}s`);
      
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
          // Only perform initial refresh when transitioning from disabled to enabled
          if (!initialRefreshCompletedRef.current) {
            console.log('Initial refresh when auto-refresh enabled');
            initialRefreshCompletedRef.current = true;
            setLastAutoRefresh(new Date());
            setNextRefreshIn(interval / 1000);
            
            // Don't call refreshFunction immediately to avoid UI jank
            // Let it happen on the next interval
            return;
          }
          
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

    // Reset initialRefreshCompletedRef when auto-refresh is toggled
    if (!isAutoRefreshEnabled) {
      initialRefreshCompletedRef.current = false;
    }

    return () => {
      if (refreshIntervalRef.current) {
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

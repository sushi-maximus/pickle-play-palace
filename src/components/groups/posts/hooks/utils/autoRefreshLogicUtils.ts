
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
  
  useEffect(() => {
    // Clear existing interval when autoRefresh state changes
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Only set up the interval if auto-refresh is enabled
    if (isAutoRefreshEnabled) {
      console.log(`Setting up auto-refresh interval: ${interval/1000}s`);
      
      // Execute one refresh immediately when enabled (if not loading and not already done)
      if (!isLoading && isVisibleRef.current && !userInteractingRef.current && !initialRefreshCompletedRef.current) {
        console.log('Initial refresh when auto-refresh enabled');
        initialRefreshCompletedRef.current = true;
        setLastAutoRefresh(new Date());
        setNextRefreshIn(interval / 1000);
        refreshFunction().catch(error => {
          console.error('Error during initial auto-refresh:', error);
        });
      }
      
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

  // Reset the initial refresh flag when auto-refresh is disabled
  useEffect(() => {
    if (!isAutoRefreshEnabled) {
      initialRefreshCompletedRef.current = false;
    }
  }, [isAutoRefreshEnabled]);

  return { refreshIntervalRef };
};


import { useEffect, useRef } from "react";

export const useCountdownTimer = (
  isEnabled: boolean,
  loading: boolean,
  interval: number,
  setNextRefreshIn: React.Dispatch<React.SetStateAction<number>>
) => {
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear function to avoid code duplication
  const clearCountdownInterval = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  useEffect(() => {
    // Always clear existing interval first
    clearCountdownInterval();
    
    // Only set up countdown if enabled and not loading
    if (!isEnabled || loading) {
      console.log("Countdown timer not started - disabled or loading");
      return clearCountdownInterval; // Return cleanup function
    }

    console.log("Setting up countdown timer with interval:", interval);
    
    // Reset countdown when enabled
    setNextRefreshIn(interval / 1000);
    
    // Set up countdown interval to run every second
    countdownIntervalRef.current = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) {
          return interval / 1000; // Reset when reaches 0
        }
        return prev - 1;
      });
    }, 1000);
    
    // Return cleanup function
    return clearCountdownInterval;
  }, [isEnabled, loading, interval, setNextRefreshIn]);

  return { countdownIntervalRef };
};

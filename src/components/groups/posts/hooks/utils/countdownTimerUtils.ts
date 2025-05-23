
import { useEffect, useRef } from "react";

export const useCountdownTimer = (
  isEnabled: boolean,
  loading: boolean,
  interval: number,
  setNextRefreshIn: React.Dispatch<React.SetStateAction<number>>
) => {
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval first to prevent multiple countdowns running
    if (countdownIntervalRef.current) {
      console.log("Clearing existing countdown timer");
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    // Only run countdown if enabled and not loading
    if (!isEnabled || loading) {
      console.log("Countdown timer not started - disabled or loading");
      return () => {};
    }

    console.log("Setting up countdown timer");
    
    // Reset countdown when enabled
    setNextRefreshIn(interval / 1000);
    
    // Set up countdown interval to run every second
    countdownIntervalRef.current = setInterval(() => {
      setNextRefreshIn(prev => {
        // Decrement countdown by 1 second
        if (prev <= 1) {
          return interval / 1000; // Reset when reaches 0
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup function
    return () => {
      console.log("Cleaning up countdown timer");
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [isEnabled, loading, interval, setNextRefreshIn]);

  return { countdownIntervalRef };
};

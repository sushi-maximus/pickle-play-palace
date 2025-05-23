
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useRef } from "react";

interface RefreshProgressIndicatorProps {
  refreshing: boolean;
}

export const RefreshProgressIndicator = ({ refreshing }: RefreshProgressIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  // Track whether we're in the middle of a refresh cycle
  const isRefreshingRef = useRef(false);
  
  // Effect for refreshing state changes
  useEffect(() => {
    console.log("RefreshProgressIndicator - refreshing state changed to:", refreshing);
    
    // When refreshing starts and we're not already in a refresh cycle
    if (refreshing && !isRefreshingRef.current) {
      console.log("RefreshProgressIndicator - starting progress animation");
      isRefreshingRef.current = true;
      
      // Make indicator visible immediately
      setVisible(true);
      
      // Reset progress to start from beginning
      setProgress(0);
      
      // Clear any existing interval
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // Start increasing the progress
      const newIntervalId = setInterval(() => {
        setProgress((prev) => {
          // Increase more slowly as we get closer to 90%
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 85) return prev + 1;
          return Math.min(prev + 0.5, 90); // Never reach 100% until actually complete
        });
      }, 100);
      
      setIntervalId(newIntervalId);
      
      return () => {
        if (newIntervalId) {
          console.log("RefreshProgressIndicator - clearing progress interval (refresh started)");
          clearInterval(newIntervalId);
        }
      };
    } 
    // When refreshing stops
    else if (!refreshing && isRefreshingRef.current) {
      console.log("RefreshProgressIndicator - completing progress animation");
      isRefreshingRef.current = false;
      
      // Clear the progress interval
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      
      // Quickly fill to 100%
      setProgress(100);
      
      // After animation completes, hide indicator
      const hideTimeout = setTimeout(() => {
        console.log("RefreshProgressIndicator - hiding indicator");
        setVisible(false);
        
        // Reset progress after fade out animation completes
        const resetTimeout = setTimeout(() => {
          console.log("RefreshProgressIndicator - resetting progress");
          setProgress(0);
        }, 500);
        
        return () => clearTimeout(resetTimeout);
      }, 600);
      
      return () => clearTimeout(hideTimeout);
    }
  }, [refreshing, intervalId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        console.log("RefreshProgressIndicator - cleaning up on unmount");
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Don't render anything if not visible and progress is reset
  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div 
      className={`w-full overflow-hidden transition-opacity duration-500 ${
        !refreshing && progress === 100 ? "opacity-0" : "opacity-100"
      }`}
      style={{ height: "3px" }} // Slightly thicker for better visibility
    >
      <Progress 
        value={progress} 
        className="h-full rounded-none bg-slate-200 dark:bg-slate-800" 
      />
    </div>
  );
};

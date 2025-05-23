
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useRef } from "react";

interface RefreshProgressIndicatorProps {
  refreshing: boolean;
}

export const RefreshProgressIndicator = ({ refreshing }: RefreshProgressIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  
  // Handle progress animation based on refreshing state
  useEffect(() => {
    console.log("RefreshProgressIndicator - refreshing state changed to:", refreshing);
    
    // Clean up any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // When refreshing starts
    if (refreshing && !isRefreshingRef.current) {
      console.log("RefreshProgressIndicator - starting progress animation");
      isRefreshingRef.current = true;
      
      // Make indicator visible immediately
      setVisible(true);
      
      // Reset progress to start from beginning
      setProgress(0);
      
      // Start increasing the progress gradually
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          // Increase more slowly as we get closer to 90%
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 85) return prev + 1;
          return Math.min(prev + 0.5, 90); // Never reach 100% until actually complete
        });
      }, 100);
    } 
    // When refreshing stops
    else if (!refreshing && isRefreshingRef.current) {
      console.log("RefreshProgressIndicator - completing progress animation");
      isRefreshingRef.current = false;
      
      // Quickly fill to 100%
      setProgress(100);
      
      // After animation completes, hide indicator
      const hideTimeout = setTimeout(() => {
        console.log("RefreshProgressIndicator - hiding indicator");
        setVisible(false);
      }, 600);
      
      return () => clearTimeout(hideTimeout);
    }
    
    // Cleanup on unmount or refreshing state change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refreshing]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        console.log("RefreshProgressIndicator - cleaning up on unmount");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Reset progress after animation completes
  useEffect(() => {
    if (progress === 100) {
      const resetTimeout = setTimeout(() => {
        if (!refreshing) {
          console.log("RefreshProgressIndicator - resetting progress");
          setProgress(0);
        }
      }, 1000);
      
      return () => clearTimeout(resetTimeout);
    }
  }, [progress, refreshing]);

  return visible || progress > 0 ? (
    <div 
      className="w-full overflow-hidden transition-opacity duration-500"
      style={{ 
        height: "3px",
        opacity: !refreshing && progress === 100 ? 0 : 1 
      }}
    >
      <Progress 
        value={progress} 
        className="h-full rounded-none bg-slate-200 dark:bg-slate-800" 
      />
    </div>
  ) : null;
};

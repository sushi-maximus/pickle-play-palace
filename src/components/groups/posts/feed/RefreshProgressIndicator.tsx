
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface RefreshProgressIndicatorProps {
  refreshing: boolean;
}

export const RefreshProgressIndicator = ({ refreshing }: RefreshProgressIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // When refreshing starts
    if (refreshing) {
      // Make indicator visible immediately
      setVisible(true);
      // Reset progress to start from beginning
      setProgress(0);
      
      // Start increasing the progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Increase more slowly as we get closer to 90%
          // This creates the illusion of loading even if the actual process takes longer
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 85) return prev + 1;
          return Math.min(prev + 0.5, 90); // Never reach 100% until actually complete
        });
      }, 100);
      
      return () => clearInterval(interval);
    } else if (progress > 0) {
      // When refresh is complete, quickly fill to 100% and then fade out
      setProgress(100);
      
      // After animation completes, reset and hide for next cycle
      const timeout = setTimeout(() => {
        setVisible(false);
        // Reset progress after fade out animation completes
        setTimeout(() => setProgress(0), 500);
      }, 600);
      
      return () => clearTimeout(timeout);
    }
  }, [refreshing, progress]);

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
        className="h-full rounded-none bg-transparent" 
      />
    </div>
  );
};

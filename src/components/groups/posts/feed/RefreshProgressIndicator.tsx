
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface RefreshProgressIndicatorProps {
  refreshing: boolean;
}

export const RefreshProgressIndicator = ({ refreshing }: RefreshProgressIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Reset progress when refreshing starts
    if (refreshing) {
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
    } else {
      // When refresh is complete, quickly fill to 100% and then fade out
      setProgress(100);
    }
  }, [refreshing]);

  if (!refreshing && progress === 0) {
    return null;
  }

  return (
    <div 
      className={`w-full overflow-hidden transition-opacity duration-300 ${
        !refreshing && progress === 100 ? "opacity-0" : "opacity-100"
      }`}
      style={{ height: "2px" }} // Very thin height
    >
      <Progress 
        value={progress} 
        className="h-full rounded-none bg-transparent" 
      />
    </div>
  );
};


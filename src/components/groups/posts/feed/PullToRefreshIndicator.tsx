
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  isPulling: boolean;
  shouldTrigger: boolean;
}

export const PullToRefreshIndicator = ({
  pullDistance,
  isRefreshing,
  isPulling,
  shouldTrigger
}: PullToRefreshIndicatorProps) => {
  const opacity = Math.min(pullDistance / 60, 1);
  const scale = Math.min(pullDistance / 80, 1);

  if (!isPulling && !isRefreshing) return null;

  return (
    <div 
      className="flex justify-center items-center py-4 transition-all duration-200"
      style={{
        transform: `translateY(${Math.min(pullDistance, 80)}px)`,
        opacity: isRefreshing ? 1 : opacity
      }}
    >
      <div 
        className={cn(
          "flex items-center gap-2 text-sm font-medium transition-all duration-200",
          shouldTrigger || isRefreshing 
            ? "text-primary" 
            : "text-muted-foreground"
        )}
        style={{ transform: `scale(${isRefreshing ? 1 : scale})` }}
      >
        <RefreshCw 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isRefreshing && "animate-spin"
          )}
          style={{ 
            transform: `rotate(${pullDistance * 2}deg)` 
          }}
        />
        <span>
          {isRefreshing 
            ? "Refreshing..." 
            : shouldTrigger 
              ? "Release to refresh" 
              : "Pull to refresh"
          }
        </span>
      </div>
    </div>
  );
};

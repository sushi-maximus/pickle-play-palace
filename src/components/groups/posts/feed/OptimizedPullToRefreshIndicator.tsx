
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface OptimizedPullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  isPulling: boolean;
  shouldTrigger: boolean;
}

export const OptimizedPullToRefreshIndicator = memo(({
  pullDistance,
  isRefreshing,
  isPulling,
  shouldTrigger
}: OptimizedPullToRefreshIndicatorProps) => {
  const opacity = Math.min(pullDistance / 60, 1);
  const scale = Math.min(pullDistance / 80, 1);
  const rotation = pullDistance * 2;

  if (!isPulling && !isRefreshing) return null;

  return (
    <div 
      className="flex justify-center items-center py-4 absolute top-0 left-0 right-0 z-10"
      style={{
        transform: `translate3d(0, ${Math.min(pullDistance - 60, 20)}px, 0)`,
        opacity: isRefreshing ? 1 : opacity,
        willChange: 'transform, opacity'
      }}
    >
      <div 
        className={cn(
          "flex items-center gap-2 text-sm font-medium transition-colors duration-200",
          shouldTrigger || isRefreshing 
            ? "text-primary" 
            : "text-muted-foreground"
        )}
        style={{ 
          transform: `scale3d(${isRefreshing ? 1 : scale}, ${isRefreshing ? 1 : scale}, 1)`,
          willChange: 'transform'
        }}
      >
        <RefreshCw 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isRefreshing && "animate-spin"
          )}
          style={{ 
            transform: isRefreshing ? 'none' : `rotate3d(0, 0, 1, ${rotation}deg)`,
            willChange: 'transform'
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
});

OptimizedPullToRefreshIndicator.displayName = "OptimizedPullToRefreshIndicator";

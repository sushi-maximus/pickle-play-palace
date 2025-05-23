
import { Clock, RefreshCw, Loader2 } from "lucide-react";
import { memo } from "react";

interface LastRefreshIndicatorProps {
  loading: boolean;
  refreshing?: boolean;
  lastAutoRefresh: Date | null;
  isAutoRefreshEnabled?: boolean;
  nextRefreshIn?: number;
}

export const LastRefreshIndicator = memo(({ 
  loading, 
  refreshing = false,
  lastAutoRefresh,
  isAutoRefreshEnabled = true,
  nextRefreshIn
}: LastRefreshIndicatorProps) => {
  const formatLastRefreshTime = () => {
    if (!lastAutoRefresh) return "Never refreshed";
    
    // Format time in a user-friendly way (e.g., "5:30 PM")
    return lastAutoRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="px-6 pt-3 pb-0 flex justify-end items-center text-xs text-muted-foreground">
      {loading && !refreshing ? (
        <div className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Loading content...</span>
        </div>
      ) : refreshing ? (
        <div className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span>Refreshing content in background...</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {isAutoRefreshEnabled ? (
            <>
              <RefreshCw className="h-3 w-3 animate-pulse text-primary" />
              <span className="flex items-center gap-1">
                Auto-refresh active • 
                {nextRefreshIn !== undefined && (
                  <span className="text-primary font-medium">
                    Next: {nextRefreshIn}s •
                  </span>
                )}
                Last updated: {formatLastRefreshTime()}
              </span>
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              <span>Last updated: {formatLastRefreshTime()}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

LastRefreshIndicator.displayName = 'LastRefreshIndicator';

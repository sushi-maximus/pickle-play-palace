
import { Clock, RefreshCw, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LastRefreshIndicatorProps {
  loading: boolean;
  lastAutoRefresh: Date | null;
  isAutoRefreshEnabled?: boolean;
}

export const LastRefreshIndicator = ({ 
  loading, 
  lastAutoRefresh,
  isAutoRefreshEnabled = true
}: LastRefreshIndicatorProps) => {
  const formatLastRefreshTime = () => {
    if (!lastAutoRefresh) return "Never refreshed";
    
    // Format time in a user-friendly way (e.g., "5:30 PM")
    return lastAutoRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="px-6 pt-3 pb-0 flex justify-end items-center text-xs text-muted-foreground">
      {loading ? (
        <div className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Refreshing content...</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {isAutoRefreshEnabled ? (
            <>
              <RefreshCw className="h-3 w-3 animate-pulse text-primary" />
              <span className="flex items-center gap-1">
                Auto-refresh active • Last updated: {formatLastRefreshTime()}
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
};

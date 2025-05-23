
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LastRefreshIndicatorProps {
  loading: boolean;
  lastAutoRefresh: Date | null;
}

export const LastRefreshIndicator = ({ loading, lastAutoRefresh }: LastRefreshIndicatorProps) => {
  const formatLastRefreshTime = () => {
    if (!lastAutoRefresh) return "Never refreshed";
    
    // Format time in a user-friendly way (e.g., "5:30 PM")
    return lastAutoRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="px-6 pt-3 pb-0 flex justify-end items-center text-xs text-muted-foreground">
      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Last updated: {formatLastRefreshTime()}</span>
        </div>
      )}
    </div>
  );
};

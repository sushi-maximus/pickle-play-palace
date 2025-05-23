
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, RefreshCw, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface FeedHeaderProps {
  groupName: string | undefined;
  isRefreshing: boolean;
  loading: boolean;
  isAutoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
  handleRefresh: () => void;
}

export const FeedHeader = memo(({
  groupName,
  isRefreshing,
  loading,
  isAutoRefreshEnabled,
  toggleAutoRefresh,
  handleRefresh,
}: FeedHeaderProps) => {
  // Determine if any loading state is active
  const isLoading = loading || isRefreshing;
  
  return (
    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between relative z-10">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <CardTitle>{groupName ? `${groupName} Discussion` : 'Group Discussion'}</CardTitle>
      </div>
      <div className="flex items-center gap-4">
        {/* Auto-refresh toggle with Switch and tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-full transition-colors",
                isAutoRefreshEnabled && "bg-primary/10"
              )}>
                <Label 
                  htmlFor="auto-refresh" 
                  className={cn(
                    "text-xs font-medium cursor-pointer",
                    isAutoRefreshEnabled && "text-primary"
                  )}
                >
                  Auto
                  {isAutoRefreshEnabled && (
                    <RefreshCw className="h-2 w-2 ml-1 inline animate-spin" />
                  )}
                </Label>
                <Switch
                  id="auto-refresh"
                  checked={isAutoRefreshEnabled}
                  onCheckedChange={toggleAutoRefresh}
                  disabled={loading} // Only disable during initial loading, not during background refresh
                  aria-label={isAutoRefreshEnabled ? "Disable auto-refresh" : "Enable auto-refresh"}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isAutoRefreshEnabled 
                ? "Auto-refresh is enabled. Content will refresh automatically." 
                : "Auto-refresh is disabled. Click refresh to update content."}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Manual refresh button with appropriate icons for different states */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isLoading ? "outline" : "ghost"} 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
                className={cn(
                  "hover:bg-primary/10 transition-all",
                  isLoading && "border-primary/30"
                )}
              >
                {isLoading ? (
                  <Loader2 className={cn(
                    "h-4 w-4 animate-spin",
                    isRefreshing && "text-primary" // Highlight with primary color during background refresh
                  )} />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-1 sr-only md:not-sr-only">
                  {isRefreshing ? "Refreshing" : isLoading ? "Loading" : "Refresh"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isRefreshing
                ? "Content is refreshing in the background"
                : loading
                  ? "Content is loading"
                  : "Click to refresh content manually"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
  );
});

FeedHeader.displayName = 'FeedHeader';

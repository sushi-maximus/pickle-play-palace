
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, RefreshCw, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface FeedHeaderProps {
  groupName: string | undefined;
  isRefreshing: boolean;
  loading: boolean;
  handleRefresh: () => void;
}

export const FeedHeader = memo(({
  groupName,
  isRefreshing,
  loading,
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
        {/* Manual refresh button */}
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
                    isRefreshing && "text-primary"
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

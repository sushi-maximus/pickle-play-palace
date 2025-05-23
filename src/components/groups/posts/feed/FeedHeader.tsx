
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, RefreshCcw, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FeedHeaderProps {
  groupName: string | undefined;
  isRefreshing: boolean;
  loading: boolean;
  isAutoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
  handleRefresh: () => void;
}

export const FeedHeader = ({
  groupName,
  isRefreshing,
  loading,
  isAutoRefreshEnabled,
  toggleAutoRefresh,
  handleRefresh,
}: FeedHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <CardTitle>{groupName ? `${groupName} Discussion` : 'Group Discussion'}</CardTitle>
      </div>
      <div className="flex items-center gap-4">
        {/* Auto-refresh toggle with Switch */}
        <div className="flex items-center gap-2">
          <Label htmlFor="auto-refresh" className="text-xs font-medium cursor-pointer">
            Auto
          </Label>
          <Switch
            id="auto-refresh"
            checked={isAutoRefreshEnabled}
            onCheckedChange={toggleAutoRefresh}
            aria-label={isAutoRefreshEnabled ? "Disable auto-refresh" : "Enable auto-refresh"}
          />
        </div>

        {/* Manual refresh button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          className="hover:bg-primary/10"
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="ml-1 sr-only md:not-sr-only">Refresh</span>
        </Button>
      </div>
    </CardHeader>
  );
};


import { SimpleGroupCard } from "./SimpleGroupCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

interface SimpleGroupListProps {
  groups: Group[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const SimpleGroupList = ({ groups, loading, error, onRetry }: SimpleGroupListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 md:h-52"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-3">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12 px-3">
        <div className="text-gray-500 mb-2 text-base md:text-lg">No groups found</div>
        <p className="text-sm text-gray-400">
          Try adjusting your search or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {groups.map((group) => (
        <SimpleGroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Users, Search, AlertTriangle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { useState } from "react";
import { toast } from "sonner";

interface EmptyStateProps {
  type: "no-groups" | "no-search-results" | "error" | "network-error" | "loading-error";
  searchTerm?: string;
  onRefresh?: () => Promise<void>;
  error?: Error | string;
  retryAction?: () => Promise<void>;
}

export const GroupsEmptyState = ({ 
  type, 
  searchTerm, 
  onRefresh, 
  error,
  retryAction 
}: EmptyStateProps) => {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!retryAction && !onRefresh) return;
    
    setIsRetrying(true);
    try {
      if (retryAction) {
        await retryAction();
        toast.success("Successfully refreshed groups");
      } else if (onRefresh) {
        await onRefresh();
        toast.success("Groups refreshed");
      }
    } catch (err) {
      console.error("Retry failed:", err);
      toast.error("Failed to refresh. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorMessage = (error: Error | string | undefined): string => {
    if (!error) return "An unexpected error occurred";
    if (typeof error === "string") return error;
    return error.message || "An unexpected error occurred";
  };

  // Enhanced no-groups state with accessibility
  if (type === "no-groups") {
    return (
      <div 
        className="text-center py-12"
        role="region"
        aria-labelledby="no-groups-heading"
        aria-describedby="no-groups-description"
      >
        <Users 
          className="mx-auto h-12 w-12 text-muted-foreground mb-4" 
          aria-hidden="true"
        />
        <h3 
          id="no-groups-heading"
          className="text-2xl font-bold mb-2"
        >
          You haven't joined any groups yet
        </h3>
        <p 
          id="no-groups-description"
          className="text-muted-foreground mb-6"
        >
          Create your first group or join an existing one to get started
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          role="group"
          aria-label="Group actions"
        >
          <CreateGroupDialog 
            trigger={
              <Button className="hover-scale">
                <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                Create Group
              </Button>
            }
            onSuccess={onRefresh}
          />
          {onRefresh && (
            <Button 
              variant="outline" 
              onClick={handleRetry} 
              disabled={isRetrying}
              aria-describedby={isRetrying ? "refresh-status" : undefined}
            >
              <RefreshCw 
                className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} 
                aria-hidden="true"
              />
              {isRetrying ? (
                <>
                  <span aria-hidden="true">Refreshing...</span>
                  <span id="refresh-status" className="sr-only">
                    Refresh in progress
                  </span>
                </>
              ) : (
                'Refresh'
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Enhanced no-search-results state with accessibility
  if (type === "no-search-results") {
    return (
      <div 
        className="text-center py-12"
        role="region"
        aria-labelledby="no-results-heading"
        aria-describedby="no-results-description"
      >
        <Search 
          className="mx-auto h-12 w-12 text-muted-foreground mb-4" 
          aria-hidden="true"
        />
        <h3 
          id="no-results-heading"
          className="text-2xl font-bold mb-2"
        >
          No matching groups
        </h3>
        <p 
          id="no-results-description"
          className="text-muted-foreground mb-6"
        >
          No groups found matching "{searchTerm}". Try a different search term or create a new group.
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          role="group"
          aria-label="Search result actions"
        >
          <Button 
            variant="outline" 
            onClick={() => navigate("/groups")}
            aria-label="Clear search and view all groups"
          >
            Clear search
          </Button>
          <CreateGroupDialog 
            trigger={
              <Button>
                <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                Create Group
              </Button>
            }
            onSuccess={onRefresh}
          />
        </div>
      </div>
    );
  }

  // Enhanced error states with accessibility
  if (type === "error" || type === "loading-error") {
    return (
      <div 
        className="text-center py-12"
        role="alert"
        aria-labelledby="error-heading"
        aria-describedby="error-description"
      >
        <AlertTriangle 
          className="mx-auto h-12 w-12 text-red-500 mb-4" 
          aria-hidden="true"
        />
        <h3 
          id="error-heading"
          className="text-2xl font-bold mb-2 text-red-600"
        >
          Something went wrong
        </h3>
        <p 
          id="error-description"
          className="text-muted-foreground mb-4"
        >
          {getErrorMessage(error)}
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          This might be a temporary issue. Please try refreshing or contact support if the problem persists.
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          role="group"
          aria-label="Error recovery actions"
        >
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            aria-describedby={isRetrying ? "retry-status" : undefined}
          >
            <RefreshCw 
              className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} 
              aria-hidden="true"
            />
            {isRetrying ? (
              <>
                <span aria-hidden="true">Retrying...</span>
                <span id="retry-status" className="sr-only">
                  Retry in progress
                </span>
              </>
            ) : (
              'Try Again'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            aria-label="Go to dashboard"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Enhanced network error state with accessibility
  if (type === "network-error") {
    return (
      <div 
        className="text-center py-12"
        role="alert"
        aria-labelledby="network-error-heading"
        aria-describedby="network-error-description"
      >
        <AlertTriangle 
          className="mx-auto h-12 w-12 text-orange-500 mb-4" 
          aria-hidden="true"
        />
        <h3 
          id="network-error-heading"
          className="text-2xl font-bold mb-2 text-orange-600"
        >
          Connection Problem
        </h3>
        <p 
          id="network-error-description"
          className="text-muted-foreground mb-4"
        >
          Unable to connect to the server. Please check your internet connection.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Make sure you're connected to the internet and try again.
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          role="group"
          aria-label="Network error recovery actions"
        >
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            aria-describedby={isRetrying ? "reconnect-status" : undefined}
          >
            <RefreshCw 
              className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} 
              aria-hidden="true"
            />
            {isRetrying ? (
              <>
                <span aria-hidden="true">Reconnecting...</span>
                <span id="reconnect-status" className="sr-only">
                  Reconnection in progress
                </span>
              </>
            ) : (
              'Retry Connection'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            aria-label="Reload the current page"
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};

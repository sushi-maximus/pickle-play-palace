
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface GroupsErrorStateProps {
  error?: Error | string;
  onRetry?: () => Promise<void>;
  showHomeButton?: boolean;
  title?: string;
  description?: string;
  actionText?: string;
}

export const GroupsErrorState = ({
  error,
  onRetry,
  showHomeButton = true,
  title = "Something went wrong",
  description,
  actionText = "Try Again"
}: GroupsErrorStateProps) => {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const getErrorMessage = (error: Error | string | undefined): string => {
    if (!error) return "An unexpected error occurred while loading groups.";
    if (typeof error === "string") return error;
    return error.message || "An unexpected error occurred while loading groups.";
  };

  const isNetworkError = (error: Error | string | undefined): boolean => {
    if (!error) return false;
    const errorMessage = typeof error === "string" ? error : error.message;
    return errorMessage?.toLowerCase().includes("network") ||
           errorMessage?.toLowerCase().includes("fetch") ||
           errorMessage?.toLowerCase().includes("connection") ||
           false;
  };

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
      toast.success("Successfully refreshed groups");
    } catch (err) {
      console.error("Retry failed:", err);
      toast.error("Failed to refresh. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  const errorMessage = description || getErrorMessage(error);
  const networkError = isNetworkError(error);
  const iconColor = networkError ? "text-orange-500" : "text-red-500";
  const titleColor = networkError ? "text-orange-600" : "text-red-600";

  return (
    <div className="text-center py-12 px-4">
      <AlertTriangle className={`mx-auto h-12 w-12 ${iconColor} mb-4`} />
      <h3 className={`text-2xl font-bold mb-2 ${titleColor}`}>
        {networkError ? "Connection Problem" : title}
      </h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        {errorMessage}
      </p>
      
      {networkError && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Please check your internet connection and try again.
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {onRetry && (
          <Button onClick={handleRetry} disabled={isRetrying}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : actionText}
          </Button>
        )}
        
        {showHomeButton && (
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        )}
        
        {networkError && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
        )}
      </div>
    </div>
  );
};


import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthLoadingStateProps {
  message?: string;
  showSpinner?: boolean;
}

export const AuthLoadingState = ({ 
  message = "Checking authentication...", 
  showSpinner = true 
}: AuthLoadingStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md mx-auto px-4">
        {showSpinner && <LoadingSpinner size="lg" />}
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">{message}</p>
          <div className="h-1 w-48 mx-auto bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

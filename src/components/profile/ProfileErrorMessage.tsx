
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProfileErrorMessageProps {
  error: string;
  onRetry: () => Promise<void>;
}

export const ProfileErrorMessage = ({ error, onRetry }: ProfileErrorMessageProps) => {
  return (
    <Alert variant="destructive" className="animate-fade-in">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="bg-background hover:bg-muted"
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

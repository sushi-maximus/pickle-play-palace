
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseGroupsErrorHandlingReturn {
  error: Error | null;
  isRetrying: boolean;
  setError: (error: Error | null) => void;
  clearError: () => void;
  handleError: (error: unknown, context?: string) => void;
  retry: (retryFn: () => Promise<void>) => Promise<void>;
}

export const useGroupsErrorHandling = (): UseGroupsErrorHandlingReturn => {
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`[Groups${context ? ` - ${context}` : ''}] Error:`, error);
    
    let errorObj: Error;
    if (error instanceof Error) {
      errorObj = error;
    } else if (typeof error === 'string') {
      errorObj = new Error(error);
    } else {
      errorObj = new Error('An unexpected error occurred');
    }
    
    setError(errorObj);
    
    // Show user-friendly toast message
    if (errorObj.message.toLowerCase().includes('network') ||
        errorObj.message.toLowerCase().includes('fetch') ||
        errorObj.message.toLowerCase().includes('connection')) {
      toast.error("Connection problem. Please check your internet and try again.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }, []);

  const retry = useCallback(async (retryFn: () => Promise<void>) => {
    setIsRetrying(true);
    clearError();
    
    try {
      await retryFn();
      toast.success("Successfully refreshed");
    } catch (err) {
      handleError(err, "Retry");
    } finally {
      setIsRetrying(false);
    }
  }, [clearError, handleError]);

  return {
    error,
    isRetrying,
    setError,
    clearError,
    handleError,
    retry
  };
};


import { memo } from "react";
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";
import { FacebookRetryButton } from "./FacebookRetryButton";

interface FacebookErrorStateProps {
  error?: Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  title?: string;
  description?: string;
  showRetry?: boolean;
  variant?: 'network' | 'generic' | 'permission';
}

const FacebookErrorStateComponent = ({
  error,
  onRetry,
  isRetrying = false,
  title,
  description,
  showRetry = true,
  variant = 'generic'
}: FacebookErrorStateProps) => {
  const getErrorContent = () => {
    // Check if it's a network error
    if (error?.message?.includes('fetch') || error?.message?.includes('network') || variant === 'network') {
      return {
        icon: <Wifi className="h-12 w-12 text-orange-500" />,
        title: title || 'Connection Problem',
        description: description || 'Please check your internet connection and try again.',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }

    // Check if it's a permission error
    if (error?.message?.includes('permission') || error?.message?.includes('unauthorized') || variant === 'permission') {
      return {
        icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
        title: title || 'Access Denied',
        description: description || 'You don\'t have permission to perform this action.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }

    // Generic error
    return {
      icon: <AlertTriangle className="h-12 w-12 text-gray-500" />,
      title: title || 'Something went wrong',
      description: description || 'An unexpected error occurred. Please try again.',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };
  };

  const content = getErrorContent();

  return (
    <div className={`rounded-lg border p-6 text-center animate-fade-in ${content.bgColor} ${content.borderColor}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
          {content.icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {content.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {content.description}
          </p>
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mt-2 text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">
                Technical Details
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          {showRetry && onRetry && (
            <FacebookRetryButton
              onRetry={onRetry}
              isRetrying={isRetrying}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const FacebookErrorState = memo(FacebookErrorStateComponent);

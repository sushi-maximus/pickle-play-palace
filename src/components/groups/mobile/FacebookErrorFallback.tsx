
import { memo } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface FacebookErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
  description?: string;
}

const FacebookErrorFallbackComponent = ({ 
  error, 
  resetError,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again."
}: FacebookErrorFallbackProps) => {
  console.error("Facebook Error Fallback:", error);

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
      </div>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-sm sm:text-base text-gray-600 mb-4 text-center max-w-md">
        {description}
      </p>
      
      <button
        onClick={resetError}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </button>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 w-full max-w-md">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Error Details (Development)
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
};

export const FacebookErrorFallback = memo(FacebookErrorFallbackComponent);


import { memo } from "react";
import { RefreshCw } from "lucide-react";

interface FacebookRetryButtonProps {
  onRetry: () => void;
  isRetrying?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  children?: React.ReactNode;
}

const FacebookRetryButtonComponent = ({
  onRetry,
  isRetrying = false,
  disabled = false,
  size = 'md',
  variant = 'primary',
  children = 'Try Again'
}: FacebookRetryButtonProps) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300'
  };

  return (
    <button
      onClick={onRetry}
      disabled={disabled || isRetrying}
      className={`inline-flex items-center font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      <RefreshCw className={`mr-2 ${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} ${isRetrying ? 'animate-spin' : ''}`} />
      {isRetrying ? 'Retrying...' : children}
    </button>
  );
};

export const FacebookRetryButton = memo(FacebookRetryButtonComponent);

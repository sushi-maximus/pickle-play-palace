
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  className,
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-3 h-3 md:w-4 md:h-4",
    md: "w-4 h-4 md:w-5 md:h-5", 
    lg: "w-6 h-6 md:w-8 md:h-8"
  };

  const borderClasses = {
    sm: "border-2",
    md: "border-2", 
    lg: "border-3"
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={cn(
          "border-primary border-t-transparent rounded-full animate-spin",
          sizeClasses[size],
          borderClasses[size],
          className
        )}
      />
      {text && (
        <span className="text-xs md:text-sm text-gray-600 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

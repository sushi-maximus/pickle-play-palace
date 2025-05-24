
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

interface PageLoaderProps {
  className?: string;
  text?: string;
  variant?: "minimal" | "full" | "overlay";
}

export const PageLoader = ({ 
  className, 
  text = "Loading...",
  variant = "full"
}: PageLoaderProps) => {
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <LoadingSpinner size="md" text={text} />
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className={cn(
        "fixed inset-0 bg-white/80 backdrop-blur-sm z-50",
        "flex items-center justify-center",
        className
      )}>
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <LoadingSpinner size="lg" text={text} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-slate-50 flex flex-col items-center justify-center",
      className
    )}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">{text}</p>
          <p className="text-sm text-gray-600">Please wait while we load your content</p>
        </div>
      </div>
    </div>
  );
};

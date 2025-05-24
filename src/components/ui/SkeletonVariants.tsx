
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface SkeletonVariantsProps {
  variant: "card" | "text" | "button" | "avatar" | "list" | "form";
  className?: string;
  count?: number;
}

export const SkeletonVariants = ({ 
  variant, 
  className, 
  count = 1 
}: SkeletonVariantsProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className={cn("bg-white rounded-lg border p-4 md:p-6 space-y-4", className)}>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        );

      case "text":
        return (
          <div className={cn("space-y-2", className)}>
            {Array.from({ length: count }).map((_, i) => (
              <Skeleton 
                key={i} 
                className={cn(
                  "h-4",
                  i === count - 1 ? "w-3/4" : "w-full"
                )}
              />
            ))}
          </div>
        );

      case "button":
        return (
          <Skeleton className={cn("h-9 w-24 rounded-md", className)} />
        );

      case "avatar":
        return (
          <Skeleton className={cn("w-10 h-10 rounded-full", className)} />
        );

      case "list":
        return (
          <div className={cn("space-y-3", className)}>
            {Array.from({ length: count }).map((_, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1.5s'
                }}
              >
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        );

      case "form":
        return (
          <div className={cn("space-y-6", className)}>
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        );

      default:
        return <Skeleton className={className} />;
    }
  };

  return <>{renderSkeleton()}</>;
};

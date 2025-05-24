
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>
      
      {/* Areas of Focus Card Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-primary/30 p-6">
        <div className="space-y-6">
          {/* Card Title */}
          <Skeleton className="h-6 w-40" />
          
          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            
            <div className="ml-7 space-y-3">
              <Skeleton className="h-4 w-full max-w-md" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="w-1.5 h-1.5 rounded-full mt-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Strategy Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <Skeleton className="h-4 w-80" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-8 w-28 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

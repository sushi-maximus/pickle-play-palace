
import { SkeletonVariants } from "@/components/ui/SkeletonVariants";

export const DashboardLoading = () => {
  return (
    <div className="py-4 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-64 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Areas of Focus Card skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 border-l-primary/30 border-l-4 p-6">
        <div className="space-y-4">
          {/* Card title */}
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          
          {/* Next level section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
            </div>
            
            <div className="ml-7 space-y-2">
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mt-2 animate-pulse" />
                    <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Strategy tabs skeleton */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

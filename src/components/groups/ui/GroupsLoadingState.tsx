
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  count?: number;
}

export const GroupsLoadingState = ({ count = 6 }: LoadingStateProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="h-80 bg-white rounded-lg border animate-fade-in hover:shadow-md transition-all"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: '1.2s'
          }}
        >
          <div className="h-full flex flex-col justify-between p-6">
            {/* Header section with badge and avatar */}
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
            
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
              <div className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-8 mx-auto" />
              </div>
              <div className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            </div>
            
            {/* Content section */}
            <div className="space-y-3 flex-1">
              <div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
            
            {/* Action button */}
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

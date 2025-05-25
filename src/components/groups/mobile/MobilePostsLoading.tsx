
import { Skeleton } from "@/components/ui/skeleton";

export const MobilePostsLoading = () => {
  return (
    <div className="flex-1 px-4 py-6 md:px-6 md:py-8 space-y-6">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 animate-fade-in"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: '1s'
          }}
        >
          {/* Post header */}
          <div className="flex gap-3 mb-4">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
          
          {/* Post content */}
          <div className="space-y-3 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
          
          {/* Reactions bar */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <Skeleton className="h-11 w-16 rounded-lg" />
            <Skeleton className="h-11 w-16 rounded-lg" />
            <Skeleton className="h-11 w-16 rounded-lg" />
            <div className="ml-auto">
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

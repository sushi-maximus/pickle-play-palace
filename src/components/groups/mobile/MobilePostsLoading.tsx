
import { Skeleton } from "@/components/ui/skeleton";

export const MobilePostsLoading = () => {
  return (
    <div className="flex-1 px-3 py-4 md:px-6 md:py-8">
      <div className="space-y-3 md:space-y-4">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-lg border border-gray-200 border-l-primary/30 border-l-4 p-3 md:p-4 animate-fade-in hover:shadow-md transition-all"
            style={{
              animationDelay: `${i * 200}ms`,
              animationDuration: '1.2s'
            }}
          >
            {/* Post header */}
            <div className="flex gap-2 md:gap-3 mb-3">
              <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 md:h-4 w-1/3" />
                <Skeleton className="h-2 md:h-3 w-1/4" />
              </div>
            </div>
            
            {/* Post content */}
            <div className="space-y-2 mb-3">
              <Skeleton className="h-3 md:h-4 w-full" />
              <Skeleton className="h-3 md:h-4 w-4/5" />
              <Skeleton className="h-3 md:h-4 w-3/5" />
            </div>
            
            {/* Reactions bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

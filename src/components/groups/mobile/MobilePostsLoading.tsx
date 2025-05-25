
import { memo } from "react";

const MobilePostsLoadingComponent = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {[1, 2, 3].map((index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse"
        >
          {/* Post Header Skeleton - Enhanced for mobile */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-24 sm:w-32 mb-1 sm:mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-20"></div>
              </div>
            </div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded"></div>
          </div>

          {/* Post Content Skeleton - Enhanced spacing for mobile */}
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-3 sm:h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>

          {/* Reaction Summary Skeleton - Enhanced for mobile */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded-full"></div>
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
            </div>
            <div className="h-2 sm:h-3 bg-gray-300 rounded w-16 sm:w-20"></div>
          </div>

          {/* Action Bar Skeleton - Enhanced touch targets for mobile */}
          <div className="flex items-center border-t border-gray-200">
            {[1, 2, 3].map((btnIndex) => (
              <div 
                key={btnIndex} 
                className="flex-1 flex items-center justify-center py-3 sm:py-4 min-h-[52px]"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 rounded w-12 sm:w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const MobilePostsLoading = memo(MobilePostsLoadingComponent);

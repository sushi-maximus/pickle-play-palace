
import { memo } from "react";

interface FacebookLoadingStateProps {
  type?: "posts" | "comments" | "reactions" | "settings" | "members";
  count?: number;
}

const FacebookLoadingStateComponent = ({ 
  type = "posts", 
  count = 3 
}: FacebookLoadingStateProps) => {
  if (type === "comments") {
    return (
      <div className="space-y-3 p-3 sm:p-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex space-x-2 sm:space-x-3 animate-pulse">
            {/* Comment Avatar */}
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
            
            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-100 rounded-2xl px-3 py-2">
                <div className="h-2 sm:h-3 bg-gray-300 rounded w-16 sm:w-20 mb-1"></div>
                <div className="h-2 sm:h-3 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-2 sm:h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="flex items-center space-x-3 mt-1 px-3">
                <div className="h-2 bg-gray-300 rounded w-8"></div>
                <div className="h-2 bg-gray-300 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "reactions") {
    return (
      <div className="flex items-center space-x-1 sm:space-x-2 animate-pulse">
        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded-full"></div>
        <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
      </div>
    );
  }

  if (type === "settings") {
    return (
      <div className="space-y-4 sm:space-y-6">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse"
          >
            {/* Settings Card Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="h-4 sm:h-5 bg-gray-300 rounded w-32 sm:w-40"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-48 sm:w-56 mt-2"></div>
            </div>

            {/* Settings Form Fields */}
            <div className="p-4 sm:p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-20 sm:w-24"></div>
                  <div className="h-10 bg-gray-100 rounded"></div>
                </div>
              ))}
              
              {/* Save Button */}
              <div className="h-10 bg-gray-300 rounded w-32 mt-6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "members") {
    return (
      <div className="space-y-3 md:space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className="bg-white shadow-sm rounded-lg p-3 md:p-4 animate-pulse"
          >
            {/* Member Card Content */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Avatar */}
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              
              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 md:h-4 bg-gray-300 rounded w-24 md:w-32"></div>
                  {index === 0 && (
                    <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                  )}
                </div>
                <div className="h-2 md:h-3 bg-gray-200 rounded w-20 md:w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: posts loading
  return (
    <div className="space-y-4 sm:space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse"
        >
          {/* Post Header Skeleton */}
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

          {/* Post Content Skeleton */}
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-3 sm:h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>

          {/* Reaction Summary Skeleton */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded-full"></div>
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
            </div>
            <div className="h-2 sm:h-3 bg-gray-300 rounded w-16 sm:w-20"></div>
          </div>

          {/* Action Bar Skeleton */}
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

export const FacebookLoadingState = memo(FacebookLoadingStateComponent);

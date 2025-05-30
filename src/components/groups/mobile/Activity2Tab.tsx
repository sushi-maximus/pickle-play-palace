
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import { useNextEvent } from "../events/hooks/useNextEvent";
import { FacebookNetworkStatus } from "./FacebookNetworkStatus";
import { FacebookErrorBoundary } from "./FacebookErrorBoundary";
import { FacebookErrorState } from "./FacebookErrorState";
import { FacebookLoadingState } from "./FacebookLoadingState";
import { FacebookErrorFallback } from "./FacebookErrorFallback";
import { NextEventCard } from "../events/components/NextEventCard";
import type { Profile } from "../posts/hooks/types/groupPostTypes";
import { FacebookCreatePost } from "./FacebookCreatePost";
import { FacebookPostsList } from "./FacebookPostsList";

interface Activity2TabProps {
  groupId: string;
  user: Profile | null;
  onPostCreated: () => void;
}

const Activity2TabComponent = ({ groupId, user, onPostCreated }: Activity2TabProps) => {
  const [retryKey, setRetryKey] = useState(0);
  const navigate = useNavigate();
  
  console.log("Activity2Tab - Rendering with:", { groupId, userId: user?.id });

  // Validate required props
  if (!groupId) {
    return (
      <FacebookErrorState
        title="Invalid Group"
        description="Group information is missing. Please try navigating back and selecting a group again."
        showRetry={false}
      />
    );
  }

  // Fetch posts using existing hook with retry key
  const { posts, loading, error, refreshPosts } = useGroupPosts({
    groupId,
    userId: user?.id,
    key: retryKey
  });

  // Fetch next event data
  const { nextEventData, isLoading: isLoadingNextEvent } = useNextEvent({
    groupId,
    userId: user?.id
  });

  const handlePostCreated = async () => {
    try {
      await refreshPosts();
      onPostCreated();
    } catch (error) {
      console.error('Error refreshing posts after creation:', error);
    }
  };

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
    refreshPosts();
  };

  const handleCreatePost = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventClick = () => {
    if (nextEventData?.event) {
      navigate(`/events/${nextEventData.event.id}`);
    }
  };

  const handleErrorReset = () => {
    setRetryKey(prev => prev + 1);
    refreshPosts();
  };

  // Convert string error to Error object if needed
  const errorObject = error ? new Error(error) : null;

  return (
    <FacebookErrorBoundary
      fallback={({ error, resetError }) => (
        <FacebookErrorFallback
          error={error}
          resetError={resetError}
          title="Activity Feed Error"
          description="There was a problem loading the activity feed. This might be a temporary issue."
        />
      )}
    >
      {/* Main Container - Optimized for mobile with safe areas */}
      <main className="flex-1 bg-gray-50 overflow-hidden min-h-0">
        {/* Network Status Indicator */}
        <FacebookNetworkStatus />
        
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          {/* Facebook-style Create Post Section - Removed sticky positioning */}
          <div className="flex-shrink-0 pt-4 mb-4">
            <FacebookCreatePost 
              groupId={groupId}
              user={user}
              onPostCreated={handlePostCreated}
            />
          </div>

          {/* Next Event Card - Only show if there's an upcoming event */}
          {nextEventData && !isLoadingNextEvent && (
            <div className="flex-shrink-0 mb-4 px-3 md:px-4">
              <NextEventCard 
                event={nextEventData.event}
                registrationStatus={nextEventData.registrationStatus}
                onClick={handleEventClick}
              />
            </div>
          )}

          {/* Posts Feed Area - Enhanced scrolling with momentum and safe areas */}
          <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain webkit-overflow-scrolling-touch min-h-0">
            <div className="pb-4 sm:pb-6 pb-safe">
              {loading ? (
                <div className="p-3 sm:p-4">
                  <FacebookLoadingState type="posts" count={3} />
                </div>
              ) : errorObject ? (
                <div className="p-3 sm:p-4">
                  <FacebookErrorState
                    error={errorObject}
                    onRetry={handleRetry}
                    title="Failed to Load Posts"
                    description="We couldn't load the posts for this group. Please check your connection and try again."
                    variant="network"
                  />
                </div>
              ) : (
                <FacebookPostsList 
                  posts={posts}
                  user={user}
                  loading={loading}
                  error={errorObject}
                  onRetry={handleRetry}
                  onCreatePost={user ? handleCreatePost : undefined}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </FacebookErrorBoundary>
  );
};

export const Activity2Tab = memo(Activity2TabComponent);


import { memo, useState } from "react";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import { FacebookNetworkStatus } from "./FacebookNetworkStatus";
import { FacebookErrorBoundary } from "./FacebookErrorBoundary";
import { FacebookErrorState } from "./FacebookErrorState";
import type { Profile } from "../posts/hooks/types/groupPostTypes";
import { FacebookCreatePost } from "./FacebookCreatePost";
import { FacebookPostsList } from "./FacebookPostsList";
import { MobilePostsLoading } from "./MobilePostsLoading";

interface Activity2TabProps {
  groupId: string;
  user: Profile | null;
  onPostCreated: () => void;
}

const Activity2TabComponent = ({ groupId, user, onPostCreated }: Activity2TabProps) => {
  const [retryKey, setRetryKey] = useState(0);
  
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
    key: retryKey // Force refresh when retry key changes
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
    // Scroll to top where create post form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Convert string error to Error object if needed
  const errorObject = error ? new Error(error) : null;

  return (
    <FacebookErrorBoundary>
      <main className="flex-1 bg-gray-50 overflow-hidden">
        {/* Network Status Indicator */}
        <FacebookNetworkStatus />
        
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          {/* Facebook-style Create Post Section */}
          <div className="flex-shrink-0">
            <FacebookCreatePost 
              groupId={groupId}
              user={user}
              onPostCreated={handlePostCreated}
            />
          </div>

          {/* Posts Feed Area - Enhanced scrolling for mobile */}
          <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain">
            <div className="p-3 sm:p-4 pb-safe">
              {loading ? (
                <MobilePostsLoading />
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


import { CreatePostForm2 } from "../CreatePostForm2";
import { GroupPostsEmpty } from "../GroupPostsEmpty";
import { FeedLoadingState } from "./FeedLoadingState";
import { FeedErrorState } from "./FeedErrorState";
import { FeedScrollArea } from "./FeedScrollArea";
import { RefreshProgressIndicator } from "./RefreshProgressIndicator";
import type { GroupPost, Profile } from "../hooks/types/groupPostTypes";
import { useEffect, useState } from "react";

interface FeedContainerProps {
  loading: boolean;
  refreshing?: boolean;
  error: string | null;
  posts: GroupPost[];
  user: Profile | null;
  groupId: string;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
  refreshPosts: () => void;
  onPostCreated: () => void;
  onPostUpdated: () => void;
  onPostDeleted: () => void;
}

export const FeedContainer = ({ 
  loading, 
  refreshing = false,
  error, 
  posts, 
  user,
  groupId,
  membershipStatus,
  refreshPosts,
  onPostCreated,
  onPostUpdated,
  onPostDeleted
}: FeedContainerProps) => {
  // Track previous posts to enable smooth transitions
  const [displayedPosts, setDisplayedPosts] = useState<GroupPost[]>(posts);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Log refresh state changes for debugging
  useEffect(() => {
    console.log("FeedContainer - refreshing state changed:", refreshing);
  }, [refreshing]);

  // Update displayed posts with transition when posts change
  useEffect(() => {
    if (posts.length > 0 && !loading) {
      if (refreshing && displayedPosts.length > 0) {
        setIsTransitioning(true);
        console.log("FeedContainer - starting transition for updated posts");
        
        const timer = setTimeout(() => {
          setDisplayedPosts(posts);
          setIsTransitioning(false);
          console.log("FeedContainer - transition complete, posts updated");
        }, 300);
        
        return () => clearTimeout(timer);
      } else {
        console.log("FeedContainer - updating posts immediately");
        setDisplayedPosts(posts);
      }
    }
  }, [posts, refreshing, loading, displayedPosts.length]);

  const handleRefresh = async () => {
    refreshPosts();
  };

  // Only show loading state on initial load
  if (loading && !refreshing && displayedPosts.length === 0) {
    return (
      <>
        <RefreshProgressIndicator refreshing={refreshing} />
        <FeedLoadingState />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <RefreshProgressIndicator refreshing={refreshing} />
        <FeedErrorState error={error} onRetry={refreshPosts} />
      </>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <RefreshProgressIndicator refreshing={refreshing} />
      
      {membershipStatus.isMember && (
        <div className="flex-shrink-0 px-3 md:px-6">
          <CreatePostForm2 
            groupId={groupId} 
            user={user}
            onPostCreated={onPostCreated}
          />
        </div>
      )}
      
      {displayedPosts.length === 0 ? (
        <GroupPostsEmpty isMember={membershipStatus.isMember} />
      ) : (
        <FeedScrollArea
          posts={displayedPosts}
          user={user}
          isTransitioning={isTransitioning}
          refreshing={refreshing}
          loading={loading}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

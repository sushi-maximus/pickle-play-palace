import { CreatePostForm2 } from "../CreatePostForm2";
import { GroupPostsEmpty } from "../GroupPostsEmpty";
import { FeedLoadingState } from "./FeedLoadingState";
import { FeedErrorState } from "./FeedErrorState";
import { FeedScrollArea } from "./FeedScrollArea";
import { NewPostsBanner } from "./NewPostsBanner";
import { useNewPostsIndicator } from "../hooks/useNewPostsIndicator";
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

  // KISS: Simple new posts indicator
  const { 
    showNewPostsBanner, 
    handleScrollToTop 
  } = useNewPostsIndicator({ 
    posts: displayedPosts, 
    refreshing, 
    loading 
  });

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
    return <FeedLoadingState />;
  }

  // Error state
  if (error) {
    return <FeedErrorState error={error} onRetry={refreshPosts} />;
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* KISS: Simple new posts banner */}
      <NewPostsBanner 
        show={showNewPostsBanner} 
        onScrollToTop={handleScrollToTop}
      />

      {membershipStatus.isMember && (
        <div className="flex-shrink-0">
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

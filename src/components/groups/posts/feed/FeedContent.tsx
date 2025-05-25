
import { CreatePostForm2 } from "../CreatePostForm2";
import { MobilePostCard2 } from "../../mobile/MobilePostCard2";
import { GroupPostsEmpty } from "../GroupPostsEmpty";
import { MobilePostsLoading } from "../../mobile/MobilePostsLoading";
import { RefreshProgressIndicator } from "./RefreshProgressIndicator";
import { OptimizedScrollArea } from "@/components/ui/OptimizedScrollArea";
import { useOptimizedPullToRefresh } from "@/hooks/useOptimizedPullToRefresh";
import { OptimizedPullToRefreshIndicator } from "./OptimizedPullToRefreshIndicator";
import type { GroupPost, Profile } from "../hooks/types/groupPostTypes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

interface FeedContentProps {
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

export const FeedContent = ({ 
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
}: FeedContentProps) => {
  // Track previous posts to enable smooth transitions
  const [displayedPosts, setDisplayedPosts] = useState<GroupPost[]>(posts);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Memoized refresh function
  const memoizedRefreshPosts = useCallback(async () => {
    refreshPosts();
  }, [refreshPosts]);

  // Optimized pull-to-refresh
  const {
    pullDistance,
    isRefreshing: pullRefreshing,
    isPulling,
    bindToElement,
    shouldTrigger
  } = useOptimizedPullToRefresh({
    onRefresh: memoizedRefreshPosts,
    threshold: 80,
    disabled: refreshing || loading
  });

  useEffect(() => {
    if (scrollRef.current) {
      bindToElement(scrollRef.current);
    }
  }, [bindToElement]);

  // Log refresh state changes for debugging
  useEffect(() => {
    console.log("FeedContent - refreshing state changed:", refreshing);
  }, [refreshing]);

  // Update displayed posts with transition when posts change
  useEffect(() => {
    if (posts.length > 0 && !loading) {
      if (refreshing && displayedPosts.length > 0) {
        setIsTransitioning(true);
        console.log("FeedContent - starting transition for updated posts");
        
        const timer = setTimeout(() => {
          setDisplayedPosts(posts);
          setIsTransitioning(false);
          console.log("FeedContent - transition complete, posts updated");
        }, 300);
        
        return () => clearTimeout(timer);
      } else {
        console.log("FeedContent - updating posts immediately");
        setDisplayedPosts(posts);
      }
    }
  }, [posts, refreshing, loading, displayedPosts.length]);

  const isRefreshingState = useMemo(() => 
    refreshing || pullRefreshing, 
    [refreshing, pullRefreshing]
  );

  // Memoized content transform for pull-to-refresh
  const contentTransform = useMemo(() => ({
    transform: isPulling ? `translate3d(0, ${Math.min(pullDistance, 80)}px, 0)` : 'translate3d(0, 0, 0)',
    willChange: isPulling ? 'transform' : 'auto'
  }), [isPulling, pullDistance]);

  // Only show loading state on initial load
  if (loading && !refreshing && displayedPosts.length === 0) {
    return (
      <>
        <RefreshProgressIndicator refreshing={refreshing} />
        <MobilePostsLoading />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <RefreshProgressIndicator refreshing={refreshing} />
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button variant="outline" onClick={refreshPosts}>Try Again</Button>
        </div>
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
        <OptimizedScrollArea 
          className="flex-1" 
          ref={scrollRef}
          enableHardwareAcceleration={true}
        >
          <div className="relative">
            <OptimizedPullToRefreshIndicator
              pullDistance={pullDistance}
              isRefreshing={isRefreshingState}
              isPulling={isPulling}
              shouldTrigger={shouldTrigger}
            />
            
            <div 
              className={cn(
                "space-y-6 pb-6 px-3 md:px-6 transition-opacity duration-300", 
                isTransitioning ? "opacity-50" : "opacity-100"
              )}
              style={contentTransform}
            >
              {displayedPosts.map((post) => {
                console.log("FeedContent - Processing post:", {
                  postId: post.id,
                  postProfiles: post.profiles,
                  userFirstName: post.profiles?.first_name,
                  userLastName: post.profiles?.last_name
                });

                const transformedPost = {
                  id: post.id,
                  content: post.content,
                  created_at: post.created_at,
                  user_id: post.user_id,
                  media_urls: post.media_urls,
                  profiles: {
                    first_name: post.profiles?.first_name || '',
                    last_name: post.profiles?.last_name || '',
                    avatar_url: post.profiles?.avatar_url
                  }
                };

                console.log("FeedContent - Transformed post:", transformedPost);

                return (
                  <MobilePostCard2 
                    key={post.id} 
                    post={transformedPost}
                    user={user}
                    isEditing={false}
                    currentPostId={null}
                    editableContent=""
                    setEditableContent={() => {}}
                    isEditSubmitting={false}
                    onStartEditing={() => {}}
                    onCancelEditing={() => {}}
                    onSaveEditing={() => {}}
                    onDeleteClick={() => {}}
                  />
                );
              })}
            </div>
          </div>
        </OptimizedScrollArea>
      )}
    </div>
  );
};


import { useEffect, useRef, useMemo, memo, useCallback } from "react";
import { MobilePostCard2 } from "./MobilePostCard2";
import { OptimizedScrollArea } from "@/components/ui/OptimizedScrollArea";
import { useOptimizedPullToRefresh } from "@/hooks/useOptimizedPullToRefresh";
import { OptimizedPullToRefreshIndicator } from "../posts/feed/OptimizedPullToRefreshIndicator";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  media_urls?: string[] | null;
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

interface MobilePostsListProps {
  posts: Post[];
  user: Profile | null;
  isEditing: boolean;
  currentPostId: string | null;
  editableContent: string;
  setEditableContent: (content: string) => void;
  isEditSubmitting: boolean;
  onStartEditing: (postId: string, content: string) => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
  onDeleteClick: (postId: string) => void;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
}

const MobilePostsListComponent = ({
  posts,
  user,
  isEditing,
  currentPostId,
  editableContent,
  setEditableContent,
  isEditSubmitting,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onDeleteClick,
  onRefresh,
  refreshing = false
}: MobilePostsListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Memoize the refresh function to prevent recreation on every render
  const memoizedOnRefresh = useMemo(() => 
    onRefresh || (() => Promise.resolve()), 
    [onRefresh]
  );
  
  const {
    pullDistance,
    isRefreshing: pullRefreshing,
    isPulling,
    bindToElement,
    shouldTrigger
  } = useOptimizedPullToRefresh({
    onRefresh: memoizedOnRefresh,
    threshold: 80,
    disabled: refreshing
  });

  // Bind pull-to-refresh to scroll element
  useEffect(() => {
    if (scrollRef.current) {
      bindToElement(scrollRef.current);
    }
  }, [bindToElement]);

  const isRefreshingState = useMemo(() => 
    refreshing || pullRefreshing, 
    [refreshing, pullRefreshing]
  );

  // Create a more efficient posts memoization
  const memoizedPosts = useMemo(() => {
    return posts.map(post => ({
      id: post.id,
      content: post.content,
      created_at: post.created_at,
      user_id: post.user_id,
      media_urls: post.media_urls,
      profiles: post.profiles
    }));
  }, [posts]);

  // Memoize transform style for pull-to-refresh content
  const contentTransform = useMemo(() => ({
    transform: isPulling ? `translate3d(0, ${Math.min(pullDistance, 80)}px, 0)` : 'translate3d(0, 0, 0)',
    willChange: isPulling ? 'transform' : 'auto'
  }), [isPulling, pullDistance]);

  return (
    <OptimizedScrollArea 
      className="h-full w-full" 
      ref={scrollRef}
      enableHardwareAcceleration={true}
    >
      <div className="relative w-full">
        <OptimizedPullToRefreshIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshingState}
          isPulling={isPulling}
          shouldTrigger={shouldTrigger}
        />
        
        <div 
          className="transition-transform duration-200 w-full"
          style={contentTransform}
        >
          <div className="w-full">
            {memoizedPosts.map((post, index) => (
              <div 
                key={post.id}
                className="w-full transform transition-all duration-200 ease-out"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <MobilePostCard2
                  post={post}
                  user={user}
                  isEditing={isEditing && currentPostId === post.id}
                  currentPostId={currentPostId}
                  editableContent={editableContent}
                  setEditableContent={setEditableContent}
                  isEditSubmitting={isEditSubmitting}
                  onStartEditing={onStartEditing}
                  onCancelEditing={onCancelEditing}
                  onSaveEditing={onSaveEditing}
                  onDeleteClick={onDeleteClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </OptimizedScrollArea>
  );
};

// Enhanced memoization
export const MobilePostsList = memo(MobilePostsListComponent, (prevProps, nextProps) => {
  // Check posts length first for quick comparison
  if (prevProps.posts.length !== nextProps.posts.length) {
    return false;
  }

  // Check if any post content has changed
  const postsChanged = prevProps.posts.some((post, index) => {
    const nextPost = nextProps.posts[index];
    return !nextPost || 
           post.id !== nextPost.id || 
           post.content !== nextPost.content ||
           post.created_at !== nextPost.created_at;
  });

  if (postsChanged) {
    return false;
  }

  // Check other critical props
  if (
    prevProps.user?.id !== nextProps.user?.id ||
    prevProps.isEditing !== nextProps.isEditing ||
    prevProps.currentPostId !== nextProps.currentPostId ||
    prevProps.editableContent !== nextProps.editableContent ||
    prevProps.isEditSubmitting !== nextProps.isEditSubmitting ||
    prevProps.refreshing !== nextProps.refreshing
  ) {
    return false;
  }

  return true;
});

MobilePostsListComponent.displayName = "MobilePostsList";

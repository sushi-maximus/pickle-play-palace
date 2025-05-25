
import { useEffect, useRef, useMemo, memo, useCallback } from "react";
import { MobilePostCard2 } from "./MobilePostCard2";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePullToRefresh } from "../posts/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "../posts/feed/PullToRefreshIndicator";
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
  } = usePullToRefresh({
    onRefresh: memoizedOnRefresh,
    threshold: 80
  });

  // Memoize the bindToElement effect dependencies
  const bindToElementCallback = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        bindToElement(viewport);
      }
    }
  }, [bindToElement]);

  useEffect(() => {
    bindToElementCallback();
  }, [bindToElementCallback]);

  const isRefreshingState = useMemo(() => 
    refreshing || pullRefreshing, 
    [refreshing, pullRefreshing]
  );

  // Create a more efficient posts memoization that only changes when post IDs or content changes
  const memoizedPosts = useMemo(() => {
    // Create a stable reference that only changes when the actual content changes
    return posts.map(post => ({
      id: post.id,
      content: post.content,
      created_at: post.created_at,
      user_id: post.user_id,
      media_urls: post.media_urls,
      profiles: post.profiles
    }));
  }, [posts]);

  // Memoize the posts key for comparison
  const postsKey = useMemo(() => 
    posts.map(p => `${p.id}-${p.content}`).join('|'), 
    [posts]
  );

  // Memoize transform style to prevent recalculation
  const transformStyle = useMemo(() => ({
    transform: isPulling ? `translateY(${Math.min(pullDistance, 80)}px)` : 'translateY(0)'
  }), [isPulling, pullDistance]);

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="relative">
        <PullToRefreshIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshingState}
          isPulling={isPulling}
          shouldTrigger={shouldTrigger}
        />
        
        <div 
          className="py-2 transition-transform duration-200 will-change-transform"
          style={transformStyle}
        >
          <div className="space-y-2">
            {memoizedPosts.map((post, index) => (
              <div 
                key={post.id}
                className="transform transition-all duration-200 ease-out"
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
    </ScrollArea>
  );
};

// Enhanced memoization with better change detection
export const MobilePostsList = memo(MobilePostsListComponent, (prevProps, nextProps) => {
  // Create efficient posts comparison by checking lengths first
  if (prevProps.posts.length !== nextProps.posts.length) {
    return false;
  }

  // Check if any post content has changed (most efficient check)
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

  // Check other props
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

  // All checks passed
  return true;
});

MobilePostsListComponent.displayName = "MobilePostsList";

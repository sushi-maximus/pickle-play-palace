
import { useEffect, useRef, useMemo, memo } from "react";
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
  const memoizedOnRefresh = useMemo(() => onRefresh || (() => Promise.resolve()), [onRefresh]);
  
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

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        bindToElement(viewport);
      }
    }
  }, [bindToElement]);

  const isRefreshingState = refreshing || pullRefreshing;

  // Memoize the posts to prevent unnecessary re-renders when posts order doesn't change
  const memoizedPosts = useMemo(() => posts, [posts.map(p => p.id).join(','), posts.length]);

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
          style={{
            transform: isPulling ? `translateY(${Math.min(pullDistance, 80)}px)` : 'translateY(0)'
          }}
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

// Memoize the component to prevent unnecessary re-renders
export const MobilePostsList = memo(MobilePostsListComponent, (prevProps, nextProps) => {
  // Custom comparison for better performance
  const postsChanged = prevProps.posts.length !== nextProps.posts.length ||
    prevProps.posts.some((post, index) => 
      post.id !== nextProps.posts[index]?.id ||
      post.content !== nextProps.posts[index]?.content
    );

  return (
    !postsChanged &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.currentPostId === nextProps.currentPostId &&
    prevProps.editableContent === nextProps.editableContent &&
    prevProps.isEditSubmitting === nextProps.isEditSubmitting &&
    prevProps.refreshing === nextProps.refreshing
  );
});

MobilePostsListComponent.displayName = "MobilePostsList";

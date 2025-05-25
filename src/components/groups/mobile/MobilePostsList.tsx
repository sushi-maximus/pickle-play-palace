
import { useEffect, useRef } from "react";
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

export const MobilePostsList = ({
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
  
  const {
    pullDistance,
    isRefreshing: pullRefreshing,
    isPulling,
    bindToElement,
    shouldTrigger
  } = usePullToRefresh({
    onRefresh: onRefresh || (() => Promise.resolve()),
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
          className="px-1 py-4 transition-transform duration-200 will-change-transform"
          style={{
            transform: isPulling ? `translateY(${Math.min(pullDistance, 80)}px)` : 'translateY(0)'
          }}
        >
          <div className="space-y-6">
            {posts.map((post, index) => (
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

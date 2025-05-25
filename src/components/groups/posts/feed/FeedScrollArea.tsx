
import { useRef, useEffect } from "react";
import { OptimizedScrollArea } from "@/components/ui/OptimizedScrollArea";
import { useOptimizedPullToRefresh } from "@/hooks/useOptimizedPullToRefresh";
import { OptimizedPullToRefreshIndicator } from "./OptimizedPullToRefreshIndicator";
import { PostsList } from "./PostsList";
import type { GroupPost, Profile } from "../hooks/types/groupPostTypes";

interface FeedScrollAreaProps {
  posts: GroupPost[];
  user: Profile | null;
  isTransitioning: boolean;
  refreshing: boolean;
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export const FeedScrollArea = ({ 
  posts, 
  user, 
  isTransitioning, 
  refreshing, 
  loading,
  onRefresh 
}: FeedScrollAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const {
    pullDistance,
    isRefreshing: pullRefreshing,
    isPulling,
    bindToElement,
    shouldTrigger
  } = useOptimizedPullToRefresh({
    onRefresh,
    threshold: 80,
    disabled: refreshing || loading
  });

  useEffect(() => {
    if (scrollRef.current) {
      bindToElement(scrollRef.current);
    }
  }, [bindToElement]);

  const isRefreshingState = refreshing || pullRefreshing;

  const contentTransform = {
    transform: isPulling ? `translate3d(0, ${Math.min(pullDistance, 80)}px, 0)` : 'translate3d(0, 0, 0)',
    willChange: isPulling ? 'transform' : 'auto'
  } as React.CSSProperties;

  return (
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
        
        <PostsList
          posts={posts}
          user={user}
          isTransitioning={isTransitioning}
          contentTransform={contentTransform}
        />
      </div>
    </OptimizedScrollArea>
  );
};

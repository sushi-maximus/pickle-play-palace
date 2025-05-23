
import { Card, CardContent } from "@/components/ui/card";
import { useGroupPosts } from "./hooks/useGroupPosts";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { useEffect, useRef } from "react";
import { FeedHeader, LastRefreshIndicator, FeedContent } from "./feed";

interface GroupPostsFeedProps {
  groupId: string;
  user: any;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
  standalone?: boolean;
}

export const GroupPostsFeed = ({ 
  groupId, 
  user, 
  membershipStatus,
  standalone = false
}: GroupPostsFeedProps) => {
  const { 
    posts, 
    loading, 
    refreshing, // Access the new refreshing state
    error, 
    groupName, 
    refreshPosts 
  } = useGroupPosts({ 
    groupId, 
    userId: user?.id 
  });

  // Intersection Observer ref for checking if component is in viewport
  const feedRef = useRef<HTMLDivElement>(null);
  const isInViewportRef = useRef(true);

  const {
    isAutoRefreshEnabled,
    isRefreshing,
    lastAutoRefresh,
    nextRefreshIn,
    toggleAutoRefresh,
    handleManualRefresh
  } = useAutoRefresh({
    refreshFunction: refreshPosts,
    loading: loading || refreshing // Consider either loading or refreshing for auto-refresh logic
  });

  const handlePostCreated = () => {
    refreshPosts();
  };
  
  const handlePostUpdated = () => {
    refreshPosts();
  };
  
  const handlePostDeleted = () => {
    refreshPosts();
  };

  // Set up intersection observer to detect if feed is visible
  useEffect(() => {
    // Skip for non-standalone feeds or if IntersectionObserver is not available
    if (!standalone || !feedRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInViewportRef.current = entry.isIntersecting;
        console.log(`Feed visibility changed: ${isInViewportRef.current ? 'visible' : 'hidden'}`);
      });
    }, { threshold: 0.1 }); // 10% visibility threshold

    observer.observe(feedRef.current);

    return () => {
      observer.disconnect();
    };
  }, [standalone]);

  useEffect(() => {
    // Focus on creating a post when component mounts
    const textareaElement = document.querySelector('textarea');
    if (textareaElement && membershipStatus.isMember) {
      setTimeout(() => {
        textareaElement.focus();
      }, 500);
    }
  }, [membershipStatus.isMember]);

  const renderContent = () => (
    <FeedContent
      loading={loading}
      refreshing={refreshing} // Pass the new refreshing state
      error={error}
      posts={posts}
      user={user}
      groupId={groupId}
      membershipStatus={membershipStatus}
      refreshPosts={refreshPosts}
      onPostCreated={handlePostCreated}
      onPostUpdated={handlePostUpdated}
      onPostDeleted={handlePostDeleted}
    />
  );

  // If standalone, wrap in a card
  if (standalone) {
    return (
      <Card ref={feedRef} className="w-full mb-6 overflow-hidden border-2 border-primary/10 shadow-lg">
        <FeedHeader
          groupName={groupName}
          isRefreshing={isRefreshing || refreshing} // Update with new refreshing state
          loading={loading}
          isAutoRefreshEnabled={isAutoRefreshEnabled}
          toggleAutoRefresh={toggleAutoRefresh}
          handleRefresh={handleManualRefresh}
        />
        
        <LastRefreshIndicator 
          loading={loading} 
          refreshing={refreshing} // Pass the new refreshing state
          lastAutoRefresh={lastAutoRefresh} 
          isAutoRefreshEnabled={isAutoRefreshEnabled}
          nextRefreshIn={nextRefreshIn}
        />
        
        <CardContent className="p-6">
          {renderContent()}
        </CardContent>
      </Card>
    );
  }

  // Otherwise, return just the content (for tabs)
  return renderContent();
};


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
  // ALL hooks must be declared first, before any conditional logic
  const feedRef = useRef<HTMLDivElement>(null);
  const isInViewportRef = useRef(true);

  const { 
    posts, 
    loading, 
    refreshing: postsRefreshing,
    error, 
    groupName, 
    refreshPosts 
  } = useGroupPosts({ 
    groupId, 
    userId: user?.id 
  });

  const {
    isAutoRefreshEnabled,
    isRefreshing: autoRefreshRunning,
    lastAutoRefresh,
    nextRefreshIn,
    toggleAutoRefresh,
    handleManualRefresh
  } = useAutoRefresh({
    refreshFunction: refreshPosts,
    loading: loading
  });

  // Combine both refresh indicators
  const isRefreshing = postsRefreshing || autoRefreshRunning;

  // Event handlers
  const handlePostCreated = () => {
    console.log("Post created, refreshing...");
    refreshPosts();
  };
  
  const handlePostUpdated = () => {
    console.log("Post updated, refreshing...");
    refreshPosts();
  };
  
  const handlePostDeleted = () => {
    console.log("Post deleted, refreshing...");
    refreshPosts();
  };

  // Effects after all hooks and refs are declared
  useEffect(() => {
    if (!standalone || !feedRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInViewportRef.current = entry.isIntersecting;
        console.log(`Feed visibility changed: ${isInViewportRef.current ? 'visible' : 'hidden'}`);
      });
    }, { threshold: 0.1 });

    observer.observe(feedRef.current);

    return () => {
      observer.disconnect();
    };
  }, [standalone]);

  useEffect(() => {
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
      refreshing={isRefreshing}
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

  if (standalone) {
    return (
      <Card ref={feedRef} className="w-full mb-6 overflow-hidden border-2 border-primary/10 shadow-lg">
        <FeedHeader
          groupName={groupName}
          isRefreshing={isRefreshing}
          loading={loading}
          isAutoRefreshEnabled={isAutoRefreshEnabled}
          toggleAutoRefresh={toggleAutoRefresh}
          handleRefresh={handleManualRefresh}
        />
        
        <LastRefreshIndicator 
          loading={loading} 
          refreshing={isRefreshing}
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

  return renderContent();
};

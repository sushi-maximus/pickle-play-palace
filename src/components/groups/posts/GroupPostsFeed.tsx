import { Card, CardContent } from "@/components/ui/card";
import { useGroupPosts } from "./hooks/useGroupPosts";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { useEffect } from "react";
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
    error, 
    groupName, 
    refreshPosts 
  } = useGroupPosts({ 
    groupId, 
    userId: user?.id 
  });

  const {
    isAutoRefreshEnabled,
    isRefreshing,
    lastAutoRefresh,
    toggleAutoRefresh,
    handleManualRefresh
  } = useAutoRefresh({
    refreshFunction: refreshPosts,
    loading
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
      <Card className="w-full mb-6 overflow-hidden border-2 border-primary/10 shadow-lg">
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
          lastAutoRefresh={lastAutoRefresh} 
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

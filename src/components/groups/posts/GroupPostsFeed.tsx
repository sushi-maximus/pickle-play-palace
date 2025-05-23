
import { CreatePostForm } from "./CreatePostForm";
import { GroupPostCard } from "./GroupPostCard";
import { GroupPostsLoading } from "./GroupPostsLoading";
import { GroupPostsEmpty } from "./GroupPostsEmpty";
import { useGroupPosts } from "./hooks/useGroupPosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, RefreshCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Auto-refresh state variables
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date | null>(null);
  const autoRefreshInterval = 30000; // 30 seconds in milliseconds
  
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPosts();
    setTimeout(() => setIsRefreshing(false), 500); // Give visual feedback
  };

  const handlePostCreated = () => {
    refreshPosts();
  };
  
  const handlePostUpdated = () => {
    refreshPosts();
  };
  
  const handlePostDeleted = () => {
    refreshPosts();
  };

  const toggleAutoRefresh = () => {
    const newValue = !isAutoRefreshEnabled;
    setIsAutoRefreshEnabled(newValue);
    toast({
      title: newValue ? "Auto-refresh enabled" : "Auto-refresh disabled",
      description: newValue 
        ? "Posts will automatically refresh every 30 seconds" 
        : "Posts will only refresh when you click the refresh button",
      duration: 3000
    });
  };

  // Auto-refresh effect
  useEffect(() => {
    // Don't set up auto-refresh if it's disabled
    if (!isAutoRefreshEnabled) return;
    
    console.log("Setting up auto-refresh interval");
    
    // Set up the interval for auto-refresh
    const intervalId = setInterval(async () => {
      if (isAutoRefreshEnabled && !loading) {
        console.log("Auto-refreshing posts");
        await refreshPosts();
        setLastAutoRefresh(new Date());
      }
    }, autoRefreshInterval);
    
    // Clean up the interval when the component unmounts
    return () => {
      console.log("Cleaning up auto-refresh interval");
      clearInterval(intervalId);
    };
  }, [isAutoRefreshEnabled, loading, refreshPosts, autoRefreshInterval]);

  useEffect(() => {
    // Focus on creating a post when component mounts
    const textareaElement = document.querySelector('textarea');
    if (textareaElement && membershipStatus.isMember) {
      setTimeout(() => {
        textareaElement.focus();
      }, 500);
    }
  }, [membershipStatus.isMember]);

  const renderContent = () => {
    // Loading state
    if (loading) {
      return <GroupPostsLoading />;
    }

    // Error state
    if (error) {
      return (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button variant="outline" onClick={refreshPosts}>Try Again</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {membershipStatus.isMember && (
          <CreatePostForm 
            groupId={groupId} 
            user={user}
            onPostCreated={handlePostCreated}
          />
        )}
        
        {posts.length === 0 ? (
          <GroupPostsEmpty isMember={membershipStatus.isMember} />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {posts.map((post) => (
              <GroupPostCard 
                key={post.id} 
                post={post}
                currentUserId={user?.id}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Display last refresh time
  const formatLastRefreshTime = () => {
    if (!lastAutoRefresh) return "Never refreshed";
    
    // Format time in a user-friendly way (e.g., "5:30 PM")
    return lastAutoRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If standalone, wrap in a card
  if (standalone) {
    return (
      <Card className="w-full mb-6 overflow-hidden border-2 border-primary/10 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <CardTitle>{groupName ? `${groupName} Discussion` : 'Group Discussion'}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {/* Auto-refresh toggle button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAutoRefresh}
              className={`hover:bg-primary/10 ${isAutoRefreshEnabled ? 'text-primary' : 'text-muted-foreground'}`}
              title={isAutoRefreshEnabled ? "Disable auto-refresh" : "Enable auto-refresh"}
            >
              <Clock className={`h-4 w-4 ${isAutoRefreshEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="ml-1 sr-only md:not-sr-only">
                {isAutoRefreshEnabled ? "Auto" : "Manual"}
              </span>
            </Button>

            {/* Manual refresh button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="hover:bg-primary/10"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="ml-1 sr-only md:not-sr-only">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        
        {/* Last refresh indicator */}
        <div className="px-6 pt-3 pb-0 flex justify-end items-center text-xs text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last updated: {formatLastRefreshTime()}</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          {renderContent()}
        </CardContent>
      </Card>
    );
  }

  // Otherwise, return just the content (for tabs)
  return renderContent();
};

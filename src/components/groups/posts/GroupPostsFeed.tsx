
import { CreatePostForm } from "./CreatePostForm";
import { GroupPostCard } from "./GroupPostCard";
import { GroupPostsLoading } from "./GroupPostsLoading";
import { GroupPostsEmpty } from "./GroupPostsEmpty";
import { useGroupPosts } from "./hooks/useGroupPosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

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

  // If standalone, wrap in a card
  if (standalone) {
    return (
      <Card className="w-full mb-6 overflow-hidden border-2 border-primary/10 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <CardTitle>{groupName ? `${groupName} Discussion` : 'Group Discussion'}</CardTitle>
          </div>
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
        </CardHeader>
        <CardContent className="p-6">
          {renderContent()}
        </CardContent>
      </Card>
    );
  }

  // Otherwise, return just the content (for tabs)
  return renderContent();
};

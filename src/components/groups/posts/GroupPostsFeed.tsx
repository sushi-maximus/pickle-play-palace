import { CreatePostForm } from "./CreatePostForm";
import { GroupPostCard } from "./GroupPostCard";
import { GroupPostsLoading } from "./GroupPostsLoading";
import { GroupPostsEmpty } from "./GroupPostsEmpty";
import { useGroupPosts } from "./hooks/useGroupPosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handlePostCreated = () => {
    refreshPosts();
  };
  
  const handlePostUpdated = () => {
    refreshPosts();
  };
  
  const handlePostDeleted = () => {
    refreshPosts();
  };

  const renderContent = () => {
    // Loading state
    if (loading) {
      return <GroupPostsLoading />;
    }

    // Error state
    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
      <div>
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
          <div>
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
      <Card className="w-full mb-6 overflow-hidden bg-gradient-to-r from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle>Posts{groupName ? ` - ${groupName}` : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    );
  }

  // Otherwise, return just the content (for tabs)
  return renderContent();
};

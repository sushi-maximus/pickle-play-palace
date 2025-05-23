
import { CreatePostForm } from "../CreatePostForm";
import { GroupPostCard } from "../GroupPostCard";
import { GroupPostsEmpty } from "../GroupPostsEmpty";
import { GroupPostsLoading } from "../GroupPostsLoading";
import type { GroupPost } from "../hooks/useGroupPosts";
import { Button } from "@/components/ui/button";

interface FeedContentProps {
  loading: boolean;
  error: string | null;
  posts: GroupPost[];
  user: any;
  groupId: string;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
  refreshPosts: () => void;
  onPostCreated: () => void;
  onPostUpdated: () => void;
  onPostDeleted: () => void;
}

export const FeedContent = ({ 
  loading, 
  error, 
  posts, 
  user,
  groupId,
  membershipStatus,
  refreshPosts,
  onPostCreated,
  onPostUpdated,
  onPostDeleted
}: FeedContentProps) => {
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
          onPostCreated={onPostCreated}
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
              onPostUpdated={onPostUpdated}
              onPostDeleted={onPostDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

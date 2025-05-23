import { CreatePostForm } from "../CreatePostForm";
import { GroupPostCard } from "../GroupPostCard";
import { GroupPostsEmpty } from "../GroupPostsEmpty";
import { GroupPostsLoading } from "../GroupPostsLoading";
import type { GroupPost } from "../hooks/useGroupPosts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FeedContentProps {
  loading: boolean;
  refreshing?: boolean; // New optional prop for background refreshes
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
  refreshing = false, // Default to false
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
  // Only show loading state on initial load
  // For refreshes, we'll keep displaying the existing content
  if (loading && !refreshing && posts.length === 0) {
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
          {/* Show a subtle refreshing indicator at the top if actively refreshing */}
          {refreshing && (
            <div className="flex items-center justify-center text-xs text-muted-foreground py-1">
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Updating content...
            </div>
          )}
          
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

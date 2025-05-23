import { CreatePostForm } from "../CreatePostForm";
import { GroupPostCard } from "../GroupPostCard";
import { GroupPostsEmpty } from "../GroupPostsEmpty";
import { GroupPostsLoading } from "../GroupPostsLoading";
import { RefreshProgressIndicator } from "./RefreshProgressIndicator";
import type { GroupPost } from "../hooks/useGroupPosts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FeedContentProps {
  loading: boolean;
  refreshing?: boolean;
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
  refreshing = false,
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
      {/* Add the progress indicator at the top */}
      <RefreshProgressIndicator refreshing={refreshing} />
      
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
          {/* Remove the old refreshing indicator and rely on the progress bar */}
          
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

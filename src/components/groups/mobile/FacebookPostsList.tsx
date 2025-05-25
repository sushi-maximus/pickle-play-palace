
import { memo } from "react";
import { FacebookPostCard } from "./FacebookPostCard";
import { FacebookEmptyState } from "./FacebookEmptyState";
import { FacebookErrorState } from "./FacebookErrorState";
import type { GroupPost, Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookPostsListProps {
  posts: GroupPost[];
  user: Profile | null;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  onCreatePost?: () => void;
}

const FacebookPostsListComponent = ({
  posts,
  user,
  loading,
  error,
  onRetry,
  onCreatePost
}: FacebookPostsListProps) => {
  console.log("FacebookPostsList - Rendering with:", {
    postsCount: posts?.length || 0,
    loading,
    error: error?.message,
    userId: user?.id
  });

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <FacebookErrorState
          error={error}
          onRetry={onRetry}
          title="Failed to Load Posts"
          description="We couldn't load the posts for this group. Please check your connection and try again."
          variant="network"
        />
      </div>
    );
  }

  // Empty state when no posts available
  if (!loading && (!posts || posts.length === 0)) {
    return (
      <div className="w-full">
        <FacebookEmptyState 
          onCreatePost={onCreatePost}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-0">
      {posts.map((post, index) => (
        <div key={post.id} className="w-full">
          <FacebookPostCard
            post={post}
            user={user}
            index={index}
          />
        </div>
      ))}
    </div>
  );
};

export const FacebookPostsList = memo(FacebookPostsListComponent);

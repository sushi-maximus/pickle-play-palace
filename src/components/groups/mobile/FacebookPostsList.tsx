
import { memo } from "react";
import { FacebookPostCard } from "./FacebookPostCard";
import { FacebookEmptyState } from "./FacebookEmptyState";
import { FacebookErrorState } from "./FacebookErrorState";
import { FacebookErrorBoundary } from "./FacebookErrorBoundary";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  thumbsup_count?: number;
  user_thumbsup?: boolean;
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

interface FacebookPostsListProps {
  posts: Post[];
  user?: Profile | null;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onCreatePost?: () => void;
}

const FacebookPostsListComponent = ({ 
  posts, 
  user,
  loading = false,
  error = null,
  onRetry,
  onCreatePost
}: FacebookPostsListProps) => {
  // Show error state if there's an error
  if (error && !loading) {
    return (
      <FacebookErrorState
        error={error}
        onRetry={onRetry}
        title="Failed to Load Posts"
        description="We couldn't load the posts for this group. Please check your connection and try again."
        variant="network"
      />
    );
  }

  // Show empty state if no posts and not loading
  if (!loading && (!posts || posts.length === 0)) {
    return (
      <FacebookEmptyState
        type="posts"
        onAction={onCreatePost}
        showAction={!!user && !!onCreatePost}
      />
    );
  }

  // Filter out invalid posts
  const validPosts = posts?.filter(post => 
    post?.id && 
    post?.content && 
    post?.created_at
  ) || [];

  if (validPosts.length === 0 && posts?.length > 0) {
    return (
      <FacebookErrorState
        title="No Valid Posts"
        description="The posts in this group appear to be corrupted. Please try refreshing the page."
        onRetry={onRetry}
        showRetry={!!onRetry}
      />
    );
  }

  return (
    <FacebookErrorBoundary>
      <div className="space-y-4">
        {validPosts.map((post, index) => (
          <div 
            key={post.id}
            className="transform transition-all duration-200 ease-out"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <FacebookPostCard 
              post={post} 
              user={user}
            />
          </div>
        ))}
      </div>
    </FacebookErrorBoundary>
  );
};

export const FacebookPostsList = memo(FacebookPostsListComponent);

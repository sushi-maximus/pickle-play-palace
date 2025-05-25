
import { memo } from "react";
import { FacebookPostCard } from "./FacebookPostCard";
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
}

const FacebookPostsListComponent = ({ posts, user }: FacebookPostsListProps) => {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-500 mb-2">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600 text-sm">
          Be the first to share something with your group!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <FacebookPostCard 
          key={post.id} 
          post={post} 
          user={user}
        />
      ))}
    </div>
  );
};

export const FacebookPostsList = memo(FacebookPostsListComponent);

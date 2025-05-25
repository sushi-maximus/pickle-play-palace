
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useUnifiedPostReactions } from "./hooks/useUnifiedPostReactions";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookPostCardProps {
  post: {
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
  };
  user?: Profile | null;
}

const FacebookPostCardComponent = ({ post, user }: FacebookPostCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  
  const {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp,
    isDisabled
  } = useUnifiedPostReactions({ 
    post: {
      ...post,
      thumbsup_count: post.thumbsup_count || 0,
      thumbsdown_count: 0,
      heart_count: 0,
      user_thumbsup: post.user_thumbsup || false,
      user_thumbsdown: false,
      user_heart: false
    }, 
    user 
  });

  const handleLikeClick = () => {
    if (!isDisabled && !isThumbsUpSubmitting) {
      toggleThumbsUp();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div>
            <div className="font-semibold text-sm text-gray-900">
              {post.profiles?.first_name} {post.profiles?.last_name}
            </div>
            <div className="text-xs text-gray-500">{timeAgo}</div>
          </div>
        </div>
        <div className="text-gray-400 text-lg">•••</div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-gray-900 text-sm leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Reaction Summary */}
      {thumbsUpCount > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="text-blue-500">👍</span>
              <span>{thumbsUpCount} {thumbsUpCount === 1 ? 'like' : 'likes'}</span>
            </div>
            <div>0 comments</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex border-t border-gray-100">
        <button 
          onClick={handleLikeClick}
          disabled={isDisabled || isThumbsUpSubmitting}
          className={`flex-1 flex items-center justify-center py-3 transition-colors ${
            isThumbsUpActive 
              ? "text-blue-600 bg-blue-50" 
              : "text-gray-600 hover:bg-gray-50"
          } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="text-lg mr-2">👍</span>
          <span className="text-sm font-medium">
            {isThumbsUpSubmitting ? "..." : isThumbsUpActive ? "Liked" : "Like"}
          </span>
        </button>
        <button className="flex-1 flex items-center justify-center py-3 text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-100">
          <span className="text-lg mr-2">💬</span>
          <span className="text-sm font-medium">Comment</span>
        </button>
      </div>
    </div>
  );
};

export const FacebookPostCard = memo(FacebookPostCardComponent);

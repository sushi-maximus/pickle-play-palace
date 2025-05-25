
import { memo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useFacebookLike } from "./hooks/useFacebookLike";
import { FacebookReactionSummary } from "./FacebookReactionSummary";
import { FacebookActionBar } from "./FacebookActionBar";
import { FacebookComments } from "./FacebookComments";
import { useComments2 } from "../posts/hooks/useComments2";
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
  const [showComments, setShowComments] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  
  const {
    likeCount,
    isLiked,
    isSubmitting,
    toggleLike,
    isDisabled
  } = useFacebookLike({ 
    postId: post.id,
    userId: user?.id,
    initialLikeCount: post.thumbsup_count || 0,
    initialUserLiked: post.user_thumbsup || false
  });

  const { comments } = useComments2({
    postId: post.id,
    userId: user?.id
  });

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleCommentAdded = () => {
    // Comments will auto-refresh through the hook
    console.log("Comment added to post:", post.id);
  };

  const commentsCount = comments?.length || 0;

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
      <FacebookReactionSummary
        likeCount={likeCount}
        commentsCount={commentsCount}
        isUserLiked={isLiked}
        user={user}
      />

      {/* Facebook Action Bar */}
      <FacebookActionBar
        postId={post.id}
        isLiked={isLiked}
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        onLikeClick={toggleLike}
        onCommentClick={handleCommentClick}
        user={user}
      />

      {/* Comments Section */}
      {showComments && (
        <FacebookComments
          postId={post.id}
          user={user}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export const FacebookPostCard = memo(FacebookPostCardComponent);

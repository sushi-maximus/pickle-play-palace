
import { memo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useFacebookLike } from "./hooks/useFacebookLike";
import { FacebookReactionSummary } from "./FacebookReactionSummary";
import { FacebookActionBar } from "./FacebookActionBar";
import { FacebookComments } from "./FacebookComments";
import { FacebookErrorBoundary } from "./FacebookErrorBoundary";
import { FacebookErrorState } from "./FacebookErrorState";
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
  const [hasError, setHasError] = useState(false);
  
  // Validate required data
  if (!post?.id || !post?.content) {
    return (
      <FacebookErrorState
        title="Invalid Post Data"
        description="This post appears to be corrupted or incomplete."
        showRetry={false}
        variant="generic"
      />
    );
  }

  let timeAgo: string;
  try {
    timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    timeAgo = 'Unknown time';
  }
  
  const {
    likeCount,
    isLiked,
    isSubmitting,
    toggleLike,
    isDisabled,
    error: likeError
  } = useFacebookLike({ 
    postId: post.id,
    userId: user?.id,
    initialLikeCount: post.thumbsup_count || 0,
    initialUserLiked: post.user_thumbsup || false
  });

  const { comments, error: commentsError } = useComments2({
    postId: post.id,
    userId: user?.id
  });

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleCommentAdded = () => {
    console.log("Comment added to post:", post.id);
  };

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  // Show error state if there's a critical error
  if (hasError || (likeError && !isSubmitting)) {
    return (
      <FacebookErrorState
        error={likeError}
        onRetry={handleRetry}
        title="Failed to Load Post"
        description="There was a problem loading this post. Please try again."
      />
    );
  }

  const commentsCount = comments?.length || 0;
  const authorName = post.profiles ? 
    `${post.profiles.first_name} ${post.profiles.last_name}`.trim() || 'Unknown User' : 
    'Unknown User';

  // Convert string error to Error object if needed
  const commentsErrorObject = commentsError ? new Error(commentsError) : null;

  return (
    <FacebookErrorBoundary
      onError={(error) => {
        console.error('Post card error:', error);
        setHasError(true);
      }}
    >
      <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in overflow-hidden mx-3 sm:mx-0 rounded-lg sm:rounded-lg">
        {/* Post Header - Enhanced for mobile with proper touch targets */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0 animate-scale-in"></div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm sm:text-base text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer truncate">
                {authorName}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{timeAgo}</div>
            </div>
          </div>
          <button className="text-gray-400 text-lg hover:text-gray-600 cursor-pointer transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center">
            •••
          </button>
        </div>

        {/* Post Content - Enhanced readability on mobile */}
        <div className="px-4 py-3">
          <p className="text-gray-900 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
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
          isDisabled={isDisabled || !!likeError}
          onLikeClick={toggleLike}
          onCommentClick={handleCommentClick}
          user={user}
        />

        {/* Comments Section - Enhanced for mobile */}
        {showComments && (
          <div className="animate-fade-in">
            {commentsErrorObject ? (
              <div className="p-4 border-t border-gray-200">
                <FacebookErrorState
                  error={commentsErrorObject}
                  title="Failed to Load Comments"
                  description="Comments couldn't be loaded. Please try again."
                  onRetry={() => window.location.reload()}
                  variant="network"
                />
              </div>
            ) : (
              <FacebookComments
                postId={post.id}
                user={user}
                onCommentAdded={handleCommentAdded}
              />
            )}
          </div>
        )}
      </div>
    </FacebookErrorBoundary>
  );
};

export const FacebookPostCard = memo(FacebookPostCardComponent);

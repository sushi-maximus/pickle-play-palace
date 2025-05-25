
import { memo } from "react";
import { ThumbsUp, MessageCircle, Share } from "lucide-react";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookActionBarProps {
  postId: string;
  isLiked: boolean;
  isSubmitting: boolean;
  isDisabled: boolean;
  onLikeClick: () => void;
  onCommentClick: () => void;
  user?: Profile | null;
  likeCount?: number;
  commentsCount?: number;
}

const FacebookActionBarComponent = ({
  postId,
  isLiked,
  isSubmitting,
  isDisabled,
  onLikeClick,
  onCommentClick,
  user,
  likeCount = 0,
  commentsCount = 0
}: FacebookActionBarProps) => {
  const handleLikeClick = () => {
    if (!isDisabled && !isSubmitting && user) {
      onLikeClick();
    }
  };

  const handleCommentClick = () => {
    if (user) {
      onCommentClick();
    }
  };

  const handleShareClick = () => {
    // Placeholder for share functionality
    console.log("Share clicked for post:", postId);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getLikeText = () => {
    if (likeCount === 0) {
      return isLiked ? 'Liked' : 'Like';
    } else if (likeCount === 1) {
      return '1 like';
    } else {
      return `${formatCount(likeCount)} likes`;
    }
  };

  const getCommentText = () => {
    if (commentsCount === 0) {
      return 'Comment';
    } else if (commentsCount === 1) {
      return '1 comment';
    } else {
      return `${formatCount(commentsCount)} comments`;
    }
  };

  return (
    <div className="flex items-center border-t border-gray-200 bg-gray-50">
      {/* Like Button */}
      <button
        onClick={handleLikeClick}
        disabled={isDisabled || isSubmitting || !user}
        className={`flex-1 flex items-center justify-center py-3 sm:py-4 min-h-[52px] transition-all duration-200 touch-manipulation active:scale-95 ${
          isLiked 
            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        } ${
          (isDisabled || !user) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center space-x-2">
          <ThumbsUp 
            className={`h-5 w-5 transition-transform duration-200 ${
              isSubmitting ? 'animate-pulse' : ''
            } ${
              isLiked ? 'fill-current' : ''
            }`} 
          />
          <span className="font-medium text-sm sm:text-base">
            {getLikeText()}
          </span>
        </div>
      </button>

      {/* Comment Button */}
      <button
        onClick={handleCommentClick}
        disabled={!user}
        className={`flex-1 flex items-center justify-center py-3 sm:py-4 min-h-[52px] text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 touch-manipulation active:scale-95 ${
          !user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium text-sm sm:text-base">
            {getCommentText()}
          </span>
        </div>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShareClick}
        className="flex-1 flex items-center justify-center py-3 sm:py-4 min-h-[52px] text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <Share className="h-5 w-5" />
          <span className="font-medium text-sm sm:text-base">Share</span>
        </div>
      </button>
    </div>
  );
};

export const FacebookActionBar = memo(FacebookActionBarComponent);

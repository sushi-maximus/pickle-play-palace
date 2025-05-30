
import { memo } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
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
    <div className="flex items-center bg-white">
      {/* Like Button */}
      <button
        onClick={handleLikeClick}
        disabled={isDisabled || isSubmitting || !user}
        className={`flex-1 flex items-center justify-center py-2 sm:py-3 min-h-[44px] transition-all duration-200 touch-manipulation active:scale-95 ${
          isLiked 
            ? 'text-gray-800' 
            : 'text-gray-600 hover:text-gray-800'
        } ${
          (isDisabled || !user) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center space-x-2">
          <ThumbsUp 
            className={`h-4 w-4 transition-transform duration-200 ${
              isSubmitting ? 'animate-pulse' : ''
            } ${
              isLiked ? 'fill-current' : ''
            }`} 
          />
          <span className="font-medium text-xs sm:text-sm">
            {getLikeText()}
          </span>
        </div>
      </button>

      {/* Comment Button */}
      <button
        onClick={handleCommentClick}
        disabled={!user}
        className={`flex-1 flex items-center justify-center py-2 sm:py-3 min-h-[44px] text-gray-600 hover:text-gray-800 transition-all duration-200 touch-manipulation active:scale-95 ${
          !user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium text-xs sm:text-sm">
            {getCommentText()}
          </span>
        </div>
      </button>
    </div>
  );
};

export const FacebookActionBar = memo(FacebookActionBarComponent);


import { memo } from "react";
import { ThumbsUp, MessageCircle, Share } from "lucide-react";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookActionBarProps {
  postId: string;
  isLiked: boolean;
  isSubmitting: boolean;
  isDisabled: boolean;
  onLikeClick: () => void;
  onCommentClick?: () => void;
  user?: Profile | null;
}

const FacebookActionBarComponent = ({
  postId,
  isLiked,
  isSubmitting,
  isDisabled,
  onLikeClick,
  onCommentClick,
  user
}: FacebookActionBarProps) => {
  
  const handleLikeClick = () => {
    if (!isDisabled && !isSubmitting) {
      onLikeClick();
    }
  };

  const handleCommentClick = () => {
    onCommentClick?.();
  };

  const handleShareClick = () => {
    // Placeholder for share functionality
    console.log("Share clicked for post:", postId);
  };

  return (
    <div className="flex border-t border-gray-100">
      {/* Like Button */}
      <button 
        onClick={handleLikeClick}
        disabled={isDisabled || isSubmitting}
        className={`flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors hover:bg-gray-50 ${
          isLiked 
            ? "text-blue-600" 
            : "text-gray-600"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsUp className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
        <span>
          {isSubmitting ? "..." : "Like"}
        </span>
      </button>

      {/* Comment Button */}
      <button 
        onClick={handleCommentClick}
        className="flex-1 flex items-center justify-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-100"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        <span>Comment</span>
      </button>

      {/* Share Button */}
      <button 
        onClick={handleShareClick}
        className="flex-1 flex items-center justify-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-100"
      >
        <Share className="h-4 w-4 mr-2" />
        <span>Share</span>
      </button>
    </div>
  );
};

export const FacebookActionBar = memo(FacebookActionBarComponent);

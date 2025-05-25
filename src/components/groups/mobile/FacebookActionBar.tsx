
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
        className={`flex-1 flex items-center justify-center py-3 text-sm font-medium transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 active:scale-95 ${
          isLiked 
            ? "text-blue-600" 
            : "text-gray-600 hover:text-blue-600"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsUp className={`h-4 w-4 mr-2 transition-all duration-200 ${
          isLiked ? "fill-current scale-110" : "hover:scale-110"
        } ${isSubmitting ? "animate-pulse" : ""}`} />
        <span className={`transition-all duration-200 ${isSubmitting ? "animate-pulse" : ""}`}>
          {isSubmitting ? "..." : "Like"}
        </span>
      </button>

      {/* Comment Button */}
      <button 
        onClick={handleCommentClick}
        className="flex-1 flex items-center justify-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 active:bg-gray-100 active:scale-95 transition-all duration-200 border-l border-gray-100"
      >
        <MessageCircle className="h-4 w-4 mr-2 transition-all duration-200 hover:scale-110" />
        <span>Comment</span>
      </button>

      {/* Share Button */}
      <button 
        onClick={handleShareClick}
        className="flex-1 flex items-center justify-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-green-600 active:bg-gray-100 active:scale-95 transition-all duration-200 border-l border-gray-100"
      >
        <Share className="h-4 w-4 mr-2 transition-all duration-200 hover:scale-110" />
        <span>Share</span>
      </button>
    </div>
  );
};

export const FacebookActionBar = memo(FacebookActionBarComponent);

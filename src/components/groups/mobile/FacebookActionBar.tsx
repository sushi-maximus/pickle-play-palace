
import { memo } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookActionBarProps {
  postId: string;
  isLiked: boolean;
  isSubmitting: boolean;
  isDisabled: boolean;
  onLikeClick: () => void;
  onCommentClick: () => void;
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
  
  const handleShare = () => {
    // Placeholder for share functionality
    console.log("Share post:", postId);
  };

  return (
    <div className="flex items-center border-t border-gray-200 bg-white">
      {/* Like Button - Enhanced touch target and mobile responsiveness */}
      <button
        onClick={onLikeClick}
        disabled={isDisabled || !user}
        className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 sm:py-4 transition-all duration-200 min-h-[52px] touch-manipulation active:scale-95 ${
          isLiked
            ? "text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200"
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 active:bg-gray-100"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsUp 
          className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ${
            isLiked ? "fill-current" : ""
          }`} 
        />
        <span className="text-sm sm:text-base font-medium">
          {isSubmitting ? "..." : "Like"}
        </span>
      </button>

      {/* Comment Button - Enhanced for mobile */}
      <button
        onClick={onCommentClick}
        className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 sm:py-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 min-h-[52px] touch-manipulation active:scale-95 active:bg-gray-100"
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-sm sm:text-base font-medium">Comment</span>
      </button>

      {/* Share Button - Enhanced for mobile */}
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 sm:py-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 min-h-[52px] touch-manipulation active:scale-95 active:bg-gray-100"
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-sm sm:text-base font-medium">Share</span>
      </button>
    </div>
  );
};

export const FacebookActionBar = memo(FacebookActionBarComponent);

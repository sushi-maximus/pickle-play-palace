
import { memo } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FacebookCommentReactionsProps {
  thumbsUpCount: number;
  thumbsDownCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  onThumbsUpClick: () => void;
  onThumbsDownClick: () => void;
  disabled?: boolean;
}

const FacebookCommentReactionsComponent = ({
  thumbsUpCount,
  thumbsDownCount,
  isThumbsUpActive,
  isThumbsDownActive,
  isThumbsUpSubmitting,
  isThumbsDownSubmitting,
  onThumbsUpClick,
  onThumbsDownClick,
  disabled = false
}: FacebookCommentReactionsProps) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Thumbs Up */}
      <button
        onClick={onThumbsUpClick}
        disabled={disabled || isThumbsUpSubmitting}
        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
          isThumbsUpActive
            ? "text-blue-600 bg-blue-50 scale-105"
            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsUp className={`h-3 w-3 transition-all duration-200 ${
          isThumbsUpActive ? "fill-current scale-110" : "hover:scale-110"
        } ${isThumbsUpSubmitting ? "animate-pulse" : ""}`} />
        {thumbsUpCount > 0 && (
          <span className={`transition-all duration-200 ${isThumbsUpSubmitting ? "animate-pulse" : ""}`}>
            {thumbsUpCount}
          </span>
        )}
      </button>

      {/* Thumbs Down */}
      <button
        onClick={onThumbsDownClick}
        disabled={disabled || isThumbsDownSubmitting}
        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
          isThumbsDownActive
            ? "text-red-600 bg-red-50 scale-105"
            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsDown className={`h-3 w-3 transition-all duration-200 ${
          isThumbsDownActive ? "fill-current scale-110" : "hover:scale-110"
        } ${isThumbsDownSubmitting ? "animate-pulse" : ""}`} />
        {thumbsDownCount > 0 && (
          <span className={`transition-all duration-200 ${isThumbsDownSubmitting ? "animate-pulse" : ""}`}>
            {thumbsDownCount}
          </span>
        )}
      </button>
    </div>
  );
};

export const FacebookCommentReactions = memo(FacebookCommentReactionsComponent);

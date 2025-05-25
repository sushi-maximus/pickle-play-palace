
import { memo } from "react";
import { ThumbsUp } from "lucide-react";

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
    <div className="flex items-center mt-2 ml-3">
      {/* Thumbs Up - Larger and positioned below comment */}
      <button
        onClick={onThumbsUpClick}
        disabled={disabled || isThumbsUpSubmitting}
        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 min-h-[32px] touch-manipulation ${
          isThumbsUpActive
            ? "text-gray-800"
            : "text-gray-500 hover:text-gray-800"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsUp className={`h-4 w-4 transition-all duration-200 ${
          isThumbsUpActive ? "fill-current scale-110" : "hover:scale-110"
        } ${isThumbsUpSubmitting ? "animate-pulse" : ""}`} />
        {thumbsUpCount > 0 && (
          <span className={`transition-all duration-200 ${isThumbsUpSubmitting ? "animate-pulse" : ""}`}>
            {thumbsUpCount}
          </span>
        )}
      </button>
    </div>
  );
};

export const FacebookCommentReactions = memo(FacebookCommentReactionsComponent);

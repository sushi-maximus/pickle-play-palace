
import { memo } from "react";
import { ThumbsUp } from "lucide-react";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookReactionSummaryProps {
  likeCount: number;
  commentsCount: number;
  isUserLiked: boolean;
  user?: Profile | null;
}

const FacebookReactionSummaryComponent = ({
  likeCount,
  commentsCount,
  isUserLiked,
  user
}: FacebookReactionSummaryProps) => {
  if (likeCount === 0 && commentsCount === 0) {
    return null;
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getLikeText = () => {
    if (likeCount === 0) return "";
    
    if (isUserLiked && user) {
      if (likeCount === 1) {
        return "You";
      } else if (likeCount === 2) {
        return "You and 1 other";
      } else {
        return `You and ${formatCount(likeCount - 1)} others`;
      }
    } else {
      return formatCount(likeCount);
    }
  };

  const getCommentsText = () => {
    if (commentsCount === 0) return "";
    if (commentsCount === 1) return "1 comment";
    return `${formatCount(commentsCount)} comments`;
  };

  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-gray-500 border-b border-gray-100">
      {/* Likes Summary - Enhanced for mobile */}
      {likeCount > 0 && (
        <div className="flex items-center space-x-1 sm:space-x-2 min-h-[32px] touch-manipulation">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <ThumbsUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white fill-current" />
            </div>
            <span className="text-xs sm:text-sm hover:underline cursor-pointer">
              {getLikeText()}
            </span>
          </div>
        </div>
      )}

      {/* Comments Count - Enhanced for mobile */}
      {commentsCount > 0 && (
        <div className="min-h-[32px] flex items-center touch-manipulation">
          <button className="text-xs sm:text-sm hover:underline focus:underline transition-all duration-200 p-1 -m-1">
            {getCommentsText()}
          </button>
        </div>
      )}

      {/* Spacer for better layout */}
      {likeCount === 0 && commentsCount > 0 && <div />}
    </div>
  );
};

export const FacebookReactionSummary = memo(FacebookReactionSummaryComponent);

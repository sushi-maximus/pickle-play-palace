
import { memo } from "react";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookReactionSummaryProps {
  likeCount: number;
  commentsCount?: number;
  isUserLiked?: boolean;
  user?: Profile | null;
}

const FacebookReactionSummaryComponent = ({ 
  likeCount, 
  commentsCount = 0, 
  isUserLiked = false,
  user 
}: FacebookReactionSummaryProps) => {
  // Don't show anything if no reactions or comments
  if (likeCount === 0 && commentsCount === 0) {
    return null;
  }

  const renderLikeText = () => {
    if (likeCount === 0) return null;
    
    if (likeCount === 1) {
      if (isUserLiked) {
        return "You";
      } else {
        return "1 person";
      }
    }
    
    if (isUserLiked) {
      if (likeCount === 2) {
        return "You and 1 other";
      } else {
        return `You and ${likeCount - 1} others`;
      }
    } else {
      return `${likeCount} people`;
    }
  };

  const likeText = renderLikeText();

  return (
    <div className="px-4 py-2 border-t border-gray-100">
      <div className="flex items-center justify-between text-sm text-gray-500">
        {/* Reactions summary */}
        {likeCount > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-blue-500">👍</span>
            <span className="hover:underline cursor-pointer">
              {likeText}
            </span>
          </div>
        )}
        
        {/* Comments summary */}
        {commentsCount > 0 && (
          <div className="hover:underline cursor-pointer">
            {commentsCount === 1 ? "1 comment" : `${commentsCount} comments`}
          </div>
        )}
        
        {/* Show placeholder when no reactions but we want to maintain layout */}
        {likeCount === 0 && commentsCount === 0 && <div></div>}
      </div>
    </div>
  );
};

export const FacebookReactionSummary = memo(FacebookReactionSummaryComponent);

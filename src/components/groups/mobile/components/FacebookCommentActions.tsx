
import { memo } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { FacebookCommentReactions } from "../FacebookCommentReactions";
import type { Profile } from "../../posts/hooks/types/groupPostTypes";

interface FacebookCommentActionsProps {
  timeAgo: string;
  isOwner: boolean;
  isDeleting: boolean;
  user?: Profile | null;
  thumbsUpCount: number;
  thumbsDownCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onThumbsUpClick: () => void;
  onThumbsDownClick: () => void;
}

const FacebookCommentActionsComponent = ({
  timeAgo,
  isOwner,
  isDeleting,
  user,
  thumbsUpCount,
  thumbsDownCount,
  isThumbsUpActive,
  isThumbsDownActive,
  isThumbsUpSubmitting,
  isThumbsDownSubmitting,
  onEdit,
  onDelete,
  onThumbsUpClick,
  onThumbsDownClick
}: FacebookCommentActionsProps) => {
  const handleLikeClick = () => {
    console.log("Like comment clicked");
  };

  const handleReplyClick = () => {
    console.log("Reply to comment clicked");
  };

  return (
    <div className="flex items-center justify-between mt-1 ml-3">
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleLikeClick}
          className="text-xs font-medium text-gray-500 hover:text-blue-600 hover:underline transition-colors"
        >
          Like
        </button>
        
        <button 
          onClick={handleReplyClick}
          className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-blue-600 hover:underline transition-colors"
        >
          <MessageCircle className="h-3 w-3" />
          <span>Reply</span>
        </button>
        
        {isOwner && (
          <>
            <button
              onClick={onEdit}
              className="text-xs font-medium text-gray-500 hover:text-blue-600 hover:underline transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="text-xs font-medium text-gray-500 hover:text-red-600 hover:underline disabled:opacity-50 transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
        
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>

      {/* Comment Reactions */}
      {user && (
        <FacebookCommentReactions
          thumbsUpCount={thumbsUpCount}
          thumbsDownCount={thumbsDownCount}
          isThumbsUpActive={isThumbsUpActive}
          isThumbsDownActive={isThumbsDownActive}
          isThumbsUpSubmitting={isThumbsUpSubmitting}
          isThumbsDownSubmitting={isThumbsDownSubmitting}
          onThumbsUpClick={onThumbsUpClick}
          onThumbsDownClick={onThumbsDownClick}
          disabled={!user?.id}
        />
      )}
    </div>
  );
};

export const FacebookCommentActions = memo(FacebookCommentActionsComponent);

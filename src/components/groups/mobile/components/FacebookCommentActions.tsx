
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
    if (user) {
      onThumbsUpClick();
    }
  };

  const handleReplyClick = () => {
    console.log("Reply to comment clicked");
  };

  return (
    <div className="flex items-center justify-between mt-1 ml-3 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleLikeClick}
          disabled={!user || isThumbsUpSubmitting}
          className={`text-xs font-medium transition-all duration-200 active:scale-95 ${
            isThumbsUpActive 
              ? "text-gray-800" 
              : "text-gray-500 hover:text-gray-800"
          } ${!user ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
        >
          {isThumbsUpActive ? "Liked" : "Like"}
        </button>
        
        <button 
          onClick={handleReplyClick}
          className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-800 hover:underline transition-all duration-200 active:scale-95"
        >
          <MessageCircle className="h-3 w-3 transition-all duration-200 hover:scale-110" />
          <span>Reply</span>
        </button>
        
        {isOwner && (
          <>
            <button
              onClick={onEdit}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 hover:underline transition-all duration-200 active:scale-95"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="text-xs font-medium text-gray-500 hover:text-red-600 hover:underline disabled:opacity-50 transition-all duration-200 active:scale-95"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <div className="animate-spin h-3 w-3 border border-red-500 border-t-transparent rounded-full mr-1"></div>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
          </>
        )}
        
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>

      {/* Comment Reactions */}
      {user && (
        <div className="animate-scale-in">
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
        </div>
      )}
    </div>
  );
};

export const FacebookCommentActions = memo(FacebookCommentActionsComponent);

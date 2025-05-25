
import { memo } from "react";
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
  return (
    <div className="flex items-center justify-between mt-1 ml-3">
      <div className="flex items-center space-x-4">
        <button className="text-xs font-medium text-gray-500 hover:underline">
          Like
        </button>
        <button className="text-xs font-medium text-gray-500 hover:underline">
          Reply
        </button>
        {isOwner && (
          <>
            <button
              onClick={onEdit}
              className="text-xs font-medium text-gray-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="text-xs font-medium text-gray-500 hover:underline disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
        <span className="text-xs text-gray-500">{timeAgo}</span>
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

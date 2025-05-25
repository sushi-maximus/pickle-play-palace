
import { memo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useEditComment2 } from "../posts/hooks/useEditComment2";
import { useDeleteComment2 } from "../posts/hooks/useDeleteComment2";
import { useCommentThumbsUp2 } from "../posts/hooks/reactions/useCommentThumbsUp2";
import { useCommentThumbsDown2 } from "../posts/hooks/reactions/useCommentThumbsDown2";
import { FacebookCommentReactions } from "./FacebookCommentReactions";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  thumbsup_count: number;
  thumbsdown_count: number;
  user_thumbsup: boolean;
  user_thumbsdown: boolean;
}

interface FacebookCommentCardProps {
  comment: Comment;
  user?: Profile | null;
  onCommentUpdated?: () => void;
}

const FacebookCommentCardComponent = ({ 
  comment, 
  user, 
  onCommentUpdated 
}: FacebookCommentCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });
  const isOwner = user?.id === comment.user_id;

  const {
    isEditing,
    editableContent,
    setEditableContent,
    isSubmitting: isEditSubmitting,
    startEditing,
    cancelEditing,
    handleUpdate
  } = useEditComment2({
    onCommentUpdated
  });

  const { handleDelete, isDeleting } = useDeleteComment2({
    onCommentDeleted: onCommentUpdated
  });

  // Initialize thumbs down hook first
  const thumbsDownHook = useCommentThumbsDown2({
    commentId: comment.id,
    userId: user?.id,
    initialCount: comment.thumbsdown_count,
    initialIsActive: comment.user_thumbsdown,
    isThumbsUpActive: false, // Will be updated by thumbsUpHook
    setIsThumbsUpActive: () => {}, // Will be updated by thumbsUpHook
    setThumbsUpCount: () => {} // Will be updated by thumbsUpHook
  });

  // Initialize thumbs up hook with thumbs down dependencies
  const thumbsUpHook = useCommentThumbsUp2({
    commentId: comment.id,
    userId: user?.id,
    initialCount: comment.thumbsup_count,
    initialIsActive: comment.user_thumbsup,
    isThumbsDownActive: thumbsDownHook.isThumbsDownActive,
    setIsThumbsDownActive: thumbsDownHook.setIsThumbsDownActive,
    setThumbsDownCount: thumbsDownHook.setThumbsDownCount
  });

  const handleEditClick = () => {
    startEditing(comment.id, comment.content);
    setShowActions(false);
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await handleDelete(comment.id);
    }
    setShowActions(false);
  };

  const handleSaveEdit = async () => {
    await handleUpdate();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Comment Avatar */}
      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      
      {/* Comment Content */}
      <div className="flex-1">
        {isEditing ? (
          <div className="bg-gray-100 rounded-lg px-3 py-2">
            <div className="font-semibold text-sm text-gray-900 mb-1">
              {comment.user.first_name} {comment.user.last_name}
            </div>
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm resize-none"
              rows={2}
              disabled={isEditSubmitting}
            />
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={handleSaveEdit}
                disabled={isEditSubmitting || !editableContent.trim()}
                className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
              >
                {isEditSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                onClick={cancelEditing}
                disabled={isEditSubmitting}
                className="text-xs font-medium text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg px-3 py-2">
            <div className="font-semibold text-sm text-gray-900">
              {comment.user.first_name} {comment.user.last_name}
            </div>
            <p className="text-sm text-gray-900 mt-1 leading-relaxed">
              {comment.content}
            </p>
          </div>
        )}
        
        {/* Comment Actions */}
        {!isEditing && (
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
                    onClick={handleEditClick}
                    className="text-xs font-medium text-gray-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteClick}
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
                thumbsUpCount={thumbsUpHook.thumbsUpCount}
                thumbsDownCount={thumbsDownHook.thumbsDownCount}
                isThumbsUpActive={thumbsUpHook.isThumbsUpActive}
                isThumbsDownActive={thumbsDownHook.isThumbsDownActive}
                isThumbsUpSubmitting={thumbsUpHook.isThumbsUpSubmitting}
                isThumbsDownSubmitting={thumbsDownHook.isThumbsDownSubmitting}
                onThumbsUpClick={thumbsUpHook.toggleThumbsUp}
                onThumbsDownClick={thumbsDownHook.toggleThumbsDown}
                disabled={!user?.id}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const FacebookCommentCard = memo(FacebookCommentCardComponent);


import { memo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useEditComment2 } from "../posts/hooks/useEditComment2";
import { useDeleteComment2 } from "../posts/hooks/useDeleteComment2";
import { useCommentThumbsUp2 } from "../posts/hooks/reactions/useCommentThumbsUp2";
import { useCommentThumbsDown2 } from "../posts/hooks/reactions/useCommentThumbsDown2";
import { FacebookCommentContent } from "./components/FacebookCommentContent";
import { FacebookCommentEditForm } from "./components/FacebookCommentEditForm";
import { FacebookCommentActions } from "./components/FacebookCommentActions";
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
    onCommentDeleted: () => {
      console.log("Comment deleted, refreshing comments list");
      onCommentUpdated?.();
    }
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
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      console.log("Deleting comment:", comment.id);
      await handleDelete(comment.id);
    }
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
          <FacebookCommentEditForm
            comment={comment}
            editableContent={editableContent}
            setEditableContent={setEditableContent}
            isSubmitting={isEditSubmitting}
            onSave={handleSaveEdit}
            onCancel={cancelEditing}
            onKeyPress={handleKeyPress}
          />
        ) : (
          <FacebookCommentContent comment={comment} />
        )}
        
        {/* Comment Actions */}
        {!isEditing && (
          <FacebookCommentActions
            timeAgo={timeAgo}
            isOwner={isOwner}
            isDeleting={isDeleting}
            user={user}
            thumbsUpCount={thumbsUpHook.thumbsUpCount}
            thumbsDownCount={thumbsDownHook.thumbsDownCount}
            isThumbsUpActive={thumbsUpHook.isThumbsUpActive}
            isThumbsDownActive={thumbsDownHook.isThumbsDownActive}
            isThumbsUpSubmitting={thumbsUpHook.isThumbsUpSubmitting}
            isThumbsDownSubmitting={thumbsDownHook.isThumbsDownSubmitting}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onThumbsUpClick={thumbsUpHook.toggleThumbsUp}
            onThumbsDownClick={thumbsDownHook.toggleThumbsDown}
          />
        )}
      </div>
    </div>
  );
};

export const FacebookCommentCard = memo(FacebookCommentCardComponent);

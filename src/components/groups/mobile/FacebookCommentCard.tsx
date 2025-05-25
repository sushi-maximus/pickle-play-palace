
import { memo, useState } from "react";
import { useEditComment2 } from "../posts/hooks/useEditComment2";
import { useDeleteComment2 } from "../posts/hooks/useDeleteComment2";
import { useCommentThumbsUp2 } from "../posts/hooks/reactions/useCommentThumbsUp2";
import { useCommentThumbsDown2 } from "../posts/hooks/reactions/useCommentThumbsDown2";
import { FacebookCommentHeader } from "./components/FacebookCommentHeader";
import { FacebookCommentBody } from "./components/FacebookCommentBody";
import { DeleteCommentDialog2 } from "../posts/post-card/DeleteCommentDialog2";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(comment.id);
    setShowDeleteDialog(false);
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
    <>
      <div className="space-y-2">
        <FacebookCommentHeader
          user={comment.user}
          createdAt={comment.created_at}
          isOwner={isOwner}
          isEditing={isEditing}
          isDeleting={isDeleting}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        
        <FacebookCommentBody
          comment={comment}
          user={user}
          isEditing={isEditing}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          isEditSubmitting={isEditSubmitting}
          onSave={handleSaveEdit}
          onCancel={cancelEditing}
          onKeyPress={handleKeyPress}
          thumbsUpCount={thumbsUpHook.thumbsUpCount}
          thumbsDownCount={thumbsDownHook.thumbsDownCount}
          isThumbsUpActive={thumbsUpHook.isThumbsUpActive}
          isThumbsDownActive={thumbsDownHook.isThumbsDownActive}
          isThumbsUpSubmitting={thumbsUpHook.isThumbsUpSubmitting}
          isThumbsDownSubmitting={thumbsDownHook.isThumbsDownSubmitting}
          onThumbsUpClick={thumbsUpHook.toggleThumbsUp}
          onThumbsDownClick={thumbsDownHook.toggleThumbsDown}
        />
      </div>

      <DeleteCommentDialog2
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        isSubmitting={isDeleting}
      />
    </>
  );
};

export const FacebookCommentCard = memo(FacebookCommentCardComponent);

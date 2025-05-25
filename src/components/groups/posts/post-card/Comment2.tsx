
import { useState } from "react";
import { CommentHeader } from "./CommentHeader";
import { CommentContent } from "./CommentContent";
import { CommentActions } from "./CommentActions";
import { DeleteCommentDialog2 } from "./DeleteCommentDialog2";
import { useCommentReactions2 } from "../hooks/useCommentReactions2";
import { useEditComment2 } from "../hooks/useEditComment2";
import { useDeleteComment2 } from "../hooks/useDeleteComment2";

interface Comment2Props {
  comment: {
    id: string;
    content: string;
    created_at: string;
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
  };
  currentUserId?: string;
  onCommentUpdate?: () => void;
}

export const Comment2 = ({ comment, currentUserId, onCommentUpdate }: Comment2Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { 
    thumbsUpCount,
    thumbsDownCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    toggleThumbsUp,
    toggleThumbsDown
  } = useCommentReactions2({
    commentId: comment.id,
    userId: currentUserId,
    initialThumbsUp: comment.thumbsup_count,
    initialThumbsDown: comment.thumbsdown_count,
    initialUserThumbsUp: comment.user_thumbsup,
    initialUserThumbsDown: comment.user_thumbsdown
  });

  const { 
    editableContent,
    setEditableContent,
    startEditing, 
    cancelEditing, 
    handleUpdate, 
    isSubmitting: isEditSubmitting 
  } = useEditComment2({
    onCommentUpdated: () => {
      setIsEditing(false);
      onCommentUpdate?.();
    }
  });

  const { handleDelete, isDeleting } = useDeleteComment2({
    onCommentDeleted: () => {
      onCommentUpdate?.();
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    startEditing(comment.id, comment.content);
  };

  const handleSaveEdit = () => {
    if (editableContent.trim() && editableContent !== comment.content) {
      handleUpdate();
    } else {
      setIsEditing(false);
      cancelEditing();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    cancelEditing();
  };

  const handleDeleteClick = () => {
    handleDelete(comment.id);
    setShowDeleteDialog(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const isOwnComment = currentUserId === comment.user_id;

  return (
    <div className="p-3 md:p-4 border-b border-gray-50 last:border-b-0">
      <CommentHeader
        user={comment.user}
        createdAt={comment.created_at}
        isOwnComment={isOwnComment}
        isEditing={isEditing}
        isDeleting={isDeleting}
        onEdit={handleEdit}
        onDelete={() => setShowDeleteDialog(true)}
      />
      
      <div className="ml-10 md:ml-13 space-y-2 md:space-y-3">
        <CommentContent
          content={comment.content}
          isEditing={isEditing}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          isEditSubmitting={isEditSubmitting}
          onKeyDown={handleKeyDown}
        />
        
        <CommentActions
          thumbsUpCount={thumbsUpCount}
          thumbsDownCount={thumbsDownCount}
          isThumbsUpActive={isThumbsUpActive}
          isThumbsDownActive={isThumbsDownActive}
          isThumbsUpSubmitting={isThumbsUpSubmitting}
          isThumbsDownSubmitting={isThumbsDownSubmitting}
          toggleThumbsUp={toggleThumbsUp}
          toggleThumbsDown={toggleThumbsDown}
          currentUserId={currentUserId}
        />
      </div>
      
      <DeleteCommentDialog2
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteClick}
        isSubmitting={isDeleting}
      />
    </div>
  );
};

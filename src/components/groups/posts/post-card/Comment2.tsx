
import { useState, memo, useMemo, useCallback } from "react";
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

const Comment2Component = ({ comment, currentUserId, onCommentUpdate }: Comment2Props) => {
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

  // Memoize edit comment update callback
  const handleCommentUpdated = useCallback(() => {
    setIsEditing(false);
    onCommentUpdate?.();
  }, [onCommentUpdate]);

  // Memoize delete comment callback  
  const handleCommentDeleted = useCallback(() => {
    onCommentUpdate?.();
  }, [onCommentUpdate]);

  const { 
    editableContent,
    setEditableContent,
    startEditing, 
    cancelEditing, 
    handleUpdate, 
    isSubmitting: isEditSubmitting 
  } = useEditComment2({
    onCommentUpdated: handleCommentUpdated
  });

  const { handleDelete, isDeleting } = useDeleteComment2({
    onCommentDeleted: handleCommentDeleted
  });

  // Memoize edit handler
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    startEditing(comment.id, comment.content);
  }, [comment.id, comment.content, startEditing]);

  // Memoize save edit handler
  const handleSaveEdit = useCallback(() => {
    if (editableContent.trim() && editableContent !== comment.content) {
      handleUpdate();
    } else {
      setIsEditing(false);
      cancelEditing();
    }
  }, [editableContent, comment.content, handleUpdate, cancelEditing]);

  // Memoize cancel edit handler
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    cancelEditing();
  }, [cancelEditing]);

  // Memoize delete click handler
  const handleDeleteClick = useCallback(() => {
    handleDelete(comment.id);
    setShowDeleteDialog(false);
  }, [handleDelete, comment.id]);

  // Memoize show delete dialog handler
  const handleShowDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  // Memoize keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  }, [handleSaveEdit, handleCancelEdit]);

  // Memoize ownership check
  const isOwnComment = useMemo(() => 
    currentUserId === comment.user_id, 
    [currentUserId, comment.user_id]
  );

  return (
    <div className="px-4 py-4 bg-white">
      <CommentHeader
        user={comment.user}
        createdAt={comment.created_at}
        isOwnComment={isOwnComment}
        isEditing={isEditing}
        isDeleting={isDeleting}
        onEdit={handleEdit}
        onDelete={handleShowDeleteDialog}
      />
      
      <div className="ml-11 space-y-3">
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

// Enhanced memoization for Comment2
export const Comment2 = memo(Comment2Component, (prevProps, nextProps) => {
  const prevComment = prevProps.comment;
  const nextComment = nextProps.comment;

  // Check comment content and metadata
  if (
    prevComment.id !== nextComment.id ||
    prevComment.content !== nextComment.content ||
    prevComment.created_at !== nextComment.created_at
  ) {
    return false;
  }

  // Check reaction counts and states
  if (
    prevComment.thumbsup_count !== nextComment.thumbsup_count ||
    prevComment.thumbsdown_count !== nextComment.thumbsdown_count ||
    prevComment.user_thumbsup !== nextComment.user_thumbsup ||
    prevComment.user_thumbsdown !== nextComment.user_thumbsdown
  ) {
    return false;
  }

  // Check user ID
  if (prevProps.currentUserId !== nextProps.currentUserId) {
    return false;
  }

  // Check user object (only essential fields)
  if (
    prevComment.user.id !== nextComment.user.id ||
    prevComment.user.first_name !== nextComment.user.first_name ||
    prevComment.user.last_name !== nextComment.user.last_name ||
    prevComment.user.avatar_url !== nextComment.user.avatar_url
  ) {
    return false;
  }

  return true;
});

Comment2Component.displayName = "Comment2";

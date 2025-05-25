
import { memo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEditComment2 } from "../posts/hooks/useEditComment2";
import { useDeleteComment2 } from "../posts/hooks/useDeleteComment2";
import { useCommentThumbsUp2 } from "../posts/hooks/reactions/useCommentThumbsUp2";
import { useCommentThumbsDown2 } from "../posts/hooks/reactions/useCommentThumbsDown2";
import { FacebookCommentContent } from "./components/FacebookCommentContent";
import { FacebookCommentEditForm } from "./components/FacebookCommentEditForm";
import { FacebookCommentActions } from "./components/FacebookCommentActions";
import { FacebookCommentReactions } from "./FacebookCommentReactions";
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
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });
  const isOwner = user?.id === comment.user_id;

  const userName = `${comment.user.first_name} ${comment.user.last_name}`.trim() || 'Unknown User';
  const userInitials = `${comment.user.first_name?.[0] || ''}${comment.user.last_name?.[0] || ''}`.toUpperCase() || 'U';

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
      <div className="flex space-x-2">
        {/* Comment Avatar */}
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.user.avatar_url || undefined} alt={userName} />
          <AvatarFallback className="text-xs bg-gray-200 text-gray-700">{userInitials}</AvatarFallback>
        </Avatar>
        
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

          {/* Comment Reactions - Moved below actions */}
          {!isEditing && user && (
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
      </div>

      {/* Delete Confirmation Dialog */}
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


import { Comment2 } from "./Comment2";
import { CommentForm2 } from "./CommentForm2";
import { useComments2 } from "../hooks/useComments2";
import { useAddComment2 } from "../hooks/useAddComment2";
import { useEditComment2 } from "../hooks/useEditComment2";
import { useDeleteComment2 } from "../hooks/useDeleteComment2";
import { DeleteCommentDialog2 } from "./DeleteCommentDialog2";
import { useState } from "react";

interface CommentsSection2Props {
  postId: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

export const CommentsSection2 = ({ postId, user }: CommentsSection2Props) => {
  const [deleteDialogCommentId, setDeleteDialogCommentId] = useState<string | null>(null);

  const { comments, loading, refreshComments } = useComments2({
    postId,
    userId: user?.id
  });

  const { 
    content,
    setContent,
    isSubmitting: isAddSubmitting,
    handleSubmit: handleAddComment
  } = useAddComment2({
    postId,
    userId: user?.id,
    onCommentAdded: refreshComments
  });

  const {
    isEditing,
    editableContent,
    setEditableContent,
    isSubmitting: isEditSubmitting,
    currentCommentId,
    startEditing,
    cancelEditing,
    handleUpdate
  } = useEditComment2({
    onCommentUpdated: refreshComments
  });

  const { isDeleting, handleDelete } = useDeleteComment2({
    onCommentDeleted: () => {
      setDeleteDialogCommentId(null);
      refreshComments();
    }
  });

  const handleDeleteClick = (commentId: string) => {
    setDeleteDialogCommentId(commentId);
  };

  const confirmDelete = () => {
    if (deleteDialogCommentId) {
      handleDelete(deleteDialogCommentId);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {comments.map((comment) => (
              <Comment2
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                isEditing={isEditing && currentCommentId === comment.id}
                editableContent={editableContent}
                setEditableContent={setEditableContent}
                isEditSubmitting={isEditSubmitting}
                onStartEditing={startEditing}
                onCancelEditing={cancelEditing}
                onSaveEditing={handleUpdate}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Comment Form */}
      {user && (
        <CommentForm2
          content={content}
          setContent={setContent}
          onSubmit={handleAddComment}
          isSubmitting={isAddSubmitting}
          user={user}
        />
      )}

      {/* Delete Dialog */}
      <DeleteCommentDialog2
        isOpen={deleteDialogCommentId !== null}
        onOpenChange={(open) => !open && setDeleteDialogCommentId(null)}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

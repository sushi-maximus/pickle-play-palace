
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, Edit, Trash2, Save, X } from "lucide-react";
import type { Comment as CommentType } from "./hooks/useComments";
import { useCommentReactions, ReactionType } from "./hooks/useCommentReactions";
import { useEditComment } from "./hooks/useEditComment";
import { useDeleteComment } from "./hooks/useDeleteComment";
import { DeleteCommentDialog } from "./post-card/DeleteCommentDialog";

interface CommentProps {
  comment: CommentType;
  userId?: string;
  onCommentUpdated?: () => void;
}

export const Comment = ({ comment, userId, onCommentUpdated }: CommentProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isAuthor = userId === comment.user.id;
  
  const {
    reactions,
    userReactions,
    isSubmitting,
    toggleReaction
  } = useCommentReactions({
    commentId: comment.id,
    userId,
    initialReactions: comment.reactions,
    initialUserReactions: comment.user_reactions
  });

  const {
    isEditing,
    editableContent,
    setEditableContent,
    isSubmitting: isEditSubmitting,
    startEditing,
    cancelEditing,
    handleUpdate,
    currentCommentId
  } = useEditComment({
    onCommentUpdated
  });

  const {
    isDeleting,
    handleDelete
  } = useDeleteComment({
    onCommentDeleted: onCommentUpdated
  });

  const handleReactionClick = (type: ReactionType) => {
    toggleReaction(type);
  };

  const isEditingThisComment = isEditing && currentCommentId === comment.id;
  
  const confirmDelete = () => {
    handleDelete(comment.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex gap-3 py-2">
      <Avatar className="h-8 w-8">
        {comment.user.avatar_url ? (
          <AvatarImage src={comment.user.avatar_url} alt={`${comment.user.first_name} ${comment.user.last_name}`} />
        ) : (
          <AvatarFallback>
            {comment.user.first_name?.[0] || '?'}
            {comment.user.last_name?.[0] || '?'}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="font-medium text-sm flex justify-between items-center">
            <span>{comment.user.first_name} {comment.user.last_name}</span>
            {isAuthor && !isEditingThisComment && (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => startEditing(comment.id, comment.content)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            )}
          </div>
          
          {isEditingThisComment ? (
            <div className="mt-2">
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="min-h-[60px] text-sm"
                disabled={isEditSubmitting}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={cancelEditing}
                  disabled={isEditSubmitting}
                >
                  <X className="h-3.5 w-3.5 mr-1" /> Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUpdate}
                  disabled={!editableContent.trim() || isEditSubmitting}
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> 
                  {isEditSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}
        </div>
        
        {!isEditingThisComment && (
          <div className="flex items-center mt-1">
            <div className="text-xs text-muted-foreground mr-auto">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-0 h-6 ${userReactions?.thumbsup ? "text-blue-500" : ""}`} 
              onClick={() => handleReactionClick("thumbsup")}
              disabled={!userId || isSubmitting.thumbsup}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${userReactions?.thumbsup ? "fill-blue-500" : ""}`} />
              {reactions.thumbsup > 0 && (
                <span className="ml-1 text-xs">{reactions.thumbsup}</span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-0 h-6 ml-2 ${userReactions?.thumbsdown ? "text-red-500" : ""}`}
              onClick={() => handleReactionClick("thumbsdown")}
              disabled={!userId || isSubmitting.thumbsdown}
            >
              <ThumbsDown className={`h-3.5 w-3.5 ${userReactions?.thumbsdown ? "fill-red-500" : ""}`} />
              {reactions.thumbsdown > 0 && (
                <span className="ml-1 text-xs">{reactions.thumbsdown}</span>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <DeleteCommentDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

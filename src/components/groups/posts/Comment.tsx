
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2, MoreHorizontal, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Comment as CommentType } from "./hooks/useComments";
import { useCommentReactions } from "./hooks/useCommentReactions";
import { useEditComment } from "./hooks/useEditComment";
import { useDeleteComment } from "./hooks/useDeleteComment";
import { DeleteCommentDialog } from "./post-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

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

  const handleReactionClick = (type: "like" | "thumbsup" | "thumbsdown") => {
    toggleReaction(type);
  };

  const isEditingThisComment = isEditing && currentCommentId === comment.id;
  
  const confirmDelete = () => {
    handleDelete(comment.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex gap-3 py-2 w-full">
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
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.user.first_name} {comment.user.last_name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            {isAuthor && !isEditingThisComment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startEditing(comment.id, comment.content)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit comment
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete comment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {isEditingThisComment ? (
            <div className="mt-2">
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="min-h-[60px] text-sm"
                disabled={isEditSubmitting}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleUpdate();
                  }
                }}
              />
            </div>
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}
        </div>
        
        {!isEditingThisComment && (
          <div className="flex items-center gap-2 mt-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-0 h-6 ${userReactions?.thumbsup ? "text-blue-500" : ""}`}
              onClick={() => handleReactionClick("thumbsup")}
              disabled={!userId || isSubmitting.thumbsup}
            >
              <ThumbsUp 
                className={`h-3.5 w-3.5 ${userReactions?.thumbsup ? "fill-blue-500" : ""}`} 
              />
              {reactions.thumbsup > 0 && (
                <span className="ml-1 text-xs">{reactions.thumbsup}</span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-0 h-6 ${userReactions?.thumbsdown ? "text-red-500" : ""}`}
              onClick={() => handleReactionClick("thumbsdown")}
              disabled={!userId || isSubmitting.thumbsdown}
            >
              <ThumbsDown 
                className={`h-3.5 w-3.5 ${userReactions?.thumbsdown ? "fill-red-500" : ""}`} 
              />
              {reactions.thumbsdown > 0 && (
                <span className="ml-1 text-xs">{reactions.thumbsdown}</span>
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-0 h-6 ${userReactions?.like ? "text-red-500" : ""}`}
              onClick={() => handleReactionClick("like")}
              disabled={!userId || isSubmitting.like}
            >
              <Heart 
                className={`h-3.5 w-3.5 ${userReactions?.like ? "fill-red-500" : ""}`} 
              />
              {reactions.like > 0 && (
                <span className="ml-1 text-xs">{reactions.like}</span>
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

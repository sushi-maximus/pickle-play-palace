
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { CommentThumbsUp2 } from "./CommentThumbsUp2";
import { CommentThumbsDown2 } from "./CommentThumbsDown2";
import { DeleteCommentDialog2 } from "./DeleteCommentDialog2";
import { useCommentReactions2 } from "../hooks/useCommentReactions2";
import { useEditComment2 } from "../hooks/useEditComment2";
import { useDeleteComment2 } from "../hooks/useDeleteComment2";
import { formatDistanceToNow } from "date-fns";

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

  // Keyboard event handler for Enter and Esc keys
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
  const user = comment.user;
  const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Unknown User';
  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : 'UU';
  
  // Format timestamp to match the design in the image
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  return (
    <div className="flex gap-2 md:gap-3 p-3 md:p-4 border-b border-gray-50 last:border-b-0">
      <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
        <AvatarImage src={user?.avatar_url || undefined} />
        <AvatarFallback className="text-xs md:text-sm bg-gray-100">{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900">{fullName}</h4>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          
          {isOwnComment && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit} disabled={isEditing}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)} 
                  className="text-red-600 focus:text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="mt-1">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm min-h-[60px] resize-none"
                disabled={isEditSubmitting}
                autoFocus
                placeholder="Write your comment..."
              />
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 font-medium">
                  Press Enter to save, Esc to cancel
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelEdit}
                    disabled={isEditSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveEdit}
                    disabled={!editableContent.trim() || isEditSubmitting}
                  >
                    {isEditSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{comment.content}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <CommentThumbsUp2
            count={thumbsUpCount}
            isActive={isThumbsUpActive}
            isSubmitting={isThumbsUpSubmitting}
            onClick={toggleThumbsUp}
            disabled={!currentUserId}
          />
          <CommentThumbsDown2
            count={thumbsDownCount}
            isActive={isThumbsDownActive}
            isSubmitting={isThumbsDownSubmitting}
            onClick={toggleThumbsDown}
            disabled={!currentUserId}
          />
        </div>
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

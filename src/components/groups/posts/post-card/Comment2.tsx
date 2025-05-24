
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

interface Comment2Props {
  comment: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
  };
  currentUserId?: string;
  onCommentUpdate?: () => void;
}

export const Comment2 = ({ comment, currentUserId, onCommentUpdate }: Comment2Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { 
    reactions, 
    userReactions, 
    isSubmitting, 
    handleReactionToggle 
  } = useCommentReactions2(comment.id, currentUserId);

  const { editComment, isSubmitting: isEditSubmitting } = useEditComment2({
    onSuccess: () => {
      setIsEditing(false);
      onCommentUpdate?.();
    }
  });

  const { deleteComment, isSubmitting: isDeleteSubmitting } = useDeleteComment2({
    onSuccess: () => {
      onCommentUpdate?.();
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      editComment({
        commentId: comment.id,
        content: editContent.trim()
      });
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleDelete = () => {
    deleteComment(comment.id);
    setShowDeleteDialog(false);
  };

  const isOwnComment = currentUserId === comment.user_id;
  const profile = comment.profiles;
  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown User';
  const initials = profile ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}` : 'UU';

  return (
    <div className="flex gap-2 md:gap-3 p-3 md:p-4 border-b border-gray-50 last:border-b-0">
      <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
        <AvatarImage src={profile?.avatar_url || undefined} />
        <AvatarFallback className="text-xs md:text-sm bg-gray-100">{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">{fullName}</h4>
            <p className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
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
                  disabled={isDeleteSubmitting}
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
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="text-sm min-h-[60px] resize-none"
                disabled={isEditSubmitting}
              />
              <div className="flex justify-end gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelEdit}
                  disabled={isEditSubmitting}
                  className="text-xs px-2 h-6"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim() || isEditSubmitting}
                  className="text-xs px-2 h-6"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{comment.content}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <CommentThumbsUp2
            count={reactions.thumbsup}
            isActive={userReactions.thumbsup}
            isSubmitting={isSubmitting.thumbsup}
            onClick={() => handleReactionToggle('thumbsup')}
            disabled={!currentUserId}
          />
          <CommentThumbsDown2
            count={reactions.thumbsdown}
            isActive={userReactions.thumbsdown}
            isSubmitting={isSubmitting.thumbsdown}
            onClick={() => handleReactionToggle('thumbsdown')}
            disabled={!currentUserId}
          />
        </div>
      </div>
      
      <DeleteCommentDialog2
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isSubmitting={isDeleteSubmitting}
      />
    </div>
  );
};

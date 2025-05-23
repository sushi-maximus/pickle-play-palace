
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment2Props {
  comment: {
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
  };
  currentUserId?: string;
  isEditing: boolean;
  editableContent: string;
  setEditableContent: (content: string) => void;
  isEditSubmitting: boolean;
  onStartEditing: (commentId: string, content: string) => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
  onDeleteClick: (commentId: string) => void;
}

export const Comment2 = ({
  comment,
  currentUserId,
  isEditing,
  editableContent,
  setEditableContent,
  isEditSubmitting,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onDeleteClick
}: Comment2Props) => {
  const isOwner = currentUserId === comment.user_id;
  const fullName = `${comment.user.first_name || ''} ${comment.user.last_name || ''}`;
  const initials = `${(comment.user.first_name && comment.user.first_name[0]) || ''}${(comment.user.last_name && comment.user.last_name[0]) || ''}`;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editableContent.trim()) {
        onSaveEditing();
      }
    } else if (e.key === 'Escape') {
      onCancelEditing();
    }
  };

  return (
    <div className="flex gap-2 md:gap-3 p-3 md:p-4">
      <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
        <AvatarImage src={comment.user.avatar_url || undefined} />
        <AvatarFallback className="text-xs md:text-sm">{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-xs md:text-sm text-gray-900">
            {fullName}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            {comment.updated_at !== comment.created_at && " (edited)"}
          </span>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onStartEditing(comment.id, comment.content)}
                  disabled={isEditing}
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteClick(comment.id)}
                  className="text-red-600"
                  disabled={isEditing}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-xs md:text-sm min-h-[60px] resize-none"
              disabled={isEditSubmitting}
              autoFocus
            />
            <div className="mt-2 text-xs text-gray-500">
              Press Enter to save, Esc to cancel
            </div>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};


import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

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
  const isAuthor = currentUserId === comment.user_id;
  const fullName = `${comment.user.first_name} ${comment.user.last_name}`;
  const initials = `${comment.user.first_name[0] || ''}${comment.user.last_name[0] || ''}`;

  return (
    <div className="flex gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
      <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
        <AvatarImage src={comment.user.avatar_url || undefined} />
        <AvatarFallback className="text-xs md:text-sm">{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-xs md:text-sm text-gray-900">
              {fullName}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStartEditing(comment.id, comment.content)}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDeleteClick(comment.id)} className="text-red-600">
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="text-xs md:text-sm min-h-[60px] resize-none"
              disabled={isEditSubmitting}
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={onSaveEditing}
                disabled={isEditSubmitting || !editableContent.trim()}
                className="h-7 px-2 text-xs"
              >
                {isEditSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCancelEditing}
                disabled={isEditSubmitting}
                className="h-7 px-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface CommentHeaderProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  createdAt: string;
  isOwnComment: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const CommentHeader = ({
  user,
  createdAt,
  isOwnComment,
  isEditing,
  isDeleting,
  onEdit,
  onDelete
}: CommentHeaderProps) => {
  const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Unknown User';
  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : 'UU';
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-3 flex-1 min-w-0">
        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
          <AvatarImage src={user?.avatar_url || undefined} />
          <AvatarFallback className="text-xs bg-gray-100">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900">{fullName}</h4>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
      </div>
      
      {isOwnComment && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-40 bg-white shadow-lg border border-gray-200 z-[9999]"
            sideOffset={8}
          >
            <DropdownMenuItem 
              onClick={onEdit} 
              disabled={isEditing}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Edit className="h-3 w-3 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete} 
              className="text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

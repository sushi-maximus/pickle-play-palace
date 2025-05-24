
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MobilePostHeaderProps {
  post: {
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
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDeleteClick: () => void;
}

export const MobilePostHeader = ({
  post,
  currentUserId,
  isEditing,
  isDeleting,
  onEdit,
  onDeleteClick
}: MobilePostHeaderProps) => {
  const isOwnPost = currentUserId === post.user_id;
  const profile = post.profiles;
  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown User';
  const initials = profile ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}` : 'UU';

  return (
    <div className="flex items-start justify-between p-3 md:p-4">
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="text-sm bg-gray-100">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
            {fullName}
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      
      {isOwnPost && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit} disabled={isEditing}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDeleteClick} 
              className="text-red-600 focus:text-red-600"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

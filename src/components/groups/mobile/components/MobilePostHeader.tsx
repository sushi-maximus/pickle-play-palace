
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

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
  
  // Better handling of user name display with more robust fallbacks
  const firstName = profile?.first_name?.trim() || '';
  const lastName = profile?.last_name?.trim() || '';
  
  // Create display name with proper fallbacks
  let displayName = 'Unknown User';
  if (firstName && lastName) {
    displayName = `${firstName} ${lastName}`;
  } else if (firstName) {
    displayName = firstName;
  } else if (lastName) {
    displayName = lastName;
  }
  
  // Generate initials with better fallback logic
  let initials = 'U'; // Unknown default
  if (firstName && lastName) {
    initials = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  } else if (firstName) {
    initials = firstName[0].toUpperCase();
  } else if (lastName) {
    initials = lastName[0].toUpperCase();
  }

  // Format timestamp like in the image
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <div className="flex items-start justify-between p-3 md:p-4">
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="text-sm bg-gray-100">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-sm md:text-base text-gray-900">
              {displayName}
            </h3>
            <span className="text-[10px] text-gray-400">
              {timeAgo}
            </span>
          </div>
        </div>
      </div>
      
      {isOwnPost && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="min-h-[48px] min-w-[48px] p-0 text-gray-400 hover:text-gray-600 touch-manipulation"
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
              className="min-h-[48px] flex items-center touch-manipulation cursor-pointer hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDeleteClick} 
              className="min-h-[48px] flex items-center text-red-600 focus:text-red-600 touch-manipulation cursor-pointer hover:bg-red-50"
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

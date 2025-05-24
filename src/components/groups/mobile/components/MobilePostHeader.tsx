
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
  
  // Debug logging to understand the data structure
  console.log("MobilePostHeader - Raw post data:", post);
  console.log("MobilePostHeader - Profiles data:", profile);
  
  // Better handling of user name display with more robust fallbacks
  const firstName = profile?.first_name?.trim() || '';
  const lastName = profile?.last_name?.trim() || '';
  const fullName = `${firstName} ${lastName}`.trim();
  
  // More descriptive fallback based on data availability
  let displayName = 'Unknown User';
  if (fullName) {
    displayName = fullName;
  } else if (firstName) {
    displayName = firstName;
  } else if (lastName) {
    displayName = lastName;
  } else if (profile) {
    displayName = 'Group Member';
  }
  
  // Generate initials with better fallback logic
  let initials = 'GM'; // Group Member default
  if (firstName && lastName) {
    initials = `${firstName[0]}${lastName[0]}`;
  } else if (firstName) {
    initials = `${firstName[0]}M`;
  } else if (lastName) {
    initials = `M${lastName[0]}`;
  }

  return (
    <div className="flex items-start justify-between p-3 md:p-4">
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="text-sm bg-gray-100">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
            {displayName}
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

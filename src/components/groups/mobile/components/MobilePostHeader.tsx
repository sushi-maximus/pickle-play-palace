
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
    <div className="flex items-start justify-between p-4 md:p-6 border-b border-border/50">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <Avatar className="h-12 w-12 md:h-14 md:w-14 flex-shrink-0 shadow-sm border-2 border-border/10">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base md:text-lg text-foreground leading-tight">
              {displayName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {timeAgo}
            </p>
          </div>
        </div>
      </div>
      
      {isOwnPost && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="min-h-[48px] min-w-[48px] p-0 text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200 touch-manipulation"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border">
            <DropdownMenuItem 
              onClick={onEdit} 
              disabled={isEditing}
              className="min-h-[48px] flex items-center touch-manipulation hover:bg-primary/5"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDeleteClick} 
              className="min-h-[48px] flex items-center text-destructive focus:text-destructive hover:bg-destructive/5 touch-manipulation"
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

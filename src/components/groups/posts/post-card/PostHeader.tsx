
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { forwardRef } from "react";

interface PostHeaderProps {
  post: {
    created_at: string;
    updated_at: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
  };
  isAuthor: boolean;
  isEditing: boolean;
  onStartEditing: () => void;
  onDeleteClick: () => void;
}

export const PostHeader = forwardRef<HTMLDivElement, PostHeaderProps>(({ 
  post, 
  isAuthor, 
  isEditing,
  onStartEditing,
  onDeleteClick
}, ref) => {
  const displayName = `${post.user.first_name} ${post.user.last_name}`;
  const avatarFallback = `${post.user.first_name?.[0] || '?'}${post.user.last_name?.[0] || '?'}`;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const isEdited = post.created_at !== post.updated_at;
  
  return (
    <div ref={ref} className="flex justify-between items-center relative">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {post.user.avatar_url ? (
            <AvatarImage src={post.user.avatar_url} alt={displayName} />
          ) : (
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">
            {timeAgo}
            {isEdited && <span className="ml-1">(edited)</span>}
          </p>
        </div>
      </div>
      
      {isAuthor && !isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100 relative z-10"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[160px] bg-white shadow-lg border z-[9999]"
            sideOffset={5}
          >
            <DropdownMenuItem 
              className="cursor-pointer flex items-center hover:bg-gray-50" 
              onClick={onStartEditing}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit post
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer flex items-center text-destructive hover:bg-red-50 focus:text-destructive" 
              onClick={onDeleteClick}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
});

PostHeader.displayName = "PostHeader";

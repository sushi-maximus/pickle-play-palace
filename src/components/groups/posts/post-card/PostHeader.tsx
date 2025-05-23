
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

export const PostHeader = ({ 
  post, 
  isAuthor, 
  isEditing,
  onStartEditing,
  onDeleteClick
}: PostHeaderProps) => {
  const displayName = `${post.user.first_name} ${post.user.last_name}`;
  const avatarFallback = `${post.user.first_name?.[0] || '?'}${post.user.last_name?.[0] || '?'}`;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const isEdited = post.created_at !== post.updated_at;
  
  return (
    <div className="flex items-center justify-between w-full relative">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {post.user.avatar_url ? (
            <AvatarImage src={post.user.avatar_url} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-gray-200 text-gray-700">{avatarFallback}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <p className="font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">
            {timeAgo}
            {isEdited && <span className="ml-1">(edited)</span>}
          </p>
        </div>
      </div>
      
      {isAuthor && !isEditing && (
        <div className="absolute right-0 top-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-100 shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Post options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              side="bottom"
              className="w-40"
              sideOffset={4}
            >
              <DropdownMenuItem 
                onClick={onStartEditing}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDeleteClick}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

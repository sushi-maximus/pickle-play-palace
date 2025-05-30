
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-10 w-10">
          {post.user.avatar_url ? (
            <AvatarImage src={post.user.avatar_url} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-gray-200 text-gray-700">{avatarFallback}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">{displayName}</p>
          <span className="text-gray-400">•</span>
          <p className="text-xs text-gray-500">
            {timeAgo}
            {isEdited && <span className="ml-1">(edited)</span>}
          </p>
        </div>
      </div>
      
      {isAuthor && !isEditing && (
        <div className="flex-shrink-0 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Post options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              side="bottom"
              className="w-40 bg-white shadow-lg border border-gray-200 z-[9999]"
              sideOffset={8}
            >
              <DropdownMenuItem 
                onClick={onStartEditing}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDeleteClick}
                className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50"
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

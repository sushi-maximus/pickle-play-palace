
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
  console.log("PostHeader - isAuthor:", isAuthor, "isEditing:", isEditing);
  console.log("PostHeader - Should show menu:", isAuthor && !isEditing);
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {post.user.avatar_url ? (
            <AvatarImage src={post.user.avatar_url} alt={`${post.user.first_name} ${post.user.last_name}`} />
          ) : (
            <AvatarFallback>
              {post.user.first_name?.[0] || '?'}
              {post.user.last_name?.[0] || '?'}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{`${post.user.first_name} ${post.user.last_name}`}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            {post.created_at !== post.updated_at && 
              <span className="ml-1">(edited)</span>
            }
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        {/* Always show this debug info */}
        <div className="text-xs mr-2 p-1 bg-gray-100 rounded">
          Author: {String(isAuthor)} | Editing: {String(isEditing)}
        </div>
        
        {isAuthor && !isEditing && (
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 bg-red-100 hover:bg-red-200 border border-red-300"
                >
                  <MoreHorizontal className="h-4 w-4 text-red-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white border shadow-lg z-50"
              >
                <DropdownMenuItem onClick={onStartEditing}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit post
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onDeleteClick}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {!isAuthor && (
          <div className="text-xs text-blue-500 p-1 bg-blue-100 rounded">
            Not Author
          </div>
        )}
        
        {isEditing && (
          <div className="text-xs text-orange-500 p-1 bg-orange-100 rounded">
            Editing Mode
          </div>
        )}
      </div>
    </div>
  );
};

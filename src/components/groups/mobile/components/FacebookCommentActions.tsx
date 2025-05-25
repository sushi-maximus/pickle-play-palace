
import { memo } from "react";
import { MessageCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FacebookCommentReactions } from "../FacebookCommentReactions";
import type { Profile } from "../../posts/hooks/types/groupPostTypes";

interface FacebookCommentActionsProps {
  timeAgo: string;
  isOwner: boolean;
  isDeleting: boolean;
  user?: Profile | null;
  thumbsUpCount: number;
  thumbsDownCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onThumbsUpClick: () => void;
  onThumbsDownClick: () => void;
}

const FacebookCommentActionsComponent = ({
  timeAgo,
  isOwner,
  isDeleting,
  user,
  thumbsUpCount,
  thumbsDownCount,
  isThumbsUpActive,
  isThumbsDownActive,
  isThumbsUpSubmitting,
  isThumbsDownSubmitting,
  onEdit,
  onDelete,
  onThumbsUpClick,
  onThumbsDownClick
}: FacebookCommentActionsProps) => {
  const handleLikeClick = () => {
    if (user) {
      onThumbsUpClick();
    }
  };

  const handleReplyClick = () => {
    console.log("Reply to comment clicked");
  };

  return (
    <div className="flex items-center justify-between mt-1 ml-3 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleLikeClick}
          disabled={!user || isThumbsUpSubmitting}
          className={`text-xs font-medium transition-all duration-200 active:scale-95 ${
            isThumbsUpActive 
              ? "text-gray-800" 
              : "text-gray-500 hover:text-gray-800"
          } ${!user ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
        >
          {isThumbsUpActive ? "Liked" : "Like"}
        </button>
        
        <button 
          onClick={handleReplyClick}
          className="text-xs font-medium text-gray-500 hover:text-gray-800 hover:underline transition-all duration-200 active:scale-95"
        >
          Reply
        </button>
        
        <span className="text-xs text-gray-400">{timeAgo}</span>
        
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1">
                <MoreHorizontal className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Edit className="h-3 w-3 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete} 
                disabled={isDeleting}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Comment Reactions */}
      {user && (
        <div className="animate-scale-in">
          <FacebookCommentReactions
            thumbsUpCount={thumbsUpCount}
            thumbsDownCount={thumbsDownCount}
            isThumbsUpActive={isThumbsUpActive}
            isThumbsDownActive={isThumbsDownActive}
            isThumbsUpSubmitting={isThumbsUpSubmitting}
            isThumbsDownSubmitting={isThumbsDownSubmitting}
            onThumbsUpClick={onThumbsUpClick}
            onThumbsDownClick={onThumbsDownClick}
            disabled={!user?.id}
          />
        </div>
      )}
    </div>
  );
};

export const FacebookCommentActions = memo(FacebookCommentActionsComponent);

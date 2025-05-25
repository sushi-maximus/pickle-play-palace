
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

interface FacebookCommentCardProps {
  comment: Comment;
  user?: Profile | null;
}

const FacebookCommentCardComponent = ({ comment, user }: FacebookCommentCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  return (
    <div className="flex space-x-2">
      {/* Comment Avatar */}
      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      
      {/* Comment Content */}
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg px-3 py-2">
          <div className="font-semibold text-sm text-gray-900">
            {comment.user.first_name} {comment.user.last_name}
          </div>
          <p className="text-sm text-gray-900 mt-1 leading-relaxed">
            {comment.content}
          </p>
        </div>
        
        {/* Comment Actions */}
        <div className="flex items-center space-x-4 mt-1 ml-3">
          <button className="text-xs font-medium text-gray-500 hover:underline">
            Like
          </button>
          <button className="text-xs font-medium text-gray-500 hover:underline">
            Reply
          </button>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export const FacebookCommentCard = memo(FacebookCommentCardComponent);

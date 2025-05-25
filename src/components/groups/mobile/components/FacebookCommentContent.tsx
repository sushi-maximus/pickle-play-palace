
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  thumbsup_count: number;
  thumbsdown_count: number;
  user_thumbsup: boolean;
  user_thumbsdown: boolean;
}

interface FacebookCommentContentProps {
  comment: Comment;
}

const FacebookCommentContentComponent = ({ comment }: FacebookCommentContentProps) => {
  const userName = `${comment.user.first_name} ${comment.user.last_name}`.trim() || 'Unknown User';
  const userInitials = `${comment.user.first_name?.[0] || ''}${comment.user.last_name?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div className="bg-gray-100 rounded-2xl px-3 py-2 max-w-xs">
      <div className="flex items-center gap-2 mb-1">
        <Avatar className="h-6 w-6">
          <AvatarImage src={comment.user.avatar_url || undefined} alt={userName} />
          <AvatarFallback className="text-xs bg-gray-200 text-gray-700">{userInitials}</AvatarFallback>
        </Avatar>
        <div className="font-semibold text-sm text-gray-900">{userName}</div>
      </div>
      <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">{comment.content}</p>
    </div>
  );
};

export const FacebookCommentContent = memo(FacebookCommentContentComponent);

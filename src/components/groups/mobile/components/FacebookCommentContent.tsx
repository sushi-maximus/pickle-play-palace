
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";

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
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  return (
    <div className="bg-white rounded-2xl px-3 py-2 max-w-xs">
      <div className="flex items-center gap-2 mb-1">
        <div className="font-semibold text-sm text-gray-900">{userName}</div>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>
      <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">{comment.content}</p>
    </div>
  );
};

export const FacebookCommentContent = memo(FacebookCommentContentComponent);

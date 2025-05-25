
import { memo } from "react";

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
  return (
    <div className="bg-gray-100 rounded-2xl px-3 py-2 max-w-xs">
      <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">{comment.content}</p>
    </div>
  );
};

export const FacebookCommentContent = memo(FacebookCommentContentComponent);

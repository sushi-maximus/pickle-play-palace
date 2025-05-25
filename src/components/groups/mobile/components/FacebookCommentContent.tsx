
import { memo } from "react";

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

interface FacebookCommentContentProps {
  comment: Comment;
}

const FacebookCommentContentComponent = ({ comment }: FacebookCommentContentProps) => {
  return (
    <div className="bg-gray-100 rounded-lg px-3 py-2">
      <div className="font-semibold text-sm text-gray-900">
        {comment.user.first_name} {comment.user.last_name}
      </div>
      <p className="text-sm text-gray-900 mt-1 leading-relaxed">
        {comment.content}
      </p>
    </div>
  );
};

export const FacebookCommentContent = memo(FacebookCommentContentComponent);

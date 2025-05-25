
import { memo } from "react";
import { FacebookCommentCard } from "./FacebookCommentCard";
import { FacebookCommentForm } from "./FacebookCommentForm";
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

interface FacebookCommentsProps {
  postId: string;
  comments: Comment[];
  user?: Profile | null;
  onCommentAdded?: () => void;
}

const FacebookCommentsComponent = ({ 
  postId, 
  comments, 
  user, 
  onCommentAdded 
}: FacebookCommentsProps) => {
  return (
    <div className="border-t border-gray-200">
      {/* Comments List */}
      {comments && comments.length > 0 && (
        <div className="px-4 py-2 space-y-3">
          {comments.map((comment) => (
            <FacebookCommentCard
              key={comment.id}
              comment={comment}
              user={user}
            />
          ))}
        </div>
      )}

      {/* Comment Form */}
      {user && (
        <div className="px-4 py-3 border-t border-gray-100">
          <FacebookCommentForm
            postId={postId}
            user={user}
            onCommentAdded={onCommentAdded}
          />
        </div>
      )}
    </div>
  );
};

export const FacebookComments = memo(FacebookCommentsComponent);

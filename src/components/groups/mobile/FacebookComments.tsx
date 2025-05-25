
import { memo } from "react";
import { FacebookCommentCard } from "./FacebookCommentCard";
import { FacebookCommentForm } from "./FacebookCommentForm";
import { useComments2 } from "../posts/hooks/useComments2";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookCommentsProps {
  postId: string;
  user?: Profile | null;
  onCommentAdded?: () => void;
}

const FacebookCommentsComponent = ({ 
  postId, 
  user, 
  onCommentAdded 
}: FacebookCommentsProps) => {
  const { comments, loading, refreshComments } = useComments2({
    postId,
    userId: user?.id
  });

  const handleCommentAdded = async () => {
    await refreshComments();
    onCommentAdded?.();
  };

  return (
    <div className="border-t border-gray-200">
      {/* Comments List */}
      {loading ? (
        <div className="px-4 py-3 text-center text-gray-500 text-sm">
          Loading comments...
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="px-4 py-2 space-y-3">
          {comments.map((comment) => (
            <FacebookCommentCard
              key={comment.id}
              comment={comment}
              user={user}
              onCommentUpdated={refreshComments}
            />
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 text-center text-gray-500 text-sm">
          No comments yet. Be the first to comment!
        </div>
      )}

      {/* Comment Form */}
      {user && (
        <div className="px-4 py-3 border-t border-gray-100">
          <FacebookCommentForm
            postId={postId}
            user={user}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}
    </div>
  );
};

export const FacebookComments = memo(FacebookCommentsComponent);

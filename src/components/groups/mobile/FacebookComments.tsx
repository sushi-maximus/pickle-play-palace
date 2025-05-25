
import { memo } from "react";
import { useComments2 } from "../posts/hooks/useComments2";
import { FacebookCommentCard } from "./FacebookCommentCard";
import { FacebookCommentForm } from "./FacebookCommentForm";
import { FacebookErrorState } from "./FacebookErrorState";
import { FacebookLoadingState } from "./FacebookLoadingState";
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
  const { comments, loading, error, refreshComments } = useComments2({
    postId,
    userId: user?.id
  });

  const handleCommentUpdated = () => {
    console.log("Comment updated/deleted, refreshing comments list");
    refreshComments();
    onCommentAdded?.(); // Also notify parent if needed
  };

  if (loading) {
    return (
      <div className="border-t border-gray-200 bg-gray-50">
        <FacebookLoadingState type="comments" count={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t border-gray-200 p-3 sm:p-4">
        <FacebookErrorState
          title="Failed to Load Comments"
          description="Comments couldn't be loaded. Please try refreshing."
          showRetry={false}
          variant="network"
        />
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      {/* Comments List - Enhanced spacing for mobile */}
      {comments && comments.length > 0 && (
        <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto overscroll-behavior-contain">
          <div className="space-y-2 sm:space-y-3 p-3 sm:p-4">
            {comments.map((comment) => (
              <FacebookCommentCard
                key={comment.id}
                comment={comment}
                user={user}
                onCommentUpdated={handleCommentUpdated}
              />
            ))}
          </div>
        </div>
      )}

      {/* Comment Form - Enhanced for mobile */}
      {user && (
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <FacebookCommentForm
            postId={postId}
            user={user}
            onCommentAdded={handleCommentUpdated}
          />
        </div>
      )}

      {/* Empty State for Comments */}
      {(!comments || comments.length === 0) && user && (
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <FacebookCommentForm
            postId={postId}
            user={user}
            onCommentAdded={handleCommentUpdated}
          />
        </div>
      )}

      {/* Login Prompt for Non-Users */}
      {!user && (
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">Please log in to comment</p>
        </div>
      )}
    </div>
  );
};

export const FacebookComments = memo(FacebookCommentsComponent);

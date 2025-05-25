
import { Button } from "@/components/ui/button";
import { OptimizedScrollArea } from "@/components/ui/OptimizedScrollArea";
import { Comment2 } from "./Comment2";
import { FacebookExpandingCommentForm } from "../../mobile/FacebookExpandingCommentForm";
import { useComments2 } from "../hooks/useComments2";

interface CommentsSection2Props {
  postId: string;
  currentUserId?: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

export const CommentsSection2 = ({ postId, currentUserId, user }: CommentsSection2Props) => {
  const { comments, loading, refreshComments } = useComments2({
    postId,
    userId: currentUserId
  });

  const handleCommentUpdate = () => {
    refreshComments();
  };

  if (loading) {
    return (
      <div className="border-t border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading comments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 bg-gray-50/30">
      {comments && comments.length > 0 && (
        <OptimizedScrollArea 
          className="max-h-[50vh]"
          enableHardwareAcceleration={true}
        >
          <div className="divide-y divide-gray-100/50">
            {comments.map((comment) => (
              <Comment2
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onCommentUpdate={handleCommentUpdate}
              />
            ))}
          </div>
        </OptimizedScrollArea>
      )}
      
      {currentUserId && user && (
        <div className="border-t border-gray-100/50 bg-white">
          <FacebookExpandingCommentForm
            postId={postId}
            user={user}
            onCommentAdded={handleCommentUpdate}
          />
        </div>
      )}
    </div>
  );
};

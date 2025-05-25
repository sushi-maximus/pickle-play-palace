
import { Button } from "@/components/ui/button";
import { Comment2 } from "./Comment2";
import { CommentForm2 } from "./CommentForm2";
import { useComments2 } from "../hooks/useComments2";
import { useAddComment2 } from "../hooks/useAddComment2";

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

  const { 
    content: newCommentContent, 
    setContent: setNewCommentContent,
    handleSubmit, 
    isSubmitting 
  } = useAddComment2({
    postId,
    userId: currentUserId || '',
    onCommentAdded: () => {
      setNewCommentContent("");
      refreshComments();
    }
  });

  const handleCommentUpdate = () => {
    refreshComments();
  };

  if (loading) {
    return (
      <div className="border-t border-gray-100">
        <div className="flex items-center justify-center py-4 md:py-6">
          <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100">
      {comments && comments.length > 0 && (
        <div className="max-h-[50vh] md:max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <Comment2
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onCommentUpdate={handleCommentUpdate}
            />
          ))}
        </div>
      )}
      
      {currentUserId && user && (
        <div className="border-t border-gray-100">
          <CommentForm2
            content={newCommentContent}
            setContent={setNewCommentContent}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

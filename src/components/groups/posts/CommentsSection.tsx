
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { useComments } from "./hooks/useComments";

interface CommentsSectionProps {
  postId: string;
  userId?: string;
  commentsCount: number;
}

export const CommentsSection = ({ postId, userId, commentsCount }: CommentsSectionProps) => {
  const { comments, loading, error, refreshComments } = useComments(postId, userId);

  const handleCommentAdded = () => {
    refreshComments();
  };

  const handleCommentUpdated = () => {
    refreshComments();
  };

  return (
    <div className="w-full border-t mt-3 pt-3">
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      )}
      
      {error && <p className="text-sm text-red-500 p-2 rounded bg-red-50 dark:bg-red-900/20">{error}</p>}
      
      {!loading && comments.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">No comments yet. Be the first to comment!</p>
      )}
      
      {comments.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 flex flex-col">
          {comments.map((comment) => (
            <Comment 
              key={comment.id} 
              comment={comment}
              userId={userId}
              onCommentUpdated={handleCommentUpdated}
            />
          ))}
        </div>
      )}
      
      {userId && (
        <CommentForm 
          postId={postId}
          userId={userId}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

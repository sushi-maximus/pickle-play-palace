
import { Button } from "@/components/ui/button";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { useComments } from "./hooks/useComments";
import { MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CommentsSectionProps {
  postId: string;
  userId?: string;
  commentsCount: number;
}

export const CommentsSection = ({ postId, userId, commentsCount }: CommentsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    comments, 
    loading, 
    error, 
    refreshComments, 
    addOptimisticComment,
    updateOptimisticComment,
    removeOptimisticComment
  } = useComments(postId, userId);

  const handleCommentAdded = () => {
    refreshComments();
    // Auto-expand comments when a comment is added
    setIsExpanded(true);
  };

  const handleCommentUpdated = () => {
    refreshComments();
  };

  if (!isExpanded) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-2 w-full justify-between py-3 px-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>Comments</span>
          {commentsCount > 0 && (
            <Badge variant="secondary" className="rounded-full">{commentsCount}</Badge>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  return (
    <div className="border-t mt-3 pt-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>Comments</span>
          <Badge variant="secondary" className="rounded-full">{comments.length}</Badge>
        </h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(false)}
          className="flex items-center gap-1"
        >
          <span>Hide</span>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
      
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
              isOptimistic={Boolean(comment.isOptimistic)}
            />
          ))}
        </div>
      )}
      
      {userId && (
        <CommentForm 
          postId={postId}
          userId={userId}
          onCommentAdded={handleCommentAdded}
          addOptimisticComment={addOptimisticComment}
        />
      )}
    </div>
  );
};

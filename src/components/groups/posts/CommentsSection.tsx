
import { Button } from "@/components/ui/button";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { useComments } from "./hooks/useComments";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

interface CommentsSectionProps {
  postId: string;
  userId?: string;
  commentsCount: number;
}

export const CommentsSection = ({ postId, userId, commentsCount }: CommentsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { comments, loading, error, refreshComments } = useComments(postId, userId);

  const handleCommentAdded = () => {
    refreshComments();
  };

  const handleCommentUpdated = () => {
    refreshComments();
  };

  if (!isExpanded) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => setIsExpanded(true)}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{commentsCount > 0 ? commentsCount : ''}</span>
      </Button>
    );
  }

  return (
    <div className="border-t mt-3 pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Comments ({comments.length})</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(false)}
        >
          Hide
        </Button>
      </div>
      
      {loading && <p className="text-sm text-muted-foreground">Loading comments...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      {!loading && comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet</p>
      )}
      
      {comments.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
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

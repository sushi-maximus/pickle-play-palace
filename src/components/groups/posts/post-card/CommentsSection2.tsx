import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");

  const { comments, loading, refreshComments } = useComments2({
    postId,
    userId: currentUserId
  });

  const { handleSubmit, isSubmitting } = useAddComment2({
    postId,
    userId: currentUserId || '',
    onCommentAdded: () => {
      setNewCommentContent("");
      refreshComments();
    }
  });

  const handleAddComment = () => {
    if (newCommentContent.trim() && currentUserId) {
      handleSubmit(newCommentContent);
    }
  };

  const handleCommentUpdate = () => {
    refreshComments();
  };

  if (loading) {
    return (
      <div className="border-t border-gray-100 p-3 md:p-4">
        <div className="flex items-center justify-center py-4">
          <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!comments?.length && !currentUserId) {
    return null;
  }

  return (
    <div className="border-t border-gray-100">
      {comments && comments.length > 0 && (
        <div className="px-3 md:px-4 py-2 border-b border-gray-50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-xs text-gray-500 hover:text-gray-700 h-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>
              {isExpanded ? 'Hide' : 'Show'} {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}
      
      {isExpanded && comments && comments.length > 0 && (
        <div className="max-h-96 overflow-y-auto">
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
        <CommentForm2
          content={newCommentContent}
          setContent={setNewCommentContent}
          onSubmit={handleAddComment}
          isSubmitting={isSubmitting}
          user={user}
        />
      )}
    </div>
  );
};

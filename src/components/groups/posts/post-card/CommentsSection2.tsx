
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        <div className="flex items-center justify-center py-6 md:py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading comments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100">
      {comments && comments.length > 0 && (
        <ScrollArea className="max-h-[60vh] md:max-h-96">
          <div className="space-y-0">
            {comments.map((comment, index) => (
              <div 
                key={comment.id}
                className={`${index !== comments.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <Comment2
                  comment={comment}
                  currentUserId={currentUserId}
                  onCommentUpdate={handleCommentUpdate}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {currentUserId && user && (
        <div className="border-t border-gray-100 bg-gray-50/30">
          <div className="px-3 md:px-4">
            <CommentForm2
              content={newCommentContent}
              setContent={setNewCommentContent}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              user={user}
            />
          </div>
        </div>
      )}
    </div>
  );
};

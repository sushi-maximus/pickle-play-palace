
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddComment } from "./hooks/useAddComment";
import { MessageCircle } from "lucide-react";

interface CommentFormProps {
  postId: string;
  userId: string;
  onCommentAdded: () => void;
}

export const CommentForm = ({ postId, userId, onCommentAdded }: CommentFormProps) => {
  const {
    content,
    setContent,
    isSubmitting,
    handleAddComment
  } = useAddComment({
    onCommentAdded
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddComment(postId, userId);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] text-sm"
        disabled={isSubmitting}
      />
      <div className="mt-2 flex justify-end">
        <Button 
          type="submit" 
          size="sm"
          disabled={!content.trim() || isSubmitting}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          {isSubmitting ? "Posting..." : "Comment"}
        </Button>
      </div>
    </form>
  );
};

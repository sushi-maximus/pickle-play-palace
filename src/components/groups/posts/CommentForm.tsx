
import { Textarea } from "@/components/ui/textarea";
import { useAddComment } from "./hooks/useAddComment";

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

  const handleSubmit = () => {
    if (content.trim()) {
      handleAddComment(postId, userId);
    }
  };

  return (
    <div className="mt-2">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[60px] text-sm rounded-xl border-slate-300"
        disabled={isSubmitting}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
    </div>
  );
};

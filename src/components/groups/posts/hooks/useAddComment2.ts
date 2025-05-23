
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseAddComment2Props {
  postId: string;
  userId?: string;
  onCommentAdded?: () => void;
}

export const useAddComment2 = ({ postId, userId, onCommentAdded }: UseAddComment2Props) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!userId || !content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error: insertError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content: content.trim()
        });

      if (insertError) throw insertError;

      setContent("");
      onCommentAdded?.();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    setContent,
    isSubmitting,
    error,
    handleSubmit
  };
};


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseDeleteComment2Props {
  onCommentDeleted?: () => void;
}

export const useDeleteComment2 = ({ onCommentDeleted }: UseDeleteComment2Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    if (!commentId || isDeleting) return;

    try {
      setIsDeleting(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (deleteError) throw deleteError;

      onCommentDeleted?.();
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    error,
    handleDelete
  };
};

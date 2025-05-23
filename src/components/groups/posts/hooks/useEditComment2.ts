
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseEditComment2Props {
  onCommentUpdated?: () => void;
}

export const useEditComment2 = ({ onCommentUpdated }: UseEditComment2Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startEditing = (commentId: string, content: string) => {
    setCurrentCommentId(commentId);
    setEditableContent(content);
    setIsEditing(true);
    setError(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentCommentId(null);
    setEditableContent("");
    setError(null);
  };

  const handleUpdate = async () => {
    if (!currentCommentId || !editableContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('comments')
        .update({ 
          content: editableContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCommentId);

      if (updateError) throw updateError;

      cancelEditing();
      onCommentUpdated?.();
    } catch (err) {
      console.error('Error updating comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    editableContent,
    setEditableContent,
    isSubmitting,
    currentCommentId,
    error,
    startEditing,
    cancelEditing,
    handleUpdate
  };
};

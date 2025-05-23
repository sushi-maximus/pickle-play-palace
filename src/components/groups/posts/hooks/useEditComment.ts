
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseEditCommentProps {
  onCommentUpdated?: () => void;
}

export const useEditComment = ({ onCommentUpdated }: UseEditCommentProps = {}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState<string | null>(null);
  
  const startEditing = (commentId: string, currentContent: string) => {
    setCurrentCommentId(commentId);
    setEditableContent(currentContent);
    setIsEditing(true);
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setEditableContent("");
    setCurrentCommentId(null);
  };
  
  const handleUpdate = async () => {
    if (!currentCommentId || !editableContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("comments")
        .update({
          content: editableContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("id", currentCommentId);
        
      if (error) {
        throw error;
      }
      
      toast.success("Comment updated successfully");
      cancelEditing();
      onCommentUpdated?.();
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isEditing,
    editableContent,
    setEditableContent,
    isSubmitting,
    startEditing,
    cancelEditing,
    handleUpdate,
    currentCommentId
  };
};

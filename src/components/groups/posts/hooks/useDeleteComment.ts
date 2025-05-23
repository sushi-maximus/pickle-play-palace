
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseDeleteCommentProps {
  onCommentDeleted?: () => void;
}

export const useDeleteComment = ({ onCommentDeleted }: UseDeleteCommentProps = {}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async (commentId: string) => {
    if (!commentId) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
        
      if (error) {
        throw error;
      }
      
      toast.success("Comment deleted successfully");
      onCommentDeleted?.();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleting,
    handleDelete
  };
};

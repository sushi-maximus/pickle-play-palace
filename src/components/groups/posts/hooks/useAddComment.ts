
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseAddCommentProps {
  onCommentAdded?: () => void;
}

export const useAddComment = ({ onCommentAdded }: UseAddCommentProps = {}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (postId: string, userId: string) => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          content: content.trim(),
          post_id: postId,
          user_id: userId
        });
        
      if (error) {
        throw error;
      }
      
      setContent("");
      onCommentAdded?.();
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    content,
    setContent,
    isSubmitting,
    handleAddComment
  };
};

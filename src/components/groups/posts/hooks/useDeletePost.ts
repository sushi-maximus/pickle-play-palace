
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseDeletePostProps {
  onPostDeleted?: () => void;
}

export const useDeletePost = ({ onPostDeleted }: UseDeletePostProps = {}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (postId: string) => {
    if (!postId) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);
        
      if (error) {
        throw error;
      }
      
      toast.success("Post deleted successfully");
      onPostDeleted?.();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleting,
    handleDelete
  };
};

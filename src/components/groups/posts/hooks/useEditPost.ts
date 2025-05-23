
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseEditPostProps {
  onPostUpdated?: () => void;
}

export const useEditPost = ({ onPostUpdated }: UseEditPostProps = {}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  
  const startEditing = (postId: string, currentContent: string) => {
    setCurrentPostId(postId);
    setEditableContent(currentContent);
    setIsEditing(true);
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setEditableContent("");
    setCurrentPostId(null);
  };
  
  const handleUpdate = async () => {
    if (!currentPostId || !editableContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          content: editableContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("id", currentPostId);
        
      if (error) {
        throw error;
      }
      
      toast.success("Post updated successfully");
      cancelEditing();
      onPostUpdated?.();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
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
    currentPostId
  };
};

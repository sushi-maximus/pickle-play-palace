
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseCreatePostProps {
  groupId: string;
  userId: string;
  onPostCreated?: () => void;
}

export const useCreatePost = ({ groupId, userId, onPostCreated }: UseCreatePostProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!content.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          group_id: groupId,
          user_id: userId,
          content: content.trim()
        });
        
      if (error) {
        throw error;
      }
      
      toast.success("Post created successfully");
      setContent("");
      onPostCreated?.();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    content,
    setContent,
    isSubmitting,
    handleSubmit
  };
};

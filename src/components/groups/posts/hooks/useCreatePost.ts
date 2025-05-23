
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
      const toastId = toast.loading("Creating your post...");
      
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
      
      toast.success("Post created successfully", { id: toastId });
      setContent("");
      onPostCreated?.();
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast.error(`Failed to create post: ${error.message || "Please try again."}`);
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

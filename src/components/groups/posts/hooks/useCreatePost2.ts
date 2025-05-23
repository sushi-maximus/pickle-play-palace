
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseCreatePost2Props {
  groupId: string;
  userId?: string;
  onPostCreated?: () => void;
}

export const useCreatePost2 = ({ 
  groupId, 
  userId, 
  onPostCreated 
}: UseCreatePost2Props) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!content.trim() || !userId) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          content: content.trim(),
          group_id: groupId,
          user_id: userId,
        });

      if (error) throw error;

      setContent("");
      toast.success("Post created successfully!");
      
      // Invalidate queries to refresh the posts
      queryClient.invalidateQueries({ queryKey: ["group-posts", groupId] });
      
      onPostCreated?.();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    setContent,
    isSubmitting,
    handleSubmit,
  };
};

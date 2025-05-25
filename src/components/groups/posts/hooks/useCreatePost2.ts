
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseCreatePost2Props {
  groupId: string;
  userId?: string;
  onPostCreated?: () => void;
}

interface UseCreatePost2Result {
  content: string;
  setContent: (content: string) => void;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
  error: Error | null;
}

export const useCreatePost2 = ({ 
  groupId, 
  userId, 
  onPostCreated 
}: UseCreatePost2Props): UseCreatePost2Result => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async () => {
    if (!userId) {
      const authError = new Error("You must be logged in to create a post");
      setError(authError);
      toast.error(authError.message);
      return;
    }

    if (!content.trim()) {
      const contentError = new Error("Please enter some content for your post");
      setError(contentError);
      toast.error(contentError.message);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Creating post with:", { groupId, userId, content: content.trim() });
      
      const { data, error: insertError } = await supabase
        .from("posts")
        .insert({
          group_id: groupId,
          user_id: userId,
          content: content.trim(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating post:", insertError);
        throw new Error("Failed to create post. Please try again.");
      }

      console.log("Post created successfully:", data);
      
      // Clear form and notify success
      setContent("");
      toast.success("Post created successfully!");
      
      // Call the callback to refresh posts
      onPostCreated?.();
      
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      const submitError = err instanceof Error ? err : new Error("Failed to create post");
      setError(submitError);
      toast.error(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    setContent,
    isSubmitting,
    handleSubmit,
    error
  };
};

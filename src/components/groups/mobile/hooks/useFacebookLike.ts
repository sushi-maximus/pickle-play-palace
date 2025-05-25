
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseFacebookLikeProps {
  postId: string;
  userId?: string;
  initialLikeCount: number;
  initialUserLiked: boolean;
}

interface UseFacebookLikeResult {
  likeCount: number;
  isLiked: boolean;
  isSubmitting: boolean;
  toggleLike: () => Promise<void>;
  isDisabled: boolean;
  error: Error | null;
}

export const useFacebookLike = ({
  postId,
  userId,
  initialLikeCount,
  initialUserLiked
}: UseFacebookLikeProps): UseFacebookLikeResult => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialUserLiked);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isDisabled = !userId || isSubmitting;

  const toggleLike = useCallback(async () => {
    if (!userId) {
      const authError = new Error("You must be logged in to like posts");
      setError(authError);
      toast.error(authError.message);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      console.log(`Toggling like for post ${postId}, currently liked: ${isLiked}`);

      if (isLiked) {
        // Remove like
        const { error: deleteError } = await supabase
          .from("reactions")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId)
          .eq("reaction_type", "thumbsup");

        if (deleteError) {
          console.error("Error removing like:", deleteError);
          throw new Error("Failed to remove like");
        }

        // Update local state optimistically
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
        console.log("Like removed successfully");
      } else {
        // Add like
        const { error: insertError } = await supabase
          .from("reactions")
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: "thumbsup"
          });

        if (insertError) {
          console.error("Error adding like:", insertError);
          throw new Error("Failed to add like");
        }

        // Update local state optimistically
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        console.log("Like added successfully");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      const likeError = err instanceof Error ? err : new Error("Failed to update like");
      setError(likeError);
      
      // Revert optimistic updates
      setIsLiked(initialUserLiked);
      setLikeCount(initialLikeCount);
      
      toast.error(likeError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [postId, userId, isLiked, isSubmitting, initialUserLiked, initialLikeCount]);

  return {
    likeCount,
    isLiked,
    isSubmitting,
    toggleLike,
    isDisabled,
    error
  };
};

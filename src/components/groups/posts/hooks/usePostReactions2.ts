
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PostReactionType2 = "thumbsup";

interface UsePostReactions2Props {
  postId: string;
  userId?: string;
  initialCount: number;
  initialUserReaction: boolean;
}

export const usePostReactions2 = ({
  postId,
  userId,
  initialCount,
  initialUserReaction
}: UsePostReactions2Props) => {
  const [count, setCount] = useState(initialCount);
  const [isActive, setIsActive] = useState(initialUserReaction);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleReaction = async () => {
    if (!userId || isSubmitting) return;

    setIsSubmitting(true);
    
    // Optimistic update
    const newIsActive = !isActive;
    const newCount = newIsActive ? count + 1 : count - 1;
    setIsActive(newIsActive);
    setCount(newCount);

    try {
      if (newIsActive) {
        // Add reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: 'thumbsup'
          });

        if (error) throw error;
      } else {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
          .eq('reaction_type', 'thumbsup');

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      // Revert optimistic update on error
      setIsActive(!newIsActive);
      setCount(newIsActive ? count : count + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    count,
    isActive,
    isSubmitting,
    toggleReaction
  };
};

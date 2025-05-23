
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CommentReactionType2 = "thumbsup";

interface UseCommentReactions2Props {
  commentId: string;
  userId?: string;
  initialThumbsUp: number;
  initialUserThumbsUp: boolean;
}

export const useCommentReactions2 = ({
  commentId,
  userId,
  initialThumbsUp,
  initialUserThumbsUp
}: UseCommentReactions2Props) => {
  const [thumbsUpCount, setThumbsUpCount] = useState(initialThumbsUp);
  const [isThumbsUpActive, setIsThumbsUpActive] = useState(initialUserThumbsUp);
  const [isThumbsUpSubmitting, setIsThumbsUpSubmitting] = useState(false);

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    // Optimistic update
    const newIsActive = !isThumbsUpActive;
    const newCount = newIsActive ? thumbsUpCount + 1 : thumbsUpCount - 1;
    
    setIsThumbsUpActive(newIsActive);
    setThumbsUpCount(newCount);

    try {
      if (newIsActive) {
        // Add thumbsup reaction
        const { error } = await supabase
          .from('comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: userId,
            reaction_type: 'thumbsup'
          });

        if (error) throw error;
      } else {
        // Remove thumbsup reaction
        const { error } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId)
          .eq('reaction_type', 'thumbsup');

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling comment thumbs up reaction:', error);
      // Revert optimistic update on error
      setIsThumbsUpActive(!newIsActive);
      setThumbsUpCount(newIsActive ? thumbsUpCount : thumbsUpCount + 1);
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  return {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp
  };
};

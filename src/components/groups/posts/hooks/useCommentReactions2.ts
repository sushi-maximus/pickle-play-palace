
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CommentReactionType2 = "thumbsup" | "thumbsdown";

interface UseCommentReactions2Props {
  commentId: string;
  userId?: string;
  initialThumbsUp: number;
  initialThumbsDown: number;
  initialUserThumbsUp: boolean;
  initialUserThumbsDown: boolean;
}

export const useCommentReactions2 = ({
  commentId,
  userId,
  initialThumbsUp,
  initialThumbsDown,
  initialUserThumbsUp,
  initialUserThumbsDown
}: UseCommentReactions2Props) => {
  const [thumbsUpCount, setThumbsUpCount] = useState(initialThumbsUp);
  const [thumbsDownCount, setThumbsDownCount] = useState(initialThumbsDown);
  const [isThumbsUpActive, setIsThumbsUpActive] = useState(initialUserThumbsUp);
  const [isThumbsDownActive, setIsThumbsDownActive] = useState(initialUserThumbsDown);
  const [isThumbsUpSubmitting, setIsThumbsUpSubmitting] = useState(false);
  const [isThumbsDownSubmitting, setIsThumbsDownSubmitting] = useState(false);

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting || isThumbsDownSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    // Optimistic update
    const newIsActive = !isThumbsUpActive;
    const newCount = newIsActive ? thumbsUpCount + 1 : thumbsUpCount - 1;
    
    // If activating thumbsup, ensure thumbsdown is deactivated
    if (newIsActive && isThumbsDownActive) {
      setIsThumbsDownActive(false);
      setThumbsDownCount(thumbsDownCount - 1);
    }
    
    setIsThumbsUpActive(newIsActive);
    setThumbsUpCount(newCount);

    try {
      if (newIsActive) {
        // Remove thumbsdown if it exists
        if (isThumbsDownActive) {
          await supabase
            .from('comment_reactions')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', userId)
            .eq('reaction_type', 'thumbsdown');
        }
        
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
      
      // Also revert thumbs down changes if they were made
      if (newIsActive && isThumbsDownActive) {
        setIsThumbsDownActive(true);
        setThumbsDownCount(thumbsDownCount);
      }
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsUpSubmitting || isThumbsDownSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    // Optimistic update
    const newIsActive = !isThumbsDownActive;
    const newCount = newIsActive ? thumbsDownCount + 1 : thumbsDownCount - 1;
    
    // If activating thumbsdown, ensure thumbsup is deactivated
    if (newIsActive && isThumbsUpActive) {
      setIsThumbsUpActive(false);
      setThumbsUpCount(thumbsUpCount - 1);
    }
    
    setIsThumbsDownActive(newIsActive);
    setThumbsDownCount(newCount);

    try {
      if (newIsActive) {
        // Remove thumbsup if it exists
        if (isThumbsUpActive) {
          await supabase
            .from('comment_reactions')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', userId)
            .eq('reaction_type', 'thumbsup');
        }
        
        // Add thumbsdown reaction
        const { error } = await supabase
          .from('comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: userId,
            reaction_type: 'thumbsdown'
          });

        if (error) throw error;
      } else {
        // Remove thumbsdown reaction
        const { error } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId)
          .eq('reaction_type', 'thumbsdown');

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling comment thumbs down reaction:', error);
      // Revert optimistic update on error
      setIsThumbsDownActive(!newIsActive);
      setThumbsDownCount(newIsActive ? thumbsDownCount : thumbsDownCount + 1);
      
      // Also revert thumbs up changes if they were made
      if (newIsActive && isThumbsUpActive) {
        setIsThumbsUpActive(true);
        setThumbsUpCount(thumbsUpCount);
      }
    } finally {
      setIsThumbsDownSubmitting(false);
    }
  };

  return {
    thumbsUpCount,
    thumbsDownCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    toggleThumbsUp,
    toggleThumbsDown
  };
};

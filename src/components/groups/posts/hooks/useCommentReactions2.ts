
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOptimisticMutations } from "@/hooks/useOptimisticMutations";

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

  const { updateCommentReactionOptimistically, rollbackOptimisticUpdate } = useOptimisticMutations();

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting || isThumbsDownSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    // Store current state for rollback
    const currentThumbsUpActive = isThumbsUpActive;
    const currentThumbsDownActive = isThumbsDownActive;
    const currentThumbsUpCount = thumbsUpCount;
    const currentThumbsDownCount = thumbsDownCount;
    
    // Calculate new state
    const newIsActive = !isThumbsUpActive;
    const thumbsUpChange = newIsActive ? 1 : -1;
    const thumbsDownChange = (newIsActive && isThumbsDownActive) ? -1 : 0;
    
    try {
      // Optimistic update
      setIsThumbsUpActive(newIsActive);
      setThumbsUpCount(prev => Math.max(0, prev + thumbsUpChange));
      
      // If activating thumbsup, deactivate thumbsdown
      if (newIsActive && isThumbsDownActive) {
        setIsThumbsDownActive(false);
        setThumbsDownCount(prev => Math.max(0, prev - 1));
      }
      
      // Update cache optimistically
      updateCommentReactionOptimistically(commentId, 'thumbsup', newIsActive, thumbsUpChange);
      if (thumbsDownChange !== 0) {
        updateCommentReactionOptimistically(commentId, 'thumbsdown', false, thumbsDownChange);
      }

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
      setIsThumbsUpActive(currentThumbsUpActive);
      setIsThumbsDownActive(currentThumbsDownActive);
      setThumbsUpCount(currentThumbsUpCount);
      setThumbsDownCount(currentThumbsDownCount);
      
      // Rollback cache
      rollbackOptimisticUpdate(['comments']);
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsUpSubmitting || isThumbsDownSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    // Store current state for rollback
    const currentThumbsUpActive = isThumbsUpActive;
    const currentThumbsDownActive = isThumbsDownActive;
    const currentThumbsUpCount = thumbsUpCount;
    const currentThumbsDownCount = thumbsDownCount;
    
    // Calculate new state
    const newIsActive = !isThumbsDownActive;
    const thumbsDownChange = newIsActive ? 1 : -1;
    const thumbsUpChange = (newIsActive && isThumbsUpActive) ? -1 : 0;

    try {
      // Optimistic update
      setIsThumbsDownActive(newIsActive);
      setThumbsDownCount(prev => Math.max(0, prev + thumbsDownChange));
      
      // If activating thumbsdown, deactivate thumbsup
      if (newIsActive && isThumbsUpActive) {
        setIsThumbsUpActive(false);
        setThumbsUpCount(prev => Math.max(0, prev - 1));
      }
      
      // Update cache optimistically
      updateCommentReactionOptimistically(commentId, 'thumbsdown', newIsActive, thumbsDownChange);
      if (thumbsUpChange !== 0) {
        updateCommentReactionOptimistically(commentId, 'thumbsup', false, thumbsUpChange);
      }

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
      setIsThumbsUpActive(currentThumbsUpActive);
      setIsThumbsDownActive(currentThumbsDownActive);
      setThumbsUpCount(currentThumbsUpCount);
      setThumbsDownCount(currentThumbsDownCount);
      
      // Rollback cache
      rollbackOptimisticUpdate(['comments']);
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

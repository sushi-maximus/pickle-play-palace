
import { useState } from "react";
import { commentReactionService } from "./commentReactionService";
import { useOptimisticMutations } from "@/hooks/useOptimisticMutations";

interface UseCommentThumbsUp2Props {
  commentId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
  isThumbsDownActive: boolean;
  setIsThumbsDownActive: (active: boolean) => void;
  setThumbsDownCount: (count: number | ((prev: number) => number)) => void;
}

export const useCommentThumbsUp2 = ({
  commentId,
  userId,
  initialCount,
  initialIsActive,
  isThumbsDownActive,
  setIsThumbsDownActive,
  setThumbsDownCount
}: UseCommentThumbsUp2Props) => {
  const [thumbsUpCount, setThumbsUpCount] = useState(initialCount);
  const [isThumbsUpActive, setIsThumbsUpActive] = useState(initialIsActive);
  const [isThumbsUpSubmitting, setIsThumbsUpSubmitting] = useState(false);

  const { updateCommentReactionOptimistically, rollbackOptimisticUpdate } = useOptimisticMutations();

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    // Store current state for rollback
    const currentThumbsUpActive = isThumbsUpActive;
    const currentThumbsDownActive = isThumbsDownActive;
    const currentThumbsUpCount = thumbsUpCount;
    
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
          await commentReactionService.deleteReaction(commentId, userId, 'thumbsdown');
        }
        
        // Add thumbsup reaction
        await commentReactionService.addReaction(commentId, userId, 'thumbsup');
      } else {
        // Remove thumbsup reaction
        await commentReactionService.deleteReaction(commentId, userId, 'thumbsup');
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsThumbsUpActive(currentThumbsUpActive);
      setIsThumbsDownActive(currentThumbsDownActive);
      setThumbsUpCount(currentThumbsUpCount);
      
      // Rollback cache
      rollbackOptimisticUpdate(['comments']);
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  return {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp,
    setThumbsUpCount,
    setIsThumbsUpActive
  };
};

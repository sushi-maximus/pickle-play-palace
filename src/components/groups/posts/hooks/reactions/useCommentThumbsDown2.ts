
import { useState } from "react";
import { commentReactionService } from "./commentReactionService";
import { useOptimisticMutations } from "@/hooks/useOptimisticMutations";

interface UseCommentThumbsDown2Props {
  commentId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
  isThumbsUpActive: boolean;
  setIsThumbsUpActive: (active: boolean) => void;
  setThumbsUpCount: (count: number | ((prev: number) => number)) => void;
}

export const useCommentThumbsDown2 = ({
  commentId,
  userId,
  initialCount,
  initialIsActive,
  isThumbsUpActive,
  setIsThumbsUpActive,
  setThumbsUpCount
}: UseCommentThumbsDown2Props) => {
  const [thumbsDownCount, setThumbsDownCount] = useState(initialCount);
  const [isThumbsDownActive, setIsThumbsDownActive] = useState(initialIsActive);
  const [isThumbsDownSubmitting, setIsThumbsDownSubmitting] = useState(false);

  const { updateCommentReactionOptimistically, rollbackOptimisticUpdate } = useOptimisticMutations();

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsDownSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    // Store current state for rollback
    const currentThumbsUpActive = isThumbsUpActive;
    const currentThumbsDownActive = isThumbsDownActive;
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
          await commentReactionService.deleteReaction(commentId, userId, 'thumbsup');
        }
        
        // Add thumbsdown reaction
        await commentReactionService.addReaction(commentId, userId, 'thumbsdown');
      } else {
        // Remove thumbsdown reaction
        await commentReactionService.deleteReaction(commentId, userId, 'thumbsdown');
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsThumbsUpActive(currentThumbsUpActive);
      setIsThumbsDownActive(currentThumbsDownActive);
      setThumbsDownCount(currentThumbsDownCount);
      
      // Rollback cache
      rollbackOptimisticUpdate(['comments']);
    } finally {
      setIsThumbsDownSubmitting(false);
    }
  };

  return {
    thumbsDownCount,
    isThumbsDownActive,
    isThumbsDownSubmitting,
    toggleThumbsDown,
    setThumbsDownCount,
    setIsThumbsDownActive
  };
};


import { useState } from "react";
import { reactionService } from "./reactionService";
import { useOptimisticMutations } from "@/hooks/useOptimisticMutations";

interface UseThumbsUpReaction2Props {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
}

export const useThumbsUpReaction2 = ({
  postId,
  userId,
  initialCount,
  initialIsActive
}: UseThumbsUpReaction2Props) => {
  const [thumbsUpCount, setThumbsUpCount] = useState(initialCount);
  const [isThumbsUpActive, setIsThumbsUpActive] = useState(initialIsActive);
  const [isThumbsUpSubmitting, setIsThumbsUpSubmitting] = useState(false);
  
  const { updatePostReactionOptimistically, rollbackOptimisticUpdate } = useOptimisticMutations();

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting) {
      return;
    }

    setIsThumbsUpSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isThumbsUpActive;
    const currentCount = thumbsUpCount;
    const countChange = currentActive ? -1 : 1;
    const newActive = !currentActive;
    
    try {
      // Optimistic update - update UI immediately
      setIsThumbsUpActive(newActive);
      setThumbsUpCount(prev => Math.max(0, prev + countChange));
      
      // Update React Query cache optimistically
      updatePostReactionOptimistically(postId, 'thumbsup', newActive, countChange);
      
      // Always delete first, then add if needed to prevent duplicates
      await reactionService.deleteReaction(postId, userId, 'thumbsup');
      
      if (newActive) {
        await reactionService.addReaction(postId, userId, 'thumbsup');
      }
    } catch (error) {
      // Revert local state
      setIsThumbsUpActive(currentActive);
      setThumbsUpCount(currentCount);
      
      // Rollback optimistic update in React Query cache
      rollbackOptimisticUpdate(['posts']);
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

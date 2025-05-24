
import { useState } from "react";
import { reactionService } from "./reactionService";
import { useOptimisticMutations } from "@/hooks/useOptimisticMutations";

interface UseThumbsDownReaction2Props {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
}

export const useThumbsDownReaction2 = ({
  postId,
  userId,
  initialCount,
  initialIsActive
}: UseThumbsDownReaction2Props) => {
  const [thumbsDownCount, setThumbsDownCount] = useState(initialCount);
  const [isThumbsDownActive, setIsThumbsDownActive] = useState(initialIsActive);
  const [isThumbsDownSubmitting, setIsThumbsDownSubmitting] = useState(false);
  
  const { updatePostReactionOptimistically, rollbackOptimisticUpdate } = useOptimisticMutations();

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsDownSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isThumbsDownActive;
    const currentCount = thumbsDownCount;
    const countChange = currentActive ? -1 : 1;
    const newActive = !currentActive;
    
    try {
      console.log(`Toggling thumbs down: currently ${currentActive} for post ${postId}`);
      
      // Optimistic update - update UI immediately
      setIsThumbsDownActive(newActive);
      setThumbsDownCount(prev => Math.max(0, prev + countChange));
      
      // Update React Query cache optimistically
      updatePostReactionOptimistically(postId, 'thumbsdown', newActive, countChange);
      
      if (newActive) {
        await reactionService.addReaction(postId, userId, 'thumbsdown');
        console.log('Added thumbs down reaction');
      } else {
        await reactionService.deleteReaction(postId, userId, 'thumbsdown');
        console.log('Removed thumbs down reaction');
      }
      
      console.log(`Thumbs down toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling thumbs down:', error);
      
      // Revert local state
      setIsThumbsDownActive(currentActive);
      setThumbsDownCount(currentCount);
      
      // Rollback optimistic update
      rollbackOptimisticUpdate(['posts']);
    } finally {
      setIsThumbsDownSubmitting(false);
    }
  };

  return {
    thumbsDownCount,
    isThumbsDownActive,
    isThumbsDownSubmitting,
    toggleThumbsDown
  };
};

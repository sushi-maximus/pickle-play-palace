
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
    console.log(`=== THUMBS DOWN TOGGLE START ===`);
    console.log(`Post: ${postId}, User: ${userId}, Currently active: ${isThumbsDownActive}`);
    
    if (!userId || isThumbsDownSubmitting) {
      console.log(`Toggle blocked - userId: ${userId}, isSubmitting: ${isThumbsDownSubmitting}`);
      return;
    }

    setIsThumbsDownSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isThumbsDownActive;
    const currentCount = thumbsDownCount;
    const countChange = currentActive ? -1 : 1;
    const newActive = !currentActive;
    
    console.log(`Current state - active: ${currentActive}, count: ${currentCount}`);
    
    try {
      console.log(`Toggling thumbs down: currently ${currentActive} for post ${postId}`);
      
      // Optimistic update - update UI immediately
      setIsThumbsDownActive(newActive);
      setThumbsDownCount(prev => Math.max(0, prev + countChange));
      
      // Update React Query cache optimistically
      updatePostReactionOptimistically(postId, 'thumbsdown', newActive, countChange);
      
      console.log(`Making API call to ${newActive ? 'add' : 'remove'} reaction...`);
      
      // FIXED: Always delete first, then add if needed
      // This prevents duplicate key constraint violations
      await reactionService.deleteReaction(postId, userId, 'thumbsdown');
      console.log('✅ Successfully deleted existing thumbs down reaction (if any)');
      
      if (newActive) {
        await reactionService.addReaction(postId, userId, 'thumbsdown');
        console.log('Added thumbs down reaction - API call successful');
      } else {
        console.log('Removed thumbs down reaction - API call successful');
      }
      
      console.log(`Thumbs down toggle successful for post ${postId}`);
    } catch (error) {
      console.error('=== THUMBS DOWN ERROR OCCURRED ===');
      console.error('Error toggling thumbs down:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.log(`Rolling back to previous state - active: ${currentActive}, count: ${currentCount}`);
      
      // Revert local state
      setIsThumbsDownActive(currentActive);
      setThumbsDownCount(currentCount);
      
      // Rollback optimistic update
      rollbackOptimisticUpdate(['posts']);
      
      console.log(`State rolled back successfully`);
    } finally {
      console.log(`Setting isThumbsDownSubmitting to false`);
      setIsThumbsDownSubmitting(false);
      console.log(`=== THUMBS DOWN TOGGLE END ===`);
    }
  };

  return {
    thumbsDownCount,
    isThumbsDownActive,
    isThumbsDownSubmitting,
    toggleThumbsDown
  };
};

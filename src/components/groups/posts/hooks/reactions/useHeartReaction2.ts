
import { useState } from "react";
import { reactionService } from "./reactionService";
import { useOptimisticMutations } from "@/hooks/useOptimisticMutations";

interface UseHeartReaction2Props {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
}

export const useHeartReaction2 = ({
  postId,
  userId,
  initialCount,
  initialIsActive
}: UseHeartReaction2Props) => {
  const [heartCount, setHeartCount] = useState(initialCount);
  const [isHeartActive, setIsHeartActive] = useState(initialIsActive);
  const [isHeartSubmitting, setIsHeartSubmitting] = useState(false);
  
  const { updatePostReactionOptimistically, rollbackOptimisticUpdate } = useOptimisticMutations();

  const toggleHeart = async () => {
    console.log(`=== HEART TOGGLE START ===`);
    console.log(`Post: ${postId}, User: ${userId}, Currently active: ${isHeartActive}`);
    
    if (!userId || isHeartSubmitting) {
      console.log(`Toggle blocked - userId: ${userId}, isSubmitting: ${isHeartSubmitting}`);
      return;
    }

    setIsHeartSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isHeartActive;
    const currentCount = heartCount;
    const countChange = currentActive ? -1 : 1;
    const newActive = !currentActive;
    
    console.log(`Current state - active: ${currentActive}, count: ${currentCount}`);
    
    try {
      console.log(`Toggling heart: currently ${currentActive} for post ${postId}`);
      
      // Optimistic update - update UI immediately
      setIsHeartActive(newActive);
      setHeartCount(prev => Math.max(0, prev + countChange));
      
      // Update React Query cache optimistically
      updatePostReactionOptimistically(postId, 'heart', newActive, countChange);
      
      console.log(`Making API call to ${newActive ? 'add' : 'remove'} reaction...`);
      
      if (newActive) {
        await reactionService.addReaction(postId, userId, 'heart');
        console.log('Added heart reaction - API call successful');
      } else {
        await reactionService.deleteReaction(postId, userId, 'heart');
        console.log('Removed heart reaction - API call successful');
      }
      
      console.log(`Heart toggle successful for post ${postId}`);
    } catch (error) {
      console.error('=== HEART ERROR OCCURRED ===');
      console.error('Error toggling heart:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.log(`Rolling back to previous state - active: ${currentActive}, count: ${currentCount}`);
      
      // Revert local state
      setIsHeartActive(currentActive);
      setHeartCount(currentCount);
      
      // Rollback optimistic update
      rollbackOptimisticUpdate(['posts']);
      
      console.log(`State rolled back successfully`);
    } finally {
      console.log(`Setting isHeartSubmitting to false`);
      setIsHeartSubmitting(false);
      console.log(`=== HEART TOGGLE END ===`);
    }
  };

  return {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeart
  };
};

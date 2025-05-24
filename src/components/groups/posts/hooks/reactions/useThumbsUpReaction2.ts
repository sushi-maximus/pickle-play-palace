
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
    console.log(`=== THUMBS UP TOGGLE START ===`);
    console.log(`Post: ${postId}, User: ${userId}, Currently active: ${isThumbsUpActive}`);
    
    if (!userId || isThumbsUpSubmitting) {
      console.log(`Toggle blocked - userId: ${userId}, isSubmitting: ${isThumbsUpSubmitting}`);
      return;
    }

    setIsThumbsUpSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isThumbsUpActive;
    const currentCount = thumbsUpCount;
    const countChange = currentActive ? -1 : 1;
    const newActive = !currentActive;
    
    console.log(`Current state - active: ${currentActive}, count: ${currentCount}`);
    
    try {
      console.log(`Toggling thumbs up: currently ${currentActive} for post ${postId}`);
      
      // Optimistic update - update UI immediately
      setIsThumbsUpActive(newActive);
      setThumbsUpCount(prev => Math.max(0, prev + countChange));
      
      // Update React Query cache optimistically
      updatePostReactionOptimistically(postId, 'thumbsup', newActive, countChange);
      
      console.log(`Making API call to ${newActive ? 'add' : 'remove'} reaction...`);
      
      if (newActive) {
        await reactionService.addReaction(postId, userId, 'thumbsup');
        console.log('Added thumbs up reaction - API call successful');
      } else {
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
        console.log('Removed thumbs up reaction - API call successful');
      }
      
      console.log(`Thumbs up toggle successful for post ${postId}`);
    } catch (error) {
      console.error('=== THUMBS UP ERROR OCCURRED ===');
      console.error('Error toggling thumbs up:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.log(`Rolling back to previous state - active: ${currentActive}, count: ${currentCount}`);
      
      // Revert local state
      setIsThumbsUpActive(currentActive);
      setThumbsUpCount(currentCount);
      
      // Rollback optimistic update in React Query cache
      rollbackOptimisticUpdate(['posts']);
      
      console.log(`State rolled back successfully`);
    } finally {
      console.log(`Setting isThumbsUpSubmitting to false`);
      setIsThumbsUpSubmitting(false);
      console.log(`=== THUMBS UP TOGGLE END ===`);
    }
  };

  return {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp
  };
};


import { useState } from "react";
import { reactionService } from "./reactionService";

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

  const toggleHeart = async () => {
    if (!userId || isHeartSubmitting) return;

    setIsHeartSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isHeartActive;
    const currentCount = heartCount;
    
    try {
      console.log(`Toggling heart: currently ${currentActive} for post ${postId}`);
      
      // Optimistically update UI first
      if (!currentActive) {
        setIsHeartActive(true);
        setHeartCount(prev => prev + 1);
        await reactionService.addReaction(postId, userId, 'heart');
        console.log('Added heart reaction');
      } else {
        setIsHeartActive(false);
        setHeartCount(prev => Math.max(0, prev - 1));
        await reactionService.deleteReaction(postId, userId, 'heart');
        console.log('Removed heart reaction');
      }
      
      console.log(`Heart toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling heart:', error);
      // Revert to the original state on error
      setIsHeartActive(currentActive);
      setHeartCount(currentCount);
    } finally {
      setIsHeartSubmitting(false);
    }
  };

  return {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeart
  };
};

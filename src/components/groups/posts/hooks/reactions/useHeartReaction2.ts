
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
    
    try {
      const wasActive = isHeartActive;
      
      console.log(`Toggling heart: currently ${wasActive} for post ${postId}`);
      
      if (!wasActive) {
        // Add heart
        await reactionService.addReaction(postId, userId, 'heart');
        setIsHeartActive(true);
        setHeartCount(prev => prev + 1);
        console.log('Added heart reaction');
      } else {
        // Remove heart
        await reactionService.deleteReaction(postId, userId, 'heart');
        setIsHeartActive(false);
        setHeartCount(prev => Math.max(0, prev - 1));
        console.log('Removed heart reaction');
      }
      
      console.log(`Heart toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling heart:', error);
      // Revert optimistic update on error
      setIsHeartActive(isHeartActive);
      setHeartCount(heartCount);
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

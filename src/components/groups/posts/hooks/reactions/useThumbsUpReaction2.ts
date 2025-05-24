
import { useState } from "react";
import { reactionService } from "./reactionService";

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

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isThumbsUpActive;
    const currentCount = thumbsUpCount;
    
    try {
      console.log(`Toggling thumbs up: currently ${currentActive} for post ${postId}`);
      
      // Optimistically update UI first
      if (!currentActive) {
        setIsThumbsUpActive(true);
        setThumbsUpCount(prev => prev + 1);
        await reactionService.addReaction(postId, userId, 'thumbsup');
        console.log('Added thumbs up reaction');
      } else {
        setIsThumbsUpActive(false);
        setThumbsUpCount(prev => Math.max(0, prev - 1));
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
        console.log('Removed thumbs up reaction');
      }
      
      console.log(`Thumbs up toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling thumbs up:', error);
      // Revert to the original state on error
      setIsThumbsUpActive(currentActive);
      setThumbsUpCount(currentCount);
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

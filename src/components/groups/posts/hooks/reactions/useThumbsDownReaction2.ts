
import { useState } from "react";
import { reactionService } from "./reactionService";

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

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsDownSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isThumbsDownActive;
    const currentCount = thumbsDownCount;
    
    try {
      console.log(`Toggling thumbs down: currently ${currentActive} for post ${postId}`);
      
      // Optimistically update UI first
      if (!currentActive) {
        setIsThumbsDownActive(true);
        setThumbsDownCount(prev => prev + 1);
        await reactionService.addReaction(postId, userId, 'thumbsdown');
        console.log('Added thumbs down reaction');
      } else {
        setIsThumbsDownActive(false);
        setThumbsDownCount(prev => Math.max(0, prev - 1));
        await reactionService.deleteReaction(postId, userId, 'thumbsdown');
        console.log('Removed thumbs down reaction');
      }
      
      console.log(`Thumbs down toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling thumbs down:', error);
      // Revert to the original state on error
      setIsThumbsDownActive(currentActive);
      setThumbsDownCount(currentCount);
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

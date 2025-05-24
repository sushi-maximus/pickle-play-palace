
import { useState } from "react";
import { reactionService } from "./reactionService";

interface UseThumbsDownReaction2Props {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
  onThumbsUpDeactivate?: () => void;
}

export const useThumbsDownReaction2 = ({
  postId,
  userId,
  initialCount,
  initialIsActive,
  onThumbsUpDeactivate
}: UseThumbsDownReaction2Props) => {
  const [thumbsDownCount, setThumbsDownCount] = useState(initialCount);
  const [isThumbsDownActive, setIsThumbsDownActive] = useState(initialIsActive);
  const [isThumbsDownSubmitting, setIsThumbsDownSubmitting] = useState(false);

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsDownSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    try {
      const wasActive = isThumbsDownActive;
      
      console.log(`Toggling thumbs down: currently ${wasActive}`);
      
      if (!wasActive) {
        // We're activating thumbs down - notify parent to deactivate thumbs up
        onThumbsUpDeactivate?.();
        
        // Add thumbs down
        await reactionService.addReaction(postId, userId, 'thumbsdown');
        setIsThumbsDownActive(true);
        setThumbsDownCount(prev => prev + 1);
        console.log('Added thumbs down reaction');
      } else {
        // We're deactivating thumbs down
        await reactionService.deleteReaction(postId, userId, 'thumbsdown');
        setIsThumbsDownActive(false);
        setThumbsDownCount(prev => Math.max(0, prev - 1));
        console.log('Removed thumbs down reaction');
      }
      
      console.log(`Thumbs down toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling thumbs down:', error);
    } finally {
      setIsThumbsDownSubmitting(false);
    }
  };

  const deactivateThumbsDown = async () => {
    if (!isThumbsDownActive) return;
    
    try {
      await reactionService.deleteReaction(postId, userId!, 'thumbsdown');
      setIsThumbsDownActive(false);
      setThumbsDownCount(prev => Math.max(0, prev - 1));
      console.log('Deactivated thumbs down from external trigger');
    } catch (error) {
      console.error('Error deactivating thumbs down:', error);
    }
  };

  return {
    thumbsDownCount,
    isThumbsDownActive,
    isThumbsDownSubmitting,
    toggleThumbsDown,
    deactivateThumbsDown
  };
};

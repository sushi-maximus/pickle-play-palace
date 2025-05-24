
import { useState } from "react";
import { reactionService } from "./reactionService";

interface UseThumbsUpReaction2Props {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
  onThumbsDownDeactivate?: () => void;
}

export const useThumbsUpReaction2 = ({
  postId,
  userId,
  initialCount,
  initialIsActive,
  onThumbsDownDeactivate
}: UseThumbsUpReaction2Props) => {
  const [thumbsUpCount, setThumbsUpCount] = useState(initialCount);
  const [isThumbsUpActive, setIsThumbsUpActive] = useState(initialIsActive);
  const [isThumbsUpSubmitting, setIsThumbsUpSubmitting] = useState(false);

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    try {
      const wasActive = isThumbsUpActive;
      
      console.log(`Toggling thumbs up: currently ${wasActive}`);
      
      if (!wasActive) {
        // We're activating thumbs up - notify parent to deactivate thumbs down
        onThumbsDownDeactivate?.();
        
        // Add thumbs up
        await reactionService.addReaction(postId, userId, 'thumbsup');
        setIsThumbsUpActive(true);
        setThumbsUpCount(prev => prev + 1);
        console.log('Added thumbs up reaction');
      } else {
        // We're deactivating thumbs up
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
        setIsThumbsUpActive(false);
        setThumbsUpCount(prev => Math.max(0, prev - 1));
        console.log('Removed thumbs up reaction');
      }
      
      console.log(`Thumbs up toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling thumbs up:', error);
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  const deactivateThumbsUp = async () => {
    if (!isThumbsUpActive) return;
    
    try {
      await reactionService.deleteReaction(postId, userId!, 'thumbsup');
      setIsThumbsUpActive(false);
      setThumbsUpCount(prev => Math.max(0, prev - 1));
      console.log('Deactivated thumbs up from external trigger');
    } catch (error) {
      console.error('Error deactivating thumbs up:', error);
    }
  };

  return {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp,
    deactivateThumbsUp
  };
};


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
    
    try {
      const wasActive = isThumbsUpActive;
      
      console.log(`Toggling thumbs up: currently ${wasActive}`);
      
      if (!wasActive) {
        // Add thumbs up
        await reactionService.addReaction(postId, userId, 'thumbsup');
        setIsThumbsUpActive(true);
        setThumbsUpCount(prev => prev + 1);
        console.log('Added thumbs up reaction');
      } else {
        // Remove thumbs up
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

  return {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp
  };
};

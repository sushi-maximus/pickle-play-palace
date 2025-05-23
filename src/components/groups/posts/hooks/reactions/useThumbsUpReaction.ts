
import { useState } from "react";
import { reactionService } from "./reactionService";

interface UseThumbsUpReactionProps {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
  isThumbsDownActive: boolean;
  thumbsDownCount: number;
  setIsThumbsDownActive: (active: boolean) => void;
  setThumbsDownCount: (count: number) => void;
}

export const useThumbsUpReaction = ({
  postId,
  userId,
  initialCount,
  initialIsActive,
  isThumbsDownActive,
  thumbsDownCount,
  setIsThumbsDownActive,
  setThumbsDownCount
}: UseThumbsUpReactionProps) => {
  const [thumbsUpCount, setThumbsUpCount] = useState(initialCount);
  const [isThumbsUpActive, setIsThumbsUpActive] = useState(initialIsActive);
  const [isThumbsUpSubmitting, setIsThumbsUpSubmitting] = useState(false);

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    // Store original states for potential rollback
    const originalIsActive = isThumbsUpActive;
    const originalCount = thumbsUpCount;
    const originalThumbsDownActive = isThumbsDownActive;
    const originalThumbsDownCount = thumbsDownCount;
    
    // Optimistic update
    const newIsActive = !isThumbsUpActive;
    const newCount = newIsActive ? thumbsUpCount + 1 : thumbsUpCount - 1;
    
    // If activating thumbsup, ensure thumbsdown is deactivated
    if (newIsActive && isThumbsDownActive) {
      setIsThumbsDownActive(false);
      setThumbsDownCount(Math.max(0, thumbsDownCount - 1));
    }
    
    setIsThumbsUpActive(newIsActive);
    setThumbsUpCount(Math.max(0, newCount));

    try {
      if (newIsActive) {
        // Use the upsert method which handles existing reactions
        await reactionService.addReaction(postId, userId, 'thumbsup');
      } else {
        // Remove thumbsup reaction
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
      }
    } catch (error) {
      console.error('Error toggling thumbs up reaction:', error);
      // Revert optimistic update on error
      setIsThumbsUpActive(originalIsActive);
      setThumbsUpCount(originalCount);
      setIsThumbsDownActive(originalThumbsDownActive);
      setThumbsDownCount(originalThumbsDownCount);
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  return {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp,
    setThumbsUpCount,
    setIsThumbsUpActive
  };
};

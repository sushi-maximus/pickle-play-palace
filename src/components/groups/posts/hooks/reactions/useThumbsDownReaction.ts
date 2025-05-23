
import { useState } from "react";
import { reactionService } from "./reactionService";

interface UseThumbsDownReactionProps {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
  isThumbsUpActive: boolean;
  thumbsUpCount: number;
  setIsThumbsUpActive: (active: boolean) => void;
  setThumbsUpCount: (count: number) => void;
}

export const useThumbsDownReaction = ({
  postId,
  userId,
  initialCount,
  initialIsActive,
  isThumbsUpActive,
  thumbsUpCount,
  setIsThumbsUpActive,
  setThumbsUpCount
}: UseThumbsDownReactionProps) => {
  const [thumbsDownCount, setThumbsDownCount] = useState(initialCount);
  const [isThumbsDownActive, setIsThumbsDownActive] = useState(initialIsActive);
  const [isThumbsDownSubmitting, setIsThumbsDownSubmitting] = useState(false);

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsDownSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    // Store original states for potential rollback
    const originalIsActive = isThumbsDownActive;
    const originalCount = thumbsDownCount;
    const originalThumbsUpActive = isThumbsUpActive;
    const originalThumbsUpCount = thumbsUpCount;
    
    // Optimistic update
    const newIsActive = !isThumbsDownActive;
    const newCount = newIsActive ? thumbsDownCount + 1 : thumbsDownCount - 1;
    
    // If activating thumbsdown, ensure thumbsup is deactivated
    if (newIsActive && isThumbsUpActive) {
      setIsThumbsUpActive(false);
      setThumbsUpCount(Math.max(0, thumbsUpCount - 1));
    }
    
    setIsThumbsDownActive(newIsActive);
    setThumbsDownCount(Math.max(0, newCount));

    try {
      if (newIsActive) {
        // Use the upsert method which handles existing reactions
        await reactionService.addReaction(postId, userId, 'thumbsdown');
      } else {
        // Remove thumbsdown reaction
        await reactionService.deleteReaction(postId, userId, 'thumbsdown');
      }
    } catch (error) {
      console.error('Error toggling thumbs down reaction:', error);
      // Revert optimistic update on error
      setIsThumbsDownActive(originalIsActive);
      setThumbsDownCount(originalCount);
      setIsThumbsUpActive(originalThumbsUpActive);
      setThumbsUpCount(originalThumbsUpCount);
    } finally {
      setIsThumbsDownSubmitting(false);
    }
  };

  return {
    thumbsDownCount,
    isThumbsDownActive,
    isThumbsDownSubmitting,
    toggleThumbsDown,
    setThumbsDownCount,
    setIsThumbsDownActive
  };
};

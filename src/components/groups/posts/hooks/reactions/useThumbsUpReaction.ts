
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
    
    // Optimistic update
    const newIsActive = !isThumbsUpActive;
    const newCount = newIsActive ? thumbsUpCount + 1 : thumbsUpCount - 1;
    
    // If activating thumbsup, ensure thumbsdown is deactivated
    if (newIsActive && isThumbsDownActive) {
      setIsThumbsDownActive(false);
      setThumbsDownCount(thumbsDownCount - 1);
    }
    
    setIsThumbsUpActive(newIsActive);
    setThumbsUpCount(newCount);

    try {
      if (newIsActive) {
        // Remove thumbsdown if it exists
        if (isThumbsDownActive) {
          await reactionService.deleteReaction(postId, userId, 'thumbsdown');
        }
        
        // Add thumbsup reaction
        await reactionService.addReaction(postId, userId, 'thumbsup');
      } else {
        // Remove thumbsup reaction
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
      }
    } catch (error) {
      console.error('Error toggling thumbs up reaction:', error);
      // Revert optimistic update on error
      setIsThumbsUpActive(!newIsActive);
      setThumbsUpCount(newIsActive ? thumbsUpCount : thumbsUpCount + 1);
      
      // Also revert thumbs down changes if they were made
      if (newIsActive && isThumbsDownActive) {
        setIsThumbsDownActive(true);
        setThumbsDownCount(thumbsDownCount);
      }
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

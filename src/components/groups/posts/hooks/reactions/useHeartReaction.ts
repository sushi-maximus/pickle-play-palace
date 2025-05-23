
import { useState } from "react";
import { reactionService } from "./reactionService";

interface UseHeartReactionProps {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  thumbsUpCount: number;
  thumbsDownCount: number;
  setIsThumbsUpActive: (active: boolean) => void;
  setIsThumbsDownActive: (active: boolean) => void;
  setThumbsUpCount: (count: number) => void;
  setThumbsDownCount: (count: number) => void;
}

export const useHeartReaction = ({
  postId,
  userId,
  initialCount,
  initialIsActive,
  isThumbsUpActive,
  isThumbsDownActive,
  thumbsUpCount,
  thumbsDownCount,
  setIsThumbsUpActive,
  setIsThumbsDownActive,
  setThumbsUpCount,
  setThumbsDownCount
}: UseHeartReactionProps) => {
  const [heartCount, setHeartCount] = useState(initialCount);
  const [isHeartActive, setIsHeartActive] = useState(initialIsActive);
  const [isHeartSubmitting, setIsHeartSubmitting] = useState(false);

  const toggleHeart = async () => {
    if (!userId || isHeartSubmitting) return;

    setIsHeartSubmitting(true);
    
    // Store original states for potential rollback
    const originalIsActive = isHeartActive;
    const originalCount = heartCount;
    const originalThumbsUpActive = isThumbsUpActive;
    const originalThumbsDownActive = isThumbsDownActive;
    const originalThumbsUpCount = thumbsUpCount;
    const originalThumbsDownCount = thumbsDownCount;
    
    // Optimistic update
    const newIsActive = !isHeartActive;
    const newCount = newIsActive ? heartCount + 1 : heartCount - 1;
    
    // If activating heart, deactivate both thumbs reactions
    if (newIsActive) {
      if (isThumbsUpActive) {
        setIsThumbsUpActive(false);
        setThumbsUpCount(thumbsUpCount - 1);
      }
      if (isThumbsDownActive) {
        setIsThumbsDownActive(false);
        setThumbsDownCount(thumbsDownCount - 1);
      }
    }
    
    setIsHeartActive(newIsActive);
    setHeartCount(newCount);

    try {
      if (newIsActive) {
        // First, delete all existing reactions for this user and post to avoid duplicates
        await reactionService.deleteAllUserReactions(postId, userId);
        
        // Then add the heart reaction
        await reactionService.addReaction(postId, userId, 'heart');
      } else {
        // Just remove the heart reaction
        await reactionService.deleteReaction(postId, userId, 'heart');
      }
    } catch (error) {
      console.error('Error toggling heart reaction:', error);
      // Revert all optimistic updates on error
      setIsHeartActive(originalIsActive);
      setHeartCount(originalCount);
      setIsThumbsUpActive(originalThumbsUpActive);
      setIsThumbsDownActive(originalThumbsDownActive);
      setThumbsUpCount(originalThumbsUpCount);
      setThumbsDownCount(originalThumbsDownCount);
    } finally {
      setIsHeartSubmitting(false);
    }
  };

  return {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeart,
    setHeartCount,
    setIsHeartActive
  };
};

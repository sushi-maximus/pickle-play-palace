
import { useState } from "react";
import { reactionService } from "./reactions/reactionService";
import { UsePostReactions2Props, PostReactionType2 } from "./reactions/types";

export type { PostReactionType2 };

export const usePostReactions2 = ({
  postId,
  userId,
  initialThumbsUp,
  initialThumbsDown,
  initialHeart,
  initialUserThumbsUp,
  initialUserThumbsDown,
  initialUserHeart
}: UsePostReactions2Props) => {
  // Individual reaction states
  const [thumbsUpCount, setThumbsUpCount] = useState(initialThumbsUp);
  const [thumbsDownCount, setThumbsDownCount] = useState(initialThumbsDown);
  const [heartCount, setHeartCount] = useState(initialHeart);
  const [isThumbsUpActive, setIsThumbsUpActive] = useState(initialUserThumbsUp);
  const [isThumbsDownActive, setIsThumbsDownActive] = useState(initialUserThumbsDown);
  const [isHeartActive, setIsHeartActive] = useState(initialUserHeart);
  
  // Submission states
  const [isThumbsUpSubmitting, setIsThumbsUpSubmitting] = useState(false);
  const [isThumbsDownSubmitting, setIsThumbsDownSubmitting] = useState(false);
  const [isHeartSubmitting, setIsHeartSubmitting] = useState(false);

  const isAnySubmitting = isThumbsUpSubmitting || isThumbsDownSubmitting || isHeartSubmitting;

  const toggleThumbsUp = async () => {
    if (!userId || isAnySubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    // Store original states for rollback
    const originalStates = {
      thumbsUp: { count: thumbsUpCount, active: isThumbsUpActive },
      thumbsDown: { count: thumbsDownCount, active: isThumbsDownActive },
      heart: { count: heartCount, active: isHeartActive }
    };
    
    try {
      const newIsActive = !isThumbsUpActive;
      const newCount = newIsActive ? thumbsUpCount + 1 : thumbsUpCount - 1;
      
      // Optimistic updates
      setIsThumbsUpActive(newIsActive);
      setThumbsUpCount(Math.max(0, newCount));
      
      // If activating thumbs up, deactivate others
      if (newIsActive) {
        if (isThumbsDownActive) {
          setIsThumbsDownActive(false);
          setThumbsDownCount(Math.max(0, thumbsDownCount - 1));
        }
        if (isHeartActive) {
          setIsHeartActive(false);
          setHeartCount(Math.max(0, heartCount - 1));
        }
      }

      // API call
      if (newIsActive) {
        await reactionService.addReaction(postId, userId, 'thumbsup');
      } else {
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
      }
    } catch (error) {
      console.error('Error toggling thumbs up:', error);
      // Rollback all changes
      setThumbsUpCount(originalStates.thumbsUp.count);
      setIsThumbsUpActive(originalStates.thumbsUp.active);
      setThumbsDownCount(originalStates.thumbsDown.count);
      setIsThumbsDownActive(originalStates.thumbsDown.active);
      setHeartCount(originalStates.heart.count);
      setIsHeartActive(originalStates.heart.active);
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  const toggleThumbsDown = async () => {
    if (!userId || isAnySubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    // Store original states for rollback
    const originalStates = {
      thumbsUp: { count: thumbsUpCount, active: isThumbsUpActive },
      thumbsDown: { count: thumbsDownCount, active: isThumbsDownActive },
      heart: { count: heartCount, active: isHeartActive }
    };
    
    try {
      const newIsActive = !isThumbsDownActive;
      const newCount = newIsActive ? thumbsDownCount + 1 : thumbsDownCount - 1;
      
      // Optimistic updates
      setIsThumbsDownActive(newIsActive);
      setThumbsDownCount(Math.max(0, newCount));
      
      // If activating thumbs down, deactivate others
      if (newIsActive) {
        if (isThumbsUpActive) {
          setIsThumbsUpActive(false);
          setThumbsUpCount(Math.max(0, thumbsUpCount - 1));
        }
        if (isHeartActive) {
          setIsHeartActive(false);
          setHeartCount(Math.max(0, heartCount - 1));
        }
      }

      // API call
      if (newIsActive) {
        await reactionService.addReaction(postId, userId, 'thumbsdown');
      } else {
        await reactionService.deleteReaction(postId, userId, 'thumbsdown');
      }
    } catch (error) {
      console.error('Error toggling thumbs down:', error);
      // Rollback all changes
      setThumbsUpCount(originalStates.thumbsUp.count);
      setIsThumbsUpActive(originalStates.thumbsUp.active);
      setThumbsDownCount(originalStates.thumbsDown.count);
      setIsThumbsDownActive(originalStates.thumbsDown.active);
      setHeartCount(originalStates.heart.count);
      setIsHeartActive(originalStates.heart.active);
    } finally {
      setIsThumbsDownSubmitting(false);
    }
  };

  const toggleHeart = async () => {
    if (!userId || isAnySubmitting) return;

    setIsHeartSubmitting(true);
    
    // Store original states for rollback
    const originalStates = {
      thumbsUp: { count: thumbsUpCount, active: isThumbsUpActive },
      thumbsDown: { count: thumbsDownCount, active: isThumbsDownActive },
      heart: { count: heartCount, active: isHeartActive }
    };
    
    try {
      const newIsActive = !isHeartActive;
      const newCount = newIsActive ? heartCount + 1 : heartCount - 1;
      
      // Optimistic updates
      setIsHeartActive(newIsActive);
      setHeartCount(Math.max(0, newCount));
      
      // If activating heart, deactivate others
      if (newIsActive) {
        if (isThumbsUpActive) {
          setIsThumbsUpActive(false);
          setThumbsUpCount(Math.max(0, thumbsUpCount - 1));
        }
        if (isThumbsDownActive) {
          setIsThumbsDownActive(false);
          setThumbsDownCount(Math.max(0, thumbsDownCount - 1));
        }
      }

      // API call
      if (newIsActive) {
        await reactionService.addReaction(postId, userId, 'heart');
      } else {
        await reactionService.deleteReaction(postId, userId, 'heart');
      }
    } catch (error) {
      console.error('Error toggling heart:', error);
      // Rollback all changes
      setThumbsUpCount(originalStates.thumbsUp.count);
      setIsThumbsUpActive(originalStates.thumbsUp.active);
      setThumbsDownCount(originalStates.thumbsDown.count);
      setIsThumbsDownActive(originalStates.thumbsDown.active);
      setHeartCount(originalStates.heart.count);
      setIsHeartActive(originalStates.heart.active);
    } finally {
      setIsHeartSubmitting(false);
    }
  };

  return {
    thumbsUpCount,
    thumbsDownCount,
    heartCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    toggleThumbsUp,
    toggleThumbsDown,
    toggleHeart
  };
};

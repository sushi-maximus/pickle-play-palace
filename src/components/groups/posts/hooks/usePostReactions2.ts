
import { useState, useEffect } from "react";
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
  // Debug logging for initial values
  console.log(`Post ${postId} initial values:`, {
    initialThumbsUp,
    initialThumbsDown,
    initialHeart,
    initialUserThumbsUp,
    initialUserThumbsDown,
    initialUserHeart
  });

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

  // Update states when initial values change (e.g., after refresh)
  useEffect(() => {
    console.log(`Post ${postId} updating states with new initial values`);
    setThumbsUpCount(initialThumbsUp);
    setThumbsDownCount(initialThumbsDown);
    setHeartCount(initialHeart);
    setIsThumbsUpActive(initialUserThumbsUp);
    setIsThumbsDownActive(initialUserThumbsDown);
    setIsHeartActive(initialUserHeart);
  }, [
    postId,
    initialThumbsUp,
    initialThumbsDown,
    initialHeart,
    initialUserThumbsUp,
    initialUserThumbsDown,
    initialUserHeart
  ]);

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
      
      console.log(`Toggling thumbs up: ${isThumbsUpActive} -> ${newIsActive}`);
      
      // Optimistic updates
      setIsThumbsUpActive(newIsActive);
      setThumbsUpCount(Math.max(0, newCount));
      
      // If activating thumbs up, deactivate others
      if (newIsActive) {
        if (isThumbsDownActive) {
          console.log('Deactivating thumbs down due to thumbs up activation');
          setIsThumbsDownActive(false);
          setThumbsDownCount(Math.max(0, thumbsDownCount - 1));
        }
        if (isHeartActive) {
          console.log('Deactivating heart due to thumbs up activation');
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
      
      console.log(`Thumbs up toggle successful for post ${postId}`);
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
      
      console.log(`Toggling thumbs down: ${isThumbsDownActive} -> ${newIsActive}`);
      
      // Optimistic updates
      setIsThumbsDownActive(newIsActive);
      setThumbsDownCount(Math.max(0, newCount));
      
      // If activating thumbs down, deactivate others
      if (newIsActive) {
        if (isThumbsUpActive) {
          console.log('Deactivating thumbs up due to thumbs down activation');
          setIsThumbsUpActive(false);
          setThumbsUpCount(Math.max(0, thumbsUpCount - 1));
        }
        if (isHeartActive) {
          console.log('Deactivating heart due to thumbs down activation');
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
      
      console.log(`Thumbs down toggle successful for post ${postId}`);
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
      
      console.log(`Toggling heart: ${isHeartActive} -> ${newIsActive}`);
      
      // Optimistic updates
      setIsHeartActive(newIsActive);
      setHeartCount(Math.max(0, newCount));
      
      // If activating heart, deactivate others
      if (newIsActive) {
        if (isThumbsUpActive) {
          console.log('Deactivating thumbs up due to heart activation');
          setIsThumbsUpActive(false);
          setThumbsUpCount(Math.max(0, thumbsUpCount - 1));
        }
        if (isThumbsDownActive) {
          console.log('Deactivating thumbs down due to heart activation');
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
      
      console.log(`Heart toggle successful for post ${postId}`);
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

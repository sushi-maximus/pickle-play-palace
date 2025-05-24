
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
    
    const newIsActive = !isThumbsUpActive;
    console.log(`Toggling thumbs up: ${isThumbsUpActive} -> ${newIsActive}`);
    
    try {
      // Handle API calls first
      if (newIsActive) {
        // Only remove thumbs down if it exists (heart stays independent)
        if (isThumbsDownActive) {
          await reactionService.deleteReaction(postId, userId, 'thumbsdown');
          console.log('Deleted existing thumbs down reaction');
        }
        // Add thumbs up
        await reactionService.addReaction(postId, userId, 'thumbsup');
      } else {
        // Remove thumbs up
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
      }

      // Update state after successful API calls
      setIsThumbsUpActive(newIsActive);
      setThumbsUpCount(prev => newIsActive ? prev + 1 : Math.max(0, prev - 1));
      
      // Only deactivate thumbs down if thumbs up is being activated
      if (newIsActive && isThumbsDownActive) {
        setIsThumbsDownActive(false);
        setThumbsDownCount(prev => Math.max(0, prev - 1));
      }
      
      console.log(`Thumbs up toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling thumbs up:', error);
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  const toggleThumbsDown = async () => {
    if (!userId || isAnySubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    const newIsActive = !isThumbsDownActive;
    console.log(`Toggling thumbs down: ${isThumbsDownActive} -> ${newIsActive}`);
    
    try {
      // Handle API calls first
      if (newIsActive) {
        // Only remove thumbs up if it exists (heart stays independent)
        if (isThumbsUpActive) {
          await reactionService.deleteReaction(postId, userId, 'thumbsup');
          console.log('Deleted existing thumbs up reaction');
        }
        // Add thumbs down
        await reactionService.addReaction(postId, userId, 'thumbsdown');
      } else {
        // Remove thumbs down
        await reactionService.deleteReaction(postId, userId, 'thumbsdown');
      }

      // Update state after successful API calls
      setIsThumbsDownActive(newIsActive);
      setThumbsDownCount(prev => newIsActive ? prev + 1 : Math.max(0, prev - 1));
      
      // Only deactivate thumbs up if thumbs down is being activated
      if (newIsActive && isThumbsUpActive) {
        setIsThumbsUpActive(false);
        setThumbsUpCount(prev => Math.max(0, prev - 1));
      }
      
      console.log(`Thumbs down toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling thumbs down:', error);
    } finally {
      setIsThumbsDownSubmitting(false);
    }
  };

  const toggleHeart = async () => {
    if (!userId || isAnySubmitting) return;

    setIsHeartSubmitting(true);
    
    const newIsActive = !isHeartActive;
    console.log(`Toggling heart: ${isHeartActive} -> ${newIsActive}`);
    
    try {
      // Heart is independent - no need to remove other reactions
      if (newIsActive) {
        await reactionService.addReaction(postId, userId, 'heart');
      } else {
        await reactionService.deleteReaction(postId, userId, 'heart');
      }

      // Update heart state only
      setIsHeartActive(newIsActive);
      setHeartCount(prev => newIsActive ? prev + 1 : Math.max(0, prev - 1));
      
      console.log(`Heart toggle successful for post ${postId}`);
    } catch (error) {
      console.error('Error toggling heart:', error);
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

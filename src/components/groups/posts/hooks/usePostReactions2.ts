
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
    if (!userId || isThumbsUpSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    try {
      const wasActive = isThumbsUpActive;
      const wasThumbsDownActive = isThumbsDownActive;
      
      console.log(`Toggling thumbs up: currently ${wasActive}, thumbs down is ${wasThumbsDownActive}`);
      
      if (!wasActive) {
        // We're activating thumbs up
        // First remove thumbs down if it's active
        if (wasThumbsDownActive) {
          await reactionService.deleteReaction(postId, userId, 'thumbsdown');
          setIsThumbsDownActive(false);
          setThumbsDownCount(prev => Math.max(0, prev - 1));
          console.log('Removed thumbs down reaction');
        }
        
        // Then add thumbs up
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

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsDownSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    try {
      const wasActive = isThumbsDownActive;
      const wasThumbsUpActive = isThumbsUpActive;
      
      console.log(`Toggling thumbs down: currently ${wasActive}, thumbs up is ${wasThumbsUpActive}`);
      
      if (!wasActive) {
        // We're activating thumbs down
        // First remove thumbs up if it's active
        if (wasThumbsUpActive) {
          await reactionService.deleteReaction(postId, userId, 'thumbsup');
          setIsThumbsUpActive(false);
          setThumbsUpCount(prev => Math.max(0, prev - 1));
          console.log('Removed thumbs up reaction');
        }
        
        // Then add thumbs down
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

  const toggleHeart = async () => {
    if (!userId || isHeartSubmitting) return;

    setIsHeartSubmitting(true);
    
    try {
      const wasActive = isHeartActive;
      
      console.log(`Toggling heart: currently ${wasActive}`);
      
      if (!wasActive) {
        // We're activating heart - completely independent of thumbs reactions
        await reactionService.addReaction(postId, userId, 'heart');
        setIsHeartActive(true);
        setHeartCount(prev => prev + 1);
        console.log('Added heart reaction');
      } else {
        // We're deactivating heart - completely independent of thumbs reactions
        await reactionService.deleteReaction(postId, userId, 'heart');
        setIsHeartActive(false);
        setHeartCount(prev => Math.max(0, prev - 1));
        console.log('Removed heart reaction');
      }
      
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

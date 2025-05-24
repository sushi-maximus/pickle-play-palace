
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
    console.log(`=== THUMBS UP TOGGLE START ===`);
    console.log(`Post: ${postId}, User: ${userId}, Currently active: ${isThumbsUpActive}`);
    
    if (!userId || isThumbsUpSubmitting) {
      console.log(`Toggle blocked - userId: ${userId}, isSubmitting: ${isThumbsUpSubmitting}`);
      return;
    }

    setIsThumbsUpSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isThumbsUpActive;
    const currentCount = thumbsUpCount;
    console.log(`Current state - active: ${currentActive}, count: ${currentCount}`);
    
    try {
      console.log(`Toggling thumbs up: currently ${currentActive} for post ${postId}`);
      
      // Optimistically update UI first
      if (!currentActive) {
        console.log(`Adding thumbs up - updating UI optimistically`);
        setIsThumbsUpActive(true);
        setThumbsUpCount(prev => {
          console.log(`Count changing from ${prev} to ${prev + 1}`);
          return prev + 1;
        });
        console.log(`Making API call to add reaction...`);
        await reactionService.addReaction(postId, userId, 'thumbsup');
        console.log('Added thumbs up reaction - API call successful');
      } else {
        console.log(`Removing thumbs up - updating UI optimistically`);
        setIsThumbsUpActive(false);
        setThumbsUpCount(prev => {
          const newCount = Math.max(0, prev - 1);
          console.log(`Count changing from ${prev} to ${newCount}`);
          return newCount;
        });
        console.log(`Making API call to delete reaction...`);
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
        console.log('Removed thumbs up reaction - API call successful');
      }
      
      console.log(`Thumbs up toggle successful for post ${postId}`);
    } catch (error) {
      console.error('=== THUMBS UP ERROR OCCURRED ===');
      console.error('Error toggling thumbs up:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.log(`Rolling back to previous state - active: ${currentActive}, count: ${currentCount}`);
      // Revert to the original state on error
      setIsThumbsUpActive(currentActive);
      setThumbsUpCount(currentCount);
      console.log(`State rolled back successfully`);
    } finally {
      console.log(`Setting isThumbsUpSubmitting to false`);
      setIsThumbsUpSubmitting(false);
      console.log(`=== THUMBS UP TOGGLE END ===`);
    }
  };

  return {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp
  };
};

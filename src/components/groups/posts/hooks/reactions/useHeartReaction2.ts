
import { useState } from "react";
import { reactionService } from "./reactionService";

interface UseHeartReaction2Props {
  postId: string;
  userId?: string;
  initialCount: number;
  initialIsActive: boolean;
}

export const useHeartReaction2 = ({
  postId,
  userId,
  initialCount,
  initialIsActive
}: UseHeartReaction2Props) => {
  const [heartCount, setHeartCount] = useState(initialCount);
  const [isHeartActive, setIsHeartActive] = useState(initialIsActive);
  const [isHeartSubmitting, setIsHeartSubmitting] = useState(false);

  const toggleHeart = async () => {
    console.log(`=== HEART TOGGLE START ===`);
    console.log(`Post: ${postId}, User: ${userId}, Currently active: ${isHeartActive}`);
    
    if (!userId || isHeartSubmitting) {
      console.log(`Toggle blocked - userId: ${userId}, isSubmitting: ${isHeartSubmitting}`);
      return;
    }

    setIsHeartSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isHeartActive;
    const currentCount = heartCount;
    console.log(`Current state - active: ${currentActive}, count: ${currentCount}`);
    
    try {
      console.log(`Toggling heart: currently ${currentActive} for post ${postId}`);
      
      if (!currentActive) {
        console.log(`Adding heart - updating UI optimistically`);
        setIsHeartActive(true);
        setHeartCount(prev => {
          console.log(`Count changing from ${prev} to ${prev + 1}`);
          return prev + 1;
        });
        console.log(`Making API call to add reaction...`);
        await reactionService.addReaction(postId, userId, 'heart');
        console.log('Added heart reaction - API call successful');
      } else {
        console.log(`Removing heart - updating UI optimistically`);
        setIsHeartActive(false);
        setHeartCount(prev => {
          const newCount = Math.max(0, prev - 1);
          console.log(`Count changing from ${prev} to ${newCount}`);
          return newCount;
        });
        console.log(`Making API call to delete reaction...`);
        await reactionService.deleteReaction(postId, userId, 'heart');
        console.log('Removed heart reaction - API call successful');
      }
      
      console.log(`Heart toggle successful for post ${postId}`);
    } catch (error) {
      console.error('=== HEART ERROR OCCURRED ===');
      console.error('Error toggling heart:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.log(`Rolling back to previous state - active: ${currentActive}, count: ${currentCount}`);
      // Revert to the original state on error
      setIsHeartActive(currentActive);
      setHeartCount(currentCount);
      console.log(`State rolled back successfully`);
    } finally {
      console.log(`Setting isHeartSubmitting to false`);
      setIsHeartSubmitting(false);
      console.log(`=== HEART TOGGLE END ===`);
    }
  };

  return {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeart
  };
};

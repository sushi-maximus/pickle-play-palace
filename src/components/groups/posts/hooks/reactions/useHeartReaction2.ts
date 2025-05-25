
import { useState } from "react";
import { reactionService } from "./reactionService";
import { useOptimisticMutations } from "@/hooks/useOptimisticMutations";

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
  
  const { updatePostReactionOptimistically, rollbackOptimisticUpdate } = useOptimisticMutations();

  console.log(`🚀 === HEART HOOK INITIALIZED FOR POST ${postId} ===`);
  console.log(`Initial props received:`, {
    postId,
    userId,
    initialCount,
    initialIsActive,
    initialCountType: typeof initialCount,
    initialIsActiveType: typeof initialIsActive
  });
  console.log(`Current hook state:`, {
    heartCount,
    isHeartActive,
    isHeartSubmitting
  });

  const toggleHeart = async () => {
    console.log(`🎯 === HEART TOGGLE FUNCTION START ===`);
    console.log(`Toggle called for post: ${postId}, user: ${userId}`);
    console.log(`Current state before toggle:`, {
      heartCount,
      isHeartActive,
      isHeartSubmitting
    });
    
    if (!userId) {
      console.log(`❌ Toggle blocked - no userId provided`);
      return;
    }

    if (isHeartSubmitting) {
      console.log(`❌ Toggle blocked - already submitting (isHeartSubmitting: ${isHeartSubmitting})`);
      return;
    }

    console.log(`✅ Toggle proceeding - setting submitting state...`);
    setIsHeartSubmitting(true);
    
    // Store current state for potential rollback
    const currentActive = isHeartActive;
    const currentCount = heartCount;
    const countChange = currentActive ? -1 : 1;
    const newActive = !currentActive;
    
    console.log(`State transition planned:`, {
      from: { active: currentActive, count: currentCount },
      to: { active: newActive, count: currentCount + countChange },
      countChange
    });
    
    try {
      console.log(`🔄 Applying optimistic update...`);
      
      // Optimistic update - update UI immediately
      setIsHeartActive(newActive);
      setHeartCount(prev => Math.max(0, prev + countChange));
      
      // Update React Query cache optimistically
      updatePostReactionOptimistically(postId, 'heart', newActive, countChange);
      
      console.log(`📡 Making API call to ${newActive ? 'add' : 'remove'} heart reaction...`);
      
      if (newActive) {
        await reactionService.addReaction(postId, userId, 'heart');
        console.log('✅ API SUCCESS: Added heart reaction');
      } else {
        await reactionService.deleteReaction(postId, userId, 'heart');
        console.log('✅ API SUCCESS: Removed heart reaction');
      }
      
      console.log(`🎉 Heart toggle completed successfully for post ${postId}`);
    } catch (error) {
      console.error('💥 === HEART TOGGLE ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error?.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      console.log(`🔄 Rolling back optimistic update...`);
      console.log(`Reverting to previous state:`, {
        active: currentActive,
        count: currentCount
      });
      
      // Revert local state
      setIsHeartActive(currentActive);
      setHeartCount(currentCount);
      
      // Rollback optimistic update
      rollbackOptimisticUpdate(['posts']);
      
      console.log(`✅ Rollback completed`);
    } finally {
      console.log(`🏁 Setting isHeartSubmitting to false`);
      setIsHeartSubmitting(false);
      console.log(`🎯 === HEART TOGGLE FUNCTION END ===`);
    }
  };

  // Log the return values
  console.log(`📤 Hook returning:`, {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeartType: typeof toggleHeart
  });

  return {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeart
  };
};

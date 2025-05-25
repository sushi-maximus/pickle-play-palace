
import { useState } from "react";
import { reactionService } from "../../posts/hooks/reactions/reactionService";

interface UseFacebookLikeProps {
  postId: string;
  userId?: string;
  initialLikeCount: number;
  initialUserLiked: boolean;
}

export const useFacebookLike = ({ postId, userId, initialLikeCount, initialUserLiked }: UseFacebookLikeProps) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialUserLiked);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLike = async () => {
    if (!userId || isSubmitting) return;

    setIsSubmitting(true);
    
    // Store original states for potential rollback
    const originalIsLiked = isLiked;
    const originalCount = likeCount;
    
    // Optimistic update
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(Math.max(0, newCount));

    try {
      if (newIsLiked) {
        await reactionService.addReaction(postId, userId, 'thumbsup');
      } else {
        await reactionService.deleteReaction(postId, userId, 'thumbsup');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic updates on error
      setIsLiked(originalIsLiked);
      setLikeCount(originalCount);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    likeCount,
    isLiked,
    isSubmitting,
    toggleLike,
    isDisabled: !userId
  };
};

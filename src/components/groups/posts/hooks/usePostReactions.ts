
import { useState } from "react";
import { toast } from "sonner";
import { PostReactionType, UsePostReactionsProps, UsePostReactionsResult } from "./types/reactionTypes";
import { togglePostReaction } from "./utils/reactionUtils";

export type { PostReactionType } from "./types/reactionTypes";

export const usePostReactions = ({
  postId,
  userId,
  initialReactions = { like: 0, thumbsup: 0, thumbsdown: 0 },
  initialUserReactions = { like: false, thumbsup: false, thumbsdown: false }
}: UsePostReactionsProps): UsePostReactionsResult => {
  const [reactions, setReactions] = useState<Record<PostReactionType, number>>(initialReactions);
  const [userReactions, setUserReactions] = useState<Record<PostReactionType, boolean>>(initialUserReactions);
  const [isSubmitting, setIsSubmitting] = useState<Record<PostReactionType, boolean>>({
    like: false,
    thumbsup: false,
    thumbsdown: false
  });

  const toggleReaction = async (reactionType: PostReactionType) => {
    if (!userId || isSubmitting[reactionType]) return;

    setIsSubmitting(prev => ({ ...prev, [reactionType]: true }));
    
    try {
      const added = await togglePostReaction(postId, userId, reactionType);
      
      setUserReactions(prev => ({ ...prev, [reactionType]: added }));
      setReactions(prev => ({ 
        ...prev, 
        [reactionType]: added 
          ? prev[reactionType] + 1 
          : Math.max(0, prev[reactionType] - 1) 
      }));
    } catch (error) {
      console.error(`Error toggling ${reactionType} reaction:`, error);
      toast.error(`Failed to update reaction. Please try again.`);
    } finally {
      setIsSubmitting(prev => ({ ...prev, [reactionType]: false }));
    }
  };

  return {
    reactions,
    userReactions,
    isSubmitting,
    toggleReaction
  };
};

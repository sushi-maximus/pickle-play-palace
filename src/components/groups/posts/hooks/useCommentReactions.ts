
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ReactionType = "like" | "thumbsup" | "thumbsdown";

interface UseCommentReactionsProps {
  commentId: string;
  userId?: string;
  initialReactions?: Record<ReactionType, number>;
  initialUserReactions?: Record<ReactionType, boolean>;
}

export const useCommentReactions = ({
  commentId,
  userId,
  initialReactions = { like: 0, thumbsup: 0, thumbsdown: 0 },
  initialUserReactions = { like: false, thumbsup: false, thumbsdown: false }
}: UseCommentReactionsProps) => {
  const [reactions, setReactions] = useState<Record<ReactionType, number>>(initialReactions);
  const [userReactions, setUserReactions] = useState<Record<ReactionType, boolean>>(initialUserReactions);
  const [isSubmitting, setIsSubmitting] = useState<Record<ReactionType, boolean>>({
    like: false,
    thumbsup: false,
    thumbsdown: false
  });

  const toggleReaction = async (reactionType: ReactionType) => {
    if (!userId || isSubmitting[reactionType]) return;

    setIsSubmitting(prev => ({ ...prev, [reactionType]: true }));
    
    try {
      const { data: existingReaction } = await supabase
        .from("comment_reactions")
        .select("*")
        .eq("comment_id", commentId)
        .eq("user_id", userId)
        .eq("reaction_type", reactionType)
        .maybeSingle();

      if (existingReaction) {
        // Delete the reaction if it exists
        await supabase
          .from("comment_reactions")
          .delete()
          .eq("id", existingReaction.id);

        setUserReactions(prev => ({ ...prev, [reactionType]: false }));
        setReactions(prev => ({ ...prev, [reactionType]: Math.max(0, prev[reactionType] - 1) }));
      } else {
        // Add the reaction
        await supabase
          .from("comment_reactions")
          .insert({
            comment_id: commentId,
            user_id: userId,
            reaction_type: reactionType
          });

        setUserReactions(prev => ({ ...prev, [reactionType]: true }));
        setReactions(prev => ({ ...prev, [reactionType]: prev[reactionType] + 1 }));
      }
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


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type PostReactionType = "like" | "thumbsup" | "thumbsdown";

interface UsePostReactionsProps {
  postId: string;
  userId?: string;
  initialReactions?: Record<PostReactionType, number>;
  initialUserReactions?: Record<PostReactionType, boolean>;
}

export const usePostReactions = ({
  postId,
  userId,
  initialReactions = { like: 0, thumbsup: 0, thumbsdown: 0 },
  initialUserReactions = { like: false, thumbsup: false, thumbsdown: false }
}: UsePostReactionsProps) => {
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
      const { data: existingReaction } = await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .eq("reaction_type", reactionType)
        .maybeSingle();

      if (existingReaction) {
        // Delete the reaction if it exists
        await supabase
          .from("reactions")
          .delete()
          .eq("id", existingReaction.id);

        setUserReactions(prev => ({ ...prev, [reactionType]: false }));
        setReactions(prev => ({ ...prev, [reactionType]: Math.max(0, prev[reactionType] - 1) }));
      } else {
        // Add the reaction
        await supabase
          .from("reactions")
          .insert({
            post_id: postId,
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

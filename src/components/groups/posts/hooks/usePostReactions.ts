import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Only add this line at the top of usePostReactions.ts
export type PostReactionType = "like" | "thumbsup" | "thumbsdown";

interface UsePostReactionsProps {
  postId: string;
  userId?: string;
  initialReactions: Record<PostReactionType, number>;
  initialUserReactions: Record<PostReactionType, boolean>;
}

interface UsePostReactionsResult {
  reactions: Record<PostReactionType, number>;
  userReactions: Record<PostReactionType, boolean>;
  isSubmitting: boolean;
  toggleReaction: (type: PostReactionType) => Promise<void>;
}

export const usePostReactions = ({
  postId,
  userId,
  initialReactions,
  initialUserReactions,
}: UsePostReactionsProps): UsePostReactionsResult => {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReactions, setUserReactions] = useState(initialUserReactions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleReaction = useCallback(async (type: PostReactionType) => {
    if (!userId) {
      console.log("User not logged in, cannot react.");
      return;
    }

    setIsSubmitting(true);
    const hasReacted = userReactions[type];
    const increment = hasReacted ? -1 : 1;

    try {
      if (hasReacted) {
        // Remove the reaction
        const { error } = await supabase
          .from("reactions")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId)
          .eq("reaction_type", type);

        if (error) throw error;
      } else {
        // Add the reaction
        const { error } = await supabase
          .from("reactions")
          .insert([{ post_id: postId, user_id: userId, reaction_type: type }]);

        if (error) throw error;
      }

      // Optimistically update the state
      setReactions((prevReactions) => ({
        ...prevReactions,
        [type]: prevReactions[type] + increment,
      }));

      setUserReactions((prevUserReactions) => ({
        ...prevUserReactions,
        [type]: !prevUserReactions[type],
      }));
    } catch (error: any) {
      console.error("Error toggling reaction:", error.message);
      // Revert the state on error (optional, depends on UX)
      // setReactions(initialReactions);
      // setUserReactions(initialUserReactions);
    } finally {
      setIsSubmitting(false);
    }
  }, [postId, userId, userReactions]);

  return {
    reactions,
    userReactions,
    isSubmitting,
    toggleReaction,
  };
};

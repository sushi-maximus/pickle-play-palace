
import { supabase } from "@/integrations/supabase/client";
import { CommentReactionType2 } from "./commentReactionTypes";

export const commentReactionService = {
  async deleteReaction(commentId: string, userId: string, reactionType: CommentReactionType2) {
    const { error } = await supabase
      .from('comment_reactions')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .eq('reaction_type', reactionType);

    if (error) {
      throw error;
    }
  },

  async addReaction(commentId: string, userId: string, reactionType: CommentReactionType2) {
    const { error } = await supabase
      .from('comment_reactions')
      .insert({
        comment_id: commentId,
        user_id: userId,
        reaction_type: reactionType
      });

    if (error) {
      throw error;
    }
  }
};

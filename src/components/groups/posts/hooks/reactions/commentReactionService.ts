
import { supabase } from "@/integrations/supabase/client";
import { CommentReactionType2 } from "./commentReactionTypes";

export const commentReactionService = {
  async deleteReaction(commentId: string, userId: string, reactionType: CommentReactionType2) {
    console.log(`Deleting ${reactionType} comment reaction for comment ${commentId} user ${userId}`);
    
    const { error } = await supabase
      .from('comment_reactions')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .eq('reaction_type', reactionType);

    if (error) {
      console.error(`Error deleting ${reactionType} comment reaction:`, error);
      throw error;
    }
    console.log(`Successfully deleted ${reactionType} comment reaction`);
  },

  async addReaction(commentId: string, userId: string, reactionType: CommentReactionType2) {
    console.log(`Adding ${reactionType} comment reaction for comment ${commentId} user ${userId}`);
    
    const { error } = await supabase
      .from('comment_reactions')
      .insert({
        comment_id: commentId,
        user_id: userId,
        reaction_type: reactionType
      });

    if (error) {
      console.error(`Error adding ${reactionType} comment reaction:`, error);
      throw error;
    }
    console.log(`Successfully added ${reactionType} comment reaction`);
  }
};

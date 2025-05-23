
import { supabase } from "@/integrations/supabase/client";
import { PostReactionType2 } from "./types";

export const reactionService = {
  async deleteReaction(postId: string, userId: string, reactionType: PostReactionType2) {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('reaction_type', reactionType);

    if (error) throw error;
  },

  async deleteAllUserReactions(postId: string, userId: string) {
    await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
  },

  async addReaction(postId: string, userId: string, reactionType: PostReactionType2) {
    const { error } = await supabase
      .from('reactions')
      .insert({
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType
      });

    if (error) throw error;
  }
};

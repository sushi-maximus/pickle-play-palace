
import { supabase } from "@/integrations/supabase/client";
import { PostReactionType2 } from "./types";

export const reactionService = {
  async deleteReaction(postId: string, userId: string, reactionType: PostReactionType2) {
    console.log(`Deleting ${reactionType} reaction for post ${postId} user ${userId}`);
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('reaction_type', reactionType);

    if (error) {
      console.error(`Error deleting ${reactionType} reaction:`, error);
      throw error;
    }
    console.log(`Successfully deleted ${reactionType} reaction`);
  },

  async deleteAllUserReactions(postId: string, userId: string) {
    console.log(`Deleting all reactions for post ${postId} user ${userId}`);
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting all user reactions:', error);
      throw error;
    }
    console.log('Successfully deleted all user reactions');
  },

  async addReaction(postId: string, userId: string, reactionType: PostReactionType2) {
    console.log(`Adding ${reactionType} reaction for post ${postId} user ${userId}`);
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    console.log('Current authenticated user:', user.id);
    console.log('UserId parameter:', userId);
    
    // Make sure the userId matches the authenticated user
    if (user.id !== userId) {
      throw new Error('User ID mismatch - security violation');
    }
    
    // Insert the reaction - the unique constraint will prevent duplicates automatically
    const { error } = await supabase
      .from('reactions')
      .insert({
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType
      });

    if (error) {
      console.error(`Error adding ${reactionType} reaction:`, error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      throw error;
    }
    console.log(`Successfully added ${reactionType} reaction`);
  }
};

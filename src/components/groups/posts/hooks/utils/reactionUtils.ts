
import { supabase } from "@/integrations/supabase/client";
import { PostReactionType } from "../types/reactionTypes";

export const fetchPostReactionCounts = async (postId: string): Promise<Record<PostReactionType, number>> => {
  try {
    // Count different types of reactions
    const { count: likeCount } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)
      .eq("reaction_type", "like");

    const { count: thumbsUpCount } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)
      .eq("reaction_type", "thumbsup");

    const { count: thumbsDownCount } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)
      .eq("reaction_type", "thumbsdown");
    
    return {
      like: likeCount || 0,
      thumbsup: thumbsUpCount || 0,
      thumbsdown: thumbsDownCount || 0
    };
  } catch (error) {
    console.error("Error fetching reaction counts:", error);
    return { like: 0, thumbsup: 0, thumbsdown: 0 };
  }
};

export const fetchUserReactions = async (postId: string, userId?: string): Promise<Record<PostReactionType, boolean>> => {
  if (!userId) {
    return { like: false, thumbsup: false, thumbsdown: false };
  }
  
  try {
    const { data: likeReaction } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .eq("reaction_type", "like")
      .maybeSingle();
    
    const { data: thumbsUpReaction } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .eq("reaction_type", "thumbsup")
      .maybeSingle();
    
    const { data: thumbsDownReaction } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .eq("reaction_type", "thumbsdown")
      .maybeSingle();
    
    return {
      like: !!likeReaction,
      thumbsup: !!thumbsUpReaction,
      thumbsdown: !!thumbsDownReaction
    };
  } catch (error) {
    console.error("Error fetching user reactions:", error);
    return { like: false, thumbsup: false, thumbsdown: false };
  }
};

export const togglePostReaction = async (
  postId: string, 
  userId: string, 
  reactionType: PostReactionType
): Promise<boolean> => {
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
        
      return false; // Reaction removed
    } else {
      // Add the reaction
      await supabase
        .from("reactions")
        .insert({
          post_id: postId,
          user_id: userId,
          reaction_type: reactionType
        });
        
      return true; // Reaction added
    }
  } catch (error) {
    console.error(`Error toggling ${reactionType} reaction:`, error);
    throw new Error(`Failed to update reaction. Please try again.`);
  }
};

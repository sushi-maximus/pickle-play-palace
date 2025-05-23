
import { supabase } from "@/integrations/supabase/client";
import { GroupPost } from "../types";
import { PostReactionType } from "../usePostReactions";

// Helper function to enrich post data with user info, reactions, etc.
export const enrichPostData = async (post: any, userId?: string): Promise<GroupPost> => {
  try {
    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url")
      .eq("id", post.user_id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
    }

    // Count different types of reactions
    const { count: likeCount } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id)
      .eq("reaction_type", "like");

    const { count: thumbsUpCount } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id)
      .eq("reaction_type", "thumbsup");

    const { count: thumbsDownCount } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id)
      .eq("reaction_type", "thumbsdown");

    // Count comments
    const { count: commentsCount } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);

    // Check if current user has reacted to this post
    let userLike = false;
    let userThumbsUp = false;
    let userThumbsDown = false;
    
    if (userId) {
      const { data: likeReaction } = await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", post.id)
        .eq("user_id", userId)
        .eq("reaction_type", "like")
        .maybeSingle();
      
      const { data: thumbsUpReaction } = await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", post.id)
        .eq("user_id", userId)
        .eq("reaction_type", "thumbsup")
        .maybeSingle();
      
      const { data: thumbsDownReaction } = await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", post.id)
        .eq("user_id", userId)
        .eq("reaction_type", "thumbsdown")
        .maybeSingle();
      
      userLike = !!likeReaction;
      userThumbsUp = !!thumbsUpReaction;
      userThumbsDown = !!thumbsDownReaction;
    }

    return {
      ...post,
      user: userData || { 
        id: post.user_id, 
        first_name: "Unknown", 
        last_name: "User" 
      },
      reactions: {
        like: likeCount || 0,
        thumbsup: thumbsUpCount || 0,
        thumbsdown: thumbsDownCount || 0
      },
      comments_count: commentsCount || 0,
      user_reactions: {
        like: userLike,
        thumbsup: userThumbsUp,
        thumbsdown: userThumbsDown
      }
    };
  } catch (err) {
    console.error("Error enriching post data:", err);
    return post; // Return the original post if enrichment fails
  }
};

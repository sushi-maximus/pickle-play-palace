
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "../types/commentTypes";

// Helper function to enrich comment data with user and reaction information
export async function enrichCommentData(comment: any, userId?: string): Promise<Comment> {
  try {
    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url")
      .eq("id", comment.user_id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
    }

    // Get thumbsup reactions count
    const { count: thumbsUpCount } = await supabase
      .from("comment_reactions")
      .select("*", { count: "exact", head: true })
      .eq("comment_id", comment.id)
      .eq("reaction_type", "thumbsup");

    // Get thumbsdown reactions count
    const { count: thumbsDownCount } = await supabase
      .from("comment_reactions")
      .select("*", { count: "exact", head: true })
      .eq("comment_id", comment.id)
      .eq("reaction_type", "thumbsdown");

    // Check if current user has reacted to this comment
    let userThumbsUp = false;
    let userThumbsDown = false;
    
    if (userId) {
      const { data: thumbsUpReaction } = await supabase
        .from("comment_reactions")
        .select("*")
        .eq("comment_id", comment.id)
        .eq("user_id", userId)
        .eq("reaction_type", "thumbsup")
        .maybeSingle();
      
      const { data: thumbsDownReaction } = await supabase
        .from("comment_reactions")
        .select("*")
        .eq("comment_id", comment.id)
        .eq("user_id", userId)
        .eq("reaction_type", "thumbsdown")
        .maybeSingle();
      
      userThumbsUp = !!thumbsUpReaction;
      userThumbsDown = !!thumbsDownReaction;
    }

    return {
      ...comment,
      user: userData || { 
        id: comment.user_id, 
        first_name: "Unknown", 
        last_name: "User" 
      },
      reactions: {
        thumbsup: thumbsUpCount || 0,
        thumbsdown: thumbsDownCount || 0
      },
      user_reactions: {
        thumbsup: userThumbsUp,
        thumbsdown: userThumbsDown
      }
    };
  } catch (err) {
    console.error("Error enriching comment data:", err);
    return comment; // Return the original comment if enrichment fails
  }
}

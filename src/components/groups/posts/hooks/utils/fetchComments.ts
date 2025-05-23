
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "../types/commentTypes";
import { enrichCommentData } from "./commentEnrichment";

export const fetchCommentsForPost = async (postId: string, userId?: string): Promise<Comment[]> => {
  try {
    // Get comments for this post
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select(`*`)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (commentsError) {
      throw commentsError;
    }

    // If no comments, return early
    if (!commentsData || commentsData.length === 0) {
      return [];
    }

    // Enrich each comment with user and reaction data
    return await Promise.all(
      commentsData.map(comment => enrichCommentData(comment, userId))
    );
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw new Error("Failed to load comments. Please try again later.");
  }
};

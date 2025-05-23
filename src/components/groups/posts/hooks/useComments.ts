
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReactionType } from "./useCommentReactions";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  reactions?: Record<ReactionType, number>;
  user_reactions?: Record<ReactionType, boolean>;
}

export const useComments = (postId: string, userId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
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
        setComments([]);
        setLoading(false);
        return;
      }

      // For each comment, fetch the user info and reactions
      const commentsWithData = await Promise.all(
        commentsData.map(async (comment) => {
          // Fetch user data
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .eq("id", comment.user_id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
          }

          // Get like reactions count
          const { count: likeCount } = await supabase
            .from("comment_reactions")
            .select("*", { count: "exact", head: true })
            .eq("comment_id", comment.id)
            .eq("reaction_type", "like");

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
          let userLike = false;
          let userThumbsUp = false;
          let userThumbsDown = false;
          
          if (userId) {
            const { data: likeReaction } = await supabase
              .from("comment_reactions")
              .select("*")
              .eq("comment_id", comment.id)
              .eq("user_id", userId)
              .eq("reaction_type", "like")
              .maybeSingle();

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
            
            userLike = !!likeReaction;
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
              like: likeCount || 0,
              thumbsup: thumbsUpCount || 0,
              thumbsdown: thumbsDownCount || 0
            },
            user_reactions: {
              like: userLike,
              thumbsup: userThumbsUp,
              thumbsdown: userThumbsDown
            }
          };
        })
      );

      setComments(commentsWithData);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, userId]);

  return {
    comments,
    loading,
    error,
    refreshComments: fetchComments
  };
};

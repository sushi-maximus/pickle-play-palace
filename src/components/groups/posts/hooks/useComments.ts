
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
}

export const useComments = (postId: string) => {
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

      // For each comment, fetch the user info separately
      const commentsWithUserData = await Promise.all(
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

          return {
            ...comment,
            user: userData || { 
              id: comment.user_id, 
              first_name: "Unknown", 
              last_name: "User" 
            }
          };
        })
      );

      setComments(commentsWithUserData);
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
  }, [postId]);

  return {
    comments,
    loading,
    error,
    refreshComments: fetchComments
  };
};


import { useState, useEffect, useRef } from "react";
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
  const channelRef = useRef<any>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Helper function to enrich comment data
  const enrichCommentData = async (comment: any): Promise<Comment> => {
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
  };

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

      // Enrich each comment with user and reaction data
      const commentsWithData = await Promise.all(
        commentsData.map(comment => enrichCommentData(comment))
      );

      setComments(commentsWithData);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscriptions when component mounts
  useEffect(() => {
    if (postId) {
      fetchComments();

      // Setup real-time subscription
      const channel = supabase
        .channel('comments-changes')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public',
            table: 'comments',
            filter: `post_id=eq.${postId}`
          },
          async (payload) => {
            console.log('Comments change received:', payload);
            
            if (payload.eventType === 'INSERT') {
              // Add new comment
              const newComment = await enrichCommentData(payload.new);
              setComments(current => [...current, newComment]);
            } 
            else if (payload.eventType === 'UPDATE') {
              // Update existing comment
              const updatedComment = await enrichCommentData(payload.new);
              setComments(current => 
                current.map(comment => comment.id === updatedComment.id ? updatedComment : comment)
              );
            }
            else if (payload.eventType === 'DELETE') {
              // Remove deleted comment
              setComments(current => 
                current.filter(comment => comment.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
      
      channelRef.current = channel;

      // Handle page visibility changes
      const handleVisibilityChange = () => {
        const isVisible = document.visibilityState === 'visible';
        isVisibleRef.current = isVisible;
        
        if (!isVisible && channelRef.current) {
          console.log('Page hidden, removing comments real-time subscription');
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        } else if (isVisible && !channelRef.current) {
          console.log('Page visible again, resubscribing to comments real-time updates');
          const newChannel = supabase
            .channel('comments-changes')
            .on(
              'postgres_changes',
              { 
                event: '*', 
                schema: 'public',
                table: 'comments',
                filter: `post_id=eq.${postId}`
              },
              async (payload) => {
                console.log('Comments change received:', payload);
                
                if (payload.eventType === 'INSERT') {
                  const newComment = await enrichCommentData(payload.new);
                  setComments(current => [...current, newComment]);
                } 
                else if (payload.eventType === 'UPDATE') {
                  const updatedComment = await enrichCommentData(payload.new);
                  setComments(current => 
                    current.map(comment => comment.id === updatedComment.id ? updatedComment : comment)
                  );
                }
                else if (payload.eventType === 'DELETE') {
                  setComments(current => 
                    current.filter(comment => comment.id !== payload.old.id)
                  );
                }
              }
            )
            .subscribe();
          
          channelRef.current = newChannel;
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Clean up when component unmounts
      return () => {
        console.log('Cleaning up comments subscription');
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [postId, userId]);

  return {
    comments,
    loading,
    error,
    refreshComments: fetchComments
  };
};

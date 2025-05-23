
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Comment, UseCommentsResult, OptimisticComment } from "./types/commentTypes";
import { fetchCommentsForPost } from "./utils/fetchComments";
import { setupCommentsRealtimeSubscription } from "./utils/commentRealtimeUtils";
import { v4 as uuidv4 } from "uuid";

export type { Comment };

export const useComments = (postId: string, userId?: string): UseCommentsResult => {
  const [comments, setComments] = useState<OptimisticComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
  const isVisibleRef = useRef<boolean>(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentsWithData = await fetchCommentsForPost(postId, userId);
      setComments(commentsWithData);
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Add an optimistic comment
  const addOptimisticComment = useCallback((newComment: Partial<Comment>): string => {
    const tempId = uuidv4();
    const optimisticComment: OptimisticComment = {
      ...newComment,
      id: tempId,
      created_at: new Date().toISOString(),
      isOptimistic: true,
      tempId,
      // Add default values for user if not provided
      user: newComment.user || {
        id: userId || "",
        first_name: "You",
        last_name: "",
      },
      reactions: { thumbsup: 0, thumbsdown: 0 },
      user_reactions: { thumbsup: false, thumbsdown: false }
    };
    
    setComments(prev => [...prev, optimisticComment]);
    return tempId;
  }, [userId]);

  // Update an optimistic comment
  const updateOptimisticComment = useCallback((id: string, content: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === id ? { ...comment, content } : comment
      )
    );
  }, []);

  // Remove an optimistic comment
  const removeOptimisticComment = useCallback((id: string) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
  }, []);

  // Setup real-time subscriptions when component mounts
  useEffect(() => {
    if (postId) {
      fetchComments();

      // Setup real-time subscription
      const channel = setupCommentsRealtimeSubscription(
        postId,
        isVisibleRef,
        setComments,
        userId
      );
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
          const newChannel = setupCommentsRealtimeSubscription(
            postId,
            isVisibleRef,
            setComments,
            userId
          );
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
    comments: comments as Comment[],
    loading,
    error,
    refreshComments: fetchComments,
    addOptimisticComment,
    updateOptimisticComment,
    removeOptimisticComment
  };
};

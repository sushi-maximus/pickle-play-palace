
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Comment, UseCommentsResult } from "./types/commentTypes";
import { fetchCommentsForPost } from "./utils/fetchComments";
import { setupCommentsRealtimeSubscription } from "./utils/commentRealtimeUtils";

export type { Comment };

export const useComments = (postId: string, userId?: string): UseCommentsResult => {
  const [comments, setComments] = useState<Comment[]>([]);
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
    comments,
    loading,
    error,
    refreshComments: fetchComments
  };
};

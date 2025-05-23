
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupPost, UseGroupPostsProps, UseGroupPostsResult } from "./types";
import { useFetchPosts } from "./useFetchPosts";
import { setupPostsRealtimeSubscription } from "./utils/realtimeUtils";

export * from "./types";

export const useGroupPosts = ({ groupId, userId }: UseGroupPostsProps): UseGroupPostsResult => {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
  const isVisibleRef = useRef<boolean>(true);
  const { fetchPosts, groupName } = useFetchPosts({ groupId, userId });

  const refreshPosts = async () => {
    try {
      setLoading(true);
      const postsWithData = await fetchPosts();
      setPosts(postsWithData);
    } catch (err) {
      console.error("Error in refreshPosts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscriptions when component mounts
  useEffect(() => {
    if (groupId) {
      refreshPosts();

      // Setup real-time subscription
      channelRef.current = setupPostsRealtimeSubscription(
        groupId, 
        isVisibleRef, 
        setPosts,
        userId
      );

      // Handle page visibility changes
      const handleVisibilityChange = () => {
        const isVisible = document.visibilityState === 'visible';
        isVisibleRef.current = isVisible;
        
        if (!isVisible && channelRef.current) {
          console.log('Page hidden, removing real-time subscription');
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        } else if (isVisible && !channelRef.current) {
          console.log('Page visible again, resubscribing to real-time updates');
          channelRef.current = setupPostsRealtimeSubscription(
            groupId, 
            isVisibleRef, 
            setPosts,
            userId
          );
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Clean up function to remove subscription when component unmounts
      return () => {
        console.log('Cleaning up group posts subscription');
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [groupId, userId]);

  return {
    posts,
    loading,
    error,
    groupName,
    refreshPosts
  };
};

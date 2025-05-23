
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PostReactionType, UsePostReactionsProps, UsePostReactionsResult } from "./types/reactionTypes";
import { fetchPostReactionCounts, togglePostReaction, fetchUserReactions } from "./utils/reactionUtils";

// Define response type for the RPC function return value
interface PostReactionCountsResponse {
  like_count: number;
  thumbsup_count: number;
  thumbsdown_count: number;
}

export type { PostReactionType } from "./types/reactionTypes";

export const usePostReactions = ({
  postId,
  userId,
  initialReactions = { like: 0, thumbsup: 0, thumbsdown: 0 },
  initialUserReactions = { like: false, thumbsup: false, thumbsdown: false }
}: UsePostReactionsProps): UsePostReactionsResult => {
  const [reactions, setReactions] = useState<Record<PostReactionType, number>>(initialReactions);
  const [userReactions, setUserReactions] = useState<Record<PostReactionType, boolean>>(initialUserReactions);
  const [isSubmitting, setIsSubmitting] = useState<Record<PostReactionType, boolean>>({
    like: false,
    thumbsup: false,
    thumbsdown: false
  });
  const isVisibleRef = useRef<boolean>(true);

  // Setup real-time subscription for post reactions
  useEffect(() => {
    if (!postId) return;
    
    isVisibleRef.current = true;
    
    const channel = supabase
      .channel(`post-reactions-${postId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'reactions',
          filter: `post_id=eq.${postId}`
        },
        async (payload) => {
          console.log('Post reaction change received:', payload);
          
          if (!isVisibleRef.current) return;
          
          // Re-fetch reaction counts since we don't know from the event which type changed
          try {
            const { data, error } = await supabase
              .rpc('get_post_reaction_counts', { post_id: postId })
              .returns<PostReactionCountsResponse>();
            
            if (!error && data) {
              setReactions({
                like: data.like_count || 0,
                thumbsup: data.thumbsup_count || 0,
                thumbsdown: data.thumbsdown_count || 0
              });
            } else {
              // Fallback to separate queries if the function has an error
              console.warn('Using fallback reaction count queries due to RPC error:', error);
              
              const updatedCounts = await fetchPostReactionCounts(postId);
              setReactions(updatedCounts);
            }
            
            if (userId && (payload.new as any)?.user_id === userId) {
              const reactionType = (payload.new as any)?.reaction_type as PostReactionType;
              
              if (payload.eventType === 'INSERT' && reactionType) {
                setUserReactions(prev => ({
                  ...prev,
                  [reactionType]: true
                }));
              } else if (payload.eventType === 'DELETE') {
                const deletedType = (payload.old as any)?.reaction_type as PostReactionType;
                if (deletedType) {
                  setUserReactions(prev => ({
                    ...prev,
                    [deletedType]: false
                  }));
                }
              }
            }
          } catch (error) {
            console.error('Error fetching updated reaction counts:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Post reaction subscription status for post ${postId}:`, status);
      });
    
    // Cleanup subscription when component unmounts
    return () => {
      isVisibleRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [postId, userId]);

  const handleToggleReaction = async (reactionType: PostReactionType) => {
    if (!userId || isSubmitting[reactionType]) return;

    setIsSubmitting(prev => ({ ...prev, [reactionType]: true }));
    
    // Apply optimistic update
    const currentValue = userReactions[reactionType];
    setUserReactions(prev => ({ ...prev, [reactionType]: !currentValue }));
    setReactions(prev => ({ 
      ...prev, 
      [reactionType]: currentValue 
        ? Math.max(0, prev[reactionType] - 1) 
        : prev[reactionType] + 1 
    }));
    
    try {
      const added = await togglePostReaction(postId, userId, reactionType);
      
      // If the server response doesn't match our optimistic update, revert
      if ((added && !userReactions[reactionType]) || (!added && userReactions[reactionType])) {
        // Server state matches our optimistic update, no need to do anything
      } else {
        // Revert optimistic update if there's a mismatch
        setUserReactions(prev => ({ ...prev, [reactionType]: currentValue }));
        setReactions(prev => ({
          ...prev,
          [reactionType]: currentValue
            ? prev[reactionType] + 1
            : Math.max(0, prev[reactionType] - 1)
        }));
      }
    } catch (error) {
      console.error(`Error toggling ${reactionType} reaction:`, error);
      toast.error(`Failed to update reaction. Please try again.`);
      
      // Revert optimistic update on error
      setUserReactions(prev => ({ ...prev, [reactionType]: currentValue }));
      setReactions(prev => ({
        ...prev,
        [reactionType]: currentValue
          ? prev[reactionType] + 1
          : Math.max(0, prev[reactionType] - 1)
      }));
    } finally {
      setIsSubmitting(prev => ({ ...prev, [reactionType]: false }));
    }
  };

  return {
    reactions,
    userReactions,
    isSubmitting,
    toggleReaction: handleToggleReaction
  };
};

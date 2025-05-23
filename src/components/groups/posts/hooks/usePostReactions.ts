import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PostReactionType, UsePostReactionsProps, UsePostReactionsResult } from "./types/reactionTypes";
import { fetchPostReactionCounts } from "./utils/reactionUtils";

// Define the return type for the RPC function
type PostReactionCountsResponse = {
  data: {
    like_count: number;
    thumbsup_count: number;
    thumbsdown_count: number;
  } | null;
  error: any;
};

// Define proper parameter type for the RPC function
interface GetPostReactionCountsParams {
  post_id: string;
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
            const { data: countData, error } = await supabase.rpc<{
              like_count: number;
              thumbsup_count: number;
              thumbsdown_count: number;
            }>(
              'get_post_reaction_counts', 
              { post_id: postId } as GetPostReactionCountsParams
            );
            
            if (!error && countData) {
              setReactions({
                like: countData.like_count || 0,
                thumbsup: countData.thumbsup_count || 0,
                thumbsdown: countData.thumbsdown_count || 0
              });
            } else {
              // Fallback to separate queries if the function has an error
              console.warn('Using fallback reaction count queries due to RPC error:', error);
              
              const { count: likeCount } = await supabase
                .from("reactions")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId)
                .eq("reaction_type", "like");

              const { count: thumbsUpCount } = await supabase
                .from("reactions")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId)
                .eq("reaction_type", "thumbsup");

              const { count: thumbsDownCount } = await supabase
                .from("reactions")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId)
                .eq("reaction_type", "thumbsdown");
                
              setReactions({
                like: likeCount || 0,
                thumbsup: thumbsUpCount || 0,
                thumbsdown: thumbsDownCount || 0
              });
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

  const toggleReaction = async (reactionType: PostReactionType) => {
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
    toggleReaction
  };
};

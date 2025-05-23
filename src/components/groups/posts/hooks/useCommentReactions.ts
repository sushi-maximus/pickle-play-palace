
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ReactionType = "thumbsup" | "thumbsdown";

interface UseCommentReactionsProps {
  commentId: string;
  userId?: string;
  initialReactions?: Record<ReactionType, number>;
  initialUserReactions?: Record<ReactionType, boolean>;
}

export const useCommentReactions = ({
  commentId,
  userId,
  initialReactions = { thumbsup: 0, thumbsdown: 0 },
  initialUserReactions = { thumbsup: false, thumbsdown: false }
}: UseCommentReactionsProps) => {
  const [reactions, setReactions] = useState<Record<ReactionType, number>>(initialReactions);
  const [userReactions, setUserReactions] = useState<Record<ReactionType, boolean>>(initialUserReactions);
  const [isSubmitting, setIsSubmitting] = useState<Record<ReactionType, boolean>>({
    thumbsup: false,
    thumbsdown: false
  });
  const isVisibleRef = useRef<boolean>(true);

  // Setup real-time subscription for comment reactions
  useEffect(() => {
    if (!commentId) return;
    
    isVisibleRef.current = true;
    
    const channel = supabase
      .channel(`comment-reactions-${commentId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'comment_reactions',
          filter: `comment_id=eq.${commentId}`
        },
        async (payload) => {
          console.log('Comment reaction change received:', payload);
          
          if (!isVisibleRef.current) return;

          try {
            // Re-fetch reaction counts for this comment
            const { count: thumbsUpCount } = await supabase
              .from("comment_reactions")
              .select("*", { count: "exact", head: true })
              .eq("comment_id", commentId)
              .eq("reaction_type", "thumbsup");

            const { count: thumbsDownCount } = await supabase
              .from("comment_reactions")
              .select("*", { count: "exact", head: true })
              .eq("comment_id", commentId)
              .eq("reaction_type", "thumbsdown");
            
            setReactions({
              thumbsup: thumbsUpCount || 0,
              thumbsdown: thumbsDownCount || 0
            });
            
            // If current user triggered this change, update their reactions
            if (userId && (payload.new as any)?.user_id === userId) {
              const reactionType = (payload.new as any)?.reaction_type as ReactionType;
              
              if (payload.eventType === 'INSERT' && reactionType) {
                setUserReactions(prev => ({
                  ...prev,
                  [reactionType]: true
                }));
              } else if (payload.eventType === 'DELETE') {
                const deletedType = (payload.old as any)?.reaction_type as ReactionType;
                if (deletedType) {
                  setUserReactions(prev => ({
                    ...prev,
                    [deletedType]: false
                  }));
                }
              }
            }
          } catch (error) {
            console.error('Error fetching updated comment reaction counts:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Comment reaction subscription status for comment ${commentId}:`, status);
      });
    
    // Cleanup subscription when component unmounts
    return () => {
      isVisibleRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [commentId, userId]);

  const toggleReaction = async (reactionType: ReactionType) => {
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
      const { data: existingReaction } = await supabase
        .from("comment_reactions")
        .select("*")
        .eq("comment_id", commentId)
        .eq("user_id", userId)
        .eq("reaction_type", reactionType)
        .maybeSingle();

      if (existingReaction) {
        // Delete the reaction if it exists
        await supabase
          .from("comment_reactions")
          .delete()
          .eq("id", existingReaction.id);

        // The real-time subscription will handle the state update
      } else {
        // Add the reaction
        await supabase
          .from("comment_reactions")
          .insert({
            comment_id: commentId,
            user_id: userId,
            reaction_type: reactionType
          });

        // The real-time subscription will handle the state update
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


import { supabase } from "@/integrations/supabase/client";
import { Comment, OptimisticComment } from "../types/commentTypes";
import { enrichCommentData } from "./commentEnrichment";

export type CommentsUpdateCallback = (updater: (comments: OptimisticComment[]) => OptimisticComment[]) => void;

// Setup Supabase real-time subscription for comments
export const setupCommentsRealtimeSubscription = (
  postId: string,
  isVisibleRef: React.MutableRefObject<boolean>,
  setComments: CommentsUpdateCallback,
  userId?: string
) => {
  if (!postId || !isVisibleRef.current) return null;
  
  console.log('Setting up real-time subscription for comments...');
  
  const channel = supabase
    .channel(`comments-changes-${postId}`)
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
          const newComment = await enrichCommentData(payload.new, userId);
          
          // Check if we have an optimistic version of this comment to replace
          setComments(current => {
            const optimisticIndex = current.findIndex(c => 
              c.isOptimistic && 
              c.user_id === newComment.user_id && 
              c.post_id === newComment.post_id && 
              c.content === newComment.content
            );
            
            if (optimisticIndex >= 0) {
              // Replace optimistic comment with real one
              const updated = [...current];
              updated[optimisticIndex] = newComment;
              return updated;
            } else {
              // No matching optimistic comment found, just add the new one
              return [...current, newComment];
            }
          });
        } 
        else if (payload.eventType === 'UPDATE') {
          // Update existing comment
          const updatedComment = await enrichCommentData(payload.new, userId);
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
    .subscribe((status) => {
      console.log(`Comment subscription status for post ${postId}:`, status);
    });
  
  return channel;
};

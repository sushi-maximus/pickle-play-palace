
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "../types/commentTypes";
import { enrichCommentData } from "./commentEnrichment";

export type CommentsUpdateCallback = (updater: (comments: Comment[]) => Comment[]) => void;

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
          const newComment = await enrichCommentData(payload.new, userId);
          setComments(current => [...current, newComment]);
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
    .subscribe();
  
  return channel;
};

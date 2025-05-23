
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PostReactionType2 = "thumbsup" | "thumbsdown" | "heart";

interface UsePostReactions2Props {
  postId: string;
  userId?: string;
  initialThumbsUp: number;
  initialThumbsDown: number;
  initialHeart: number;
  initialUserThumbsUp: boolean;
  initialUserThumbsDown: boolean;
  initialUserHeart: boolean;
}

export const usePostReactions2 = ({
  postId,
  userId,
  initialThumbsUp,
  initialThumbsDown,
  initialHeart,
  initialUserThumbsUp,
  initialUserThumbsDown,
  initialUserHeart
}: UsePostReactions2Props) => {
  const [thumbsUpCount, setThumbsUpCount] = useState(initialThumbsUp);
  const [thumbsDownCount, setThumbsDownCount] = useState(initialThumbsDown);
  const [heartCount, setHeartCount] = useState(initialHeart);
  const [isThumbsUpActive, setIsThumbsUpActive] = useState(initialUserThumbsUp);
  const [isThumbsDownActive, setIsThumbsDownActive] = useState(initialUserThumbsDown);
  const [isHeartActive, setIsHeartActive] = useState(initialUserHeart);
  const [isThumbsUpSubmitting, setIsThumbsUpSubmitting] = useState(false);
  const [isThumbsDownSubmitting, setIsThumbsDownSubmitting] = useState(false);
  const [isHeartSubmitting, setIsHeartSubmitting] = useState(false);

  const toggleThumbsUp = async () => {
    if (!userId || isThumbsUpSubmitting || isThumbsDownSubmitting || isHeartSubmitting) return;

    setIsThumbsUpSubmitting(true);
    
    // Optimistic update
    const newIsActive = !isThumbsUpActive;
    const newCount = newIsActive ? thumbsUpCount + 1 : thumbsUpCount - 1;
    
    // If activating thumbsup, ensure thumbsdown is deactivated
    if (newIsActive && isThumbsDownActive) {
      setIsThumbsDownActive(false);
      setThumbsDownCount(thumbsDownCount - 1);
    }
    
    setIsThumbsUpActive(newIsActive);
    setThumbsUpCount(newCount);

    try {
      if (newIsActive) {
        // Remove thumbsdown if it exists
        if (isThumbsDownActive) {
          await supabase
            .from('reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId)
            .eq('reaction_type', 'thumbsdown');
        }
        
        // Add thumbsup reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: 'thumbsup'
          });

        if (error) throw error;
      } else {
        // Remove thumbsup reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
          .eq('reaction_type', 'thumbsup');

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling thumbs up reaction:', error);
      // Revert optimistic update on error
      setIsThumbsUpActive(!newIsActive);
      setThumbsUpCount(newIsActive ? thumbsUpCount : thumbsUpCount + 1);
      
      // Also revert thumbs down changes if they were made
      if (newIsActive && isThumbsDownActive) {
        setIsThumbsDownActive(true);
        setThumbsDownCount(thumbsDownCount);
      }
    } finally {
      setIsThumbsUpSubmitting(false);
    }
  };

  const toggleThumbsDown = async () => {
    if (!userId || isThumbsUpSubmitting || isThumbsDownSubmitting || isHeartSubmitting) return;

    setIsThumbsDownSubmitting(true);
    
    // Optimistic update
    const newIsActive = !isThumbsDownActive;
    const newCount = newIsActive ? thumbsDownCount + 1 : thumbsDownCount - 1;
    
    // If activating thumbsdown, ensure thumbsup is deactivated
    if (newIsActive && isThumbsUpActive) {
      setIsThumbsUpActive(false);
      setThumbsUpCount(thumbsUpCount - 1);
    }
    
    setIsThumbsDownActive(newIsActive);
    setThumbsDownCount(newCount);

    try {
      if (newIsActive) {
        // Remove thumbsup if it exists
        if (isThumbsUpActive) {
          await supabase
            .from('reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId)
            .eq('reaction_type', 'thumbsup');
        }
        
        // Add thumbsdown reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: 'thumbsdown'
          });

        if (error) throw error;
      } else {
        // Remove thumbsdown reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
          .eq('reaction_type', 'thumbsdown');

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling thumbs down reaction:', error);
      // Revert optimistic update on error
      setIsThumbsDownActive(!newIsActive);
      setThumbsDownCount(newIsActive ? thumbsDownCount : thumbsDownCount + 1);
      
      // Also revert thumbs up changes if they were made
      if (newIsActive && isThumbsUpActive) {
        setIsThumbsUpActive(true);
        setThumbsUpCount(thumbsUpCount);
      }
    } finally {
      setIsThumbsDownSubmitting(false);
    }
  };

  const toggleHeart = async () => {
    if (!userId || isThumbsUpSubmitting || isThumbsDownSubmitting || isHeartSubmitting) return;

    setIsHeartSubmitting(true);
    
    // Store original states for potential rollback
    const originalIsActive = isHeartActive;
    const originalCount = heartCount;
    const originalThumbsUpActive = isThumbsUpActive;
    const originalThumbsDownActive = isThumbsDownActive;
    const originalThumbsUpCount = thumbsUpCount;
    const originalThumbsDownCount = thumbsDownCount;
    
    // Optimistic update
    const newIsActive = !isHeartActive;
    const newCount = newIsActive ? heartCount + 1 : heartCount - 1;
    
    // If activating heart, deactivate both thumbs reactions
    if (newIsActive) {
      if (isThumbsUpActive) {
        setIsThumbsUpActive(false);
        setThumbsUpCount(thumbsUpCount - 1);
      }
      if (isThumbsDownActive) {
        setIsThumbsDownActive(false);
        setThumbsDownCount(thumbsDownCount - 1);
      }
    }
    
    setIsHeartActive(newIsActive);
    setHeartCount(newCount);

    try {
      if (newIsActive) {
        // Remove any existing reactions for this user and post first
        await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        // Add heart reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: 'heart'
          });

        if (error) throw error;
      } else {
        // Remove heart reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
          .eq('reaction_type', 'heart');

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling heart reaction:', error);
      // Revert all optimistic updates on error
      setIsHeartActive(originalIsActive);
      setHeartCount(originalCount);
      setIsThumbsUpActive(originalThumbsUpActive);
      setIsThumbsDownActive(originalThumbsDownActive);
      setThumbsUpCount(originalThumbsUpCount);
      setThumbsDownCount(originalThumbsDownCount);
    } finally {
      setIsHeartSubmitting(false);
    }
  };

  return {
    thumbsUpCount,
    thumbsDownCount,
    heartCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    toggleThumbsUp,
    toggleThumbsDown,
    toggleHeart
  };
};

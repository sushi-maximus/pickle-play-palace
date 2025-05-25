
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/queryKeys";

interface Comment2 {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  post_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  thumbsup_count: number;
  thumbsdown_count: number;
  user_thumbsup: boolean;
  user_thumbsdown: boolean;
}

interface UseComments2Props {
  postId: string;
  userId?: string;
}

export const useComments2 = ({ postId, userId }: UseComments2Props) => {
  console.log(`🗨️ === USE COMMENTS2 HOOK CALLED ===`);
  console.log(`📍 Post ID: ${postId}`);
  console.log(`👤 User ID: ${userId}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);

  // Generate query key with userId for proper caching
  const queryKey = queryKeys.posts.comments(postId, userId);
  console.log(`🔑 COMMENTS QUERY KEY:`, queryKey);

  const {
    data: comments = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      console.log(`\n🎯 === COMMENTS QUERY FUNCTION EXECUTING ===`);
      console.log(`📊 Fetching comments for post: ${postId}`);
      console.log(`👤 Current user: ${userId}`);
      console.log(`🕐 Query function timestamp: ${new Date().toISOString()}`);

      try {
        // First fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
          throw commentsError;
        }

        console.log('Comments data:', commentsData);

        if (!commentsData || commentsData.length === 0) {
          console.log('No comments found');
          return [];
        }

        // Get unique user IDs
        const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
        console.log('Fetching profiles for users:', userIds);

        // Fetch user profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        console.log('Profiles data:', profilesData);

        // Get comment IDs for reaction queries
        const commentIds = commentsData.map(comment => comment.id);

        // Fetch all reactions for all comments
        const { data: reactionsData, error: reactionsError } = await supabase
          .from('comment_reactions')
          .select('comment_id, reaction_type')
          .in('comment_id', commentIds);

        if (reactionsError) {
          console.error('Error fetching reactions:', reactionsError);
          // Don't throw here, just log and continue without reactions
        }

        // Get user's reactions if userId is provided
        let userReactionsData = [];
        if (userId) {
          const { data, error: userReactionsError } = await supabase
            .from('comment_reactions')
            .select('comment_id, reaction_type')
            .in('comment_id', commentIds)
            .eq('user_id', userId);

          if (userReactionsError) {
            console.error('Error fetching user reactions:', userReactionsError);
            // Don't throw here, just log and continue without user reactions
          } else {
            userReactionsData = data || [];
          }
        }

        // Create maps for efficient lookups
        const profilesMap = new Map(
          (profilesData || []).map(profile => [profile.id, profile])
        );

        const thumbsupCountMap = new Map();
        const thumbsdownCountMap = new Map();
        (reactionsData || []).forEach(reaction => {
          if (reaction.reaction_type === 'thumbsup') {
            const current = thumbsupCountMap.get(reaction.comment_id) || 0;
            thumbsupCountMap.set(reaction.comment_id, current + 1);
          } else if (reaction.reaction_type === 'thumbsdown') {
            const current = thumbsdownCountMap.get(reaction.comment_id) || 0;
            thumbsdownCountMap.set(reaction.comment_id, current + 1);
          }
        });

        const userThumbsupSet = new Set();
        const userThumbsdownSet = new Set();
        userReactionsData.forEach(reaction => {
          if (reaction.reaction_type === 'thumbsup') {
            userThumbsupSet.add(reaction.comment_id);
          } else if (reaction.reaction_type === 'thumbsdown') {
            userThumbsdownSet.add(reaction.comment_id);
          }
        });

        // Combine comments with user data and reaction data
        const transformedComments = commentsData
          .map(comment => {
            const user = profilesMap.get(comment.user_id);
            if (!user) {
              console.warn('No profile found for user:', comment.user_id);
              return {
                ...comment,
                user: {
                  id: comment.user_id,
                  first_name: 'Unknown',
                  last_name: 'User',
                  avatar_url: null
                },
                thumbsup_count: thumbsupCountMap.get(comment.id) || 0,
                thumbsdown_count: thumbsdownCountMap.get(comment.id) || 0,
                user_thumbsup: userThumbsupSet.has(comment.id),
                user_thumbsdown: userThumbsdownSet.has(comment.id)
              };
            }
            
            return {
              ...comment,
              user,
              thumbsup_count: thumbsupCountMap.get(comment.id) || 0,
              thumbsdown_count: thumbsdownCountMap.get(comment.id) || 0,
              user_thumbsup: userThumbsupSet.has(comment.id),
              user_thumbsdown: userThumbsdownSet.has(comment.id)
            };
          }) as Comment2[];

        console.log('Transformed comments:', transformedComments);
        console.log(`🎉 === COMMENTS QUERY FUNCTION COMPLETE ===`);
        return transformedComments;
      } catch (err) {
        console.error('Error in fetchComments:', err);
        throw new Error(err instanceof Error ? err.message : 'Failed to fetch comments');
      }
    },
    enabled: Boolean(postId),
    retry: false,
    staleTime: 0, // Force fresh data on navigation
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const refreshComments = async () => {
    console.log(`🔄 === MANUAL COMMENTS REFRESH TRIGGERED ===`);
    await refetch();
  };

  console.log(`📤 USE COMMENTS2 HOOK RETURNING:`, {
    commentsCount: comments?.length || 0,
    loading,
    error: error?.message
  });

  return {
    comments,
    loading,
    error: error instanceof Error ? error.message : null,
    refreshComments
  };
};

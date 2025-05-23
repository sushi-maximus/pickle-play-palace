
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  user_thumbsup: boolean;
}

interface UseComments2Props {
  postId: string;
  userId?: string;
}

export const useComments2 = ({ postId, userId }: UseComments2Props) => {
  const [comments, setComments] = useState<Comment2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      // First fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(commentsData.map(comment => comment.user_id))];

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Get comment IDs for reaction queries
      const commentIds = commentsData.map(comment => comment.id);

      // Fetch thumbsup reactions count for all comments
      const { data: thumbsupData, error: thumbsupError } = await supabase
        .from('comment_reactions')
        .select('comment_id')
        .in('comment_id', commentIds)
        .eq('reaction_type', 'thumbsup');

      if (thumbsupError) throw thumbsupError;

      // Get user's thumbsup reactions if userId is provided
      let userThumbsupData = [];
      if (userId) {
        const { data, error: userThumbsupError } = await supabase
          .from('comment_reactions')
          .select('comment_id')
          .in('comment_id', commentIds)
          .eq('reaction_type', 'thumbsup')
          .eq('user_id', userId);

        if (userThumbsupError) throw userThumbsupError;
        userThumbsupData = data || [];
      }

      // Create maps for efficient lookups
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      const thumbsupCountMap = new Map();
      (thumbsupData || []).forEach(reaction => {
        const current = thumbsupCountMap.get(reaction.comment_id) || 0;
        thumbsupCountMap.set(reaction.comment_id, current + 1);
      });

      const userThumbsupSet = new Set(
        userThumbsupData.map(reaction => reaction.comment_id)
      );

      // Combine comments with user data and reaction data
      const transformedComments = commentsData
        .map(comment => {
          const user = profilesMap.get(comment.user_id);
          if (!user) return null;
          
          return {
            ...comment,
            user,
            thumbsup_count: thumbsupCountMap.get(comment.id) || 0,
            user_thumbsup: userThumbsupSet.has(comment.id)
          };
        })
        .filter(comment => comment !== null) as Comment2[];

      setComments(transformedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, userId]);

  return {
    comments,
    loading,
    error,
    refreshComments: fetchComments
  };
};

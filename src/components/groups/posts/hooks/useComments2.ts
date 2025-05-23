
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

      // Create a map of user profiles
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // Combine comments with user data
      const transformedComments = commentsData
        .map(comment => {
          const user = profilesMap.get(comment.user_id);
          if (!user) return null;
          
          return {
            ...comment,
            user
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
  }, [postId]);

  return {
    comments,
    loading,
    error,
    refreshComments: fetchComments
  };
};

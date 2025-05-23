
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PostUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export interface GroupPost {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  media_urls?: string[] | null;
  user: PostUser;
  reactions_count: number;
  comments_count: number;
  user_has_reacted: boolean;
}

interface UseGroupPostsProps {
  groupId: string;
  userId?: string;
}

export const useGroupPosts = ({ groupId, userId }: UseGroupPostsProps) => {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Get posts for this group using two separate queries instead of joins
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`*`)
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (postsError) {
        throw postsError;
      }

      // Fetch group info for name
      const { data: groupData } = await supabase
        .from("groups")
        .select("name")
        .eq("id", groupId)
        .single();
      
      if (groupData) {
        setGroupName(groupData.name);
      }

      // If no posts, return early
      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // For each post, fetch the user info separately
      const postsWithData = await Promise.all(
        postsData.map(async (post) => {
          // Fetch user data
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .eq("id", post.user_id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
          }

          // Count total reactions
          const { count: reactionsCount, error: reactionsError } = await supabase
            .from("reactions")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

          // Count comments
          const { count: commentsCount, error: commentsError } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

          // Check if current user has reacted to this post
          let userHasReacted = false;
          if (userId) {
            const { data: userReaction, error: userReactionError } = await supabase
              .from("reactions")
              .select("*")
              .eq("post_id", post.id)
              .eq("user_id", userId)
              .maybeSingle();
            
            userHasReacted = !!userReaction;

            if (userReactionError) {
              console.error("Error fetching user reaction:", userReactionError);
            }
          }

          if (reactionsError || commentsError) {
            console.error("Error fetching post metadata", {
              reactionsError,
              commentsError
            });
          }

          return {
            ...post,
            user: userData || { 
              id: post.user_id, 
              first_name: "Unknown", 
              last_name: "User" 
            },
            reactions_count: reactionsCount || 0,
            comments_count: commentsCount || 0,
            user_has_reacted: userHasReacted
          };
        })
      );

      setPosts(postsWithData);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchPosts();
    }
  }, [groupId, userId]);

  return {
    posts,
    loading,
    error,
    groupName,
    refreshPosts: fetchPosts
  };
};

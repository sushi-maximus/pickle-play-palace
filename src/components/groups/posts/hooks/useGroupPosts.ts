import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostReactionType } from "./usePostReactions";

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
  reactions: Record<PostReactionType, number>;
  comments_count: number;
  user_reactions: Record<PostReactionType, boolean>;
}

interface UseGroupPostsProps {
  groupId: string;
  userId?: string;
}

interface UseGroupPostsResult {
  posts: GroupPost[];
  loading: boolean;
  refreshing: boolean; // New state for background refreshes
  error: string | null;
  groupName: string;
  refreshPosts: () => Promise<void>;
}

export const useGroupPosts = ({ groupId, userId }: UseGroupPostsProps): UseGroupPostsResult => {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New state for background refreshes
  const [error, setError] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");

  const fetchPosts = async () => {
    try {
      // Only set loading to true if this is the initial fetch (no posts yet)
      // Otherwise, set refreshing to true for background updates
      if (posts.length === 0) {
        setLoading(true);
        setRefreshing(false);
      } else {
        setRefreshing(true);
        // Keep loading false so we don't show loading skeletons
        setLoading(false);
      }
      
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
        setRefreshing(false);
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

          // Count different types of reactions
          const { count: likeCount } = await supabase
            .from("reactions")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id)
            .eq("reaction_type", "like");

          const { count: thumbsUpCount } = await supabase
            .from("reactions")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id)
            .eq("reaction_type", "thumbsup");

          const { count: thumbsDownCount } = await supabase
            .from("reactions")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id)
            .eq("reaction_type", "thumbsdown");

          // Count comments
          const { count: commentsCount } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

          // Check if current user has reacted to this post
          let userLike = false;
          let userThumbsUp = false;
          let userThumbsDown = false;
          
          if (userId) {
            const { data: likeReaction } = await supabase
              .from("reactions")
              .select("*")
              .eq("post_id", post.id)
              .eq("user_id", userId)
              .eq("reaction_type", "like")
              .maybeSingle();
            
            const { data: thumbsUpReaction } = await supabase
              .from("reactions")
              .select("*")
              .eq("post_id", post.id)
              .eq("user_id", userId)
              .eq("reaction_type", "thumbsup")
              .maybeSingle();
            
            const { data: thumbsDownReaction } = await supabase
              .from("reactions")
              .select("*")
              .eq("post_id", post.id)
              .eq("user_id", userId)
              .eq("reaction_type", "thumbsdown")
              .maybeSingle();
            
            userLike = !!likeReaction;
            userThumbsUp = !!thumbsUpReaction;
            userThumbsDown = !!thumbsDownReaction;
          }

          return {
            ...post,
            user: userData || { 
              id: post.user_id, 
              first_name: "Unknown", 
              last_name: "User" 
            },
            reactions: {
              like: likeCount || 0,
              thumbsup: thumbsUpCount || 0,
              thumbsdown: thumbsDownCount || 0
            },
            comments_count: commentsCount || 0,
            user_reactions: {
              like: userLike,
              thumbsup: userThumbsUp,
              thumbsdown: userThumbsDown
            }
          };
        })
      );

      setPosts(postsWithData);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
    refreshing, // Return the new refreshing state
    error,
    groupName,
    refreshPosts: fetchPosts
  };
};

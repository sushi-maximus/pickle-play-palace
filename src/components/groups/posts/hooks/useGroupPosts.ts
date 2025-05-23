import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  GroupPost, 
  UseGroupPostsProps, 
  UseGroupPostsResult 
} from "./types/groupPostTypes";
import { fetchGroupInfo } from "./services/postsFetchService";
import { mapPostsWithDetails } from "./utils/postsMapper";

export type { GroupPost } from "./types/groupPostTypes";
export type { PostReactionType } from "./usePostReactions";

export const useGroupPosts = (
  { groupId, userId }: UseGroupPostsProps
): UseGroupPostsResult => {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      
      // Get posts for this group
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`*`)
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (postsError) {
        throw postsError;
      }

      // Fetch group info for name
      const name = await fetchGroupInfo(groupId);
      setGroupName(name);

      // If no posts, return early
      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // Map posts with all their related data
      const postsWithData = await mapPostsWithDetails(postsData, userId);
      
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
    refreshing,
    error,
    groupName,
    refreshPosts: fetchPosts
  };
};

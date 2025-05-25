
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  GroupPost, 
  UseGroupPostsProps, 
  UseGroupPostsResult 
} from "./types/groupPostTypes";
import { fetchGroupInfo } from "./services/postsFetchService";
import { enrichPostsWithCounts } from "./utils/postsMapper";

export type { GroupPost } from "./types/groupPostTypes";
export type { PostReactionType } from "./usePostReactions";

export const useGroupPosts = (
  { groupId, userId }: UseGroupPostsProps
): UseGroupPostsResult => {
  const [refreshing, setRefreshing] = useState(false);
  const [groupName, setGroupName] = useState<string>("");

  // Validate group ID - must be non-empty and valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUUID = groupId && groupId.trim() !== '' && groupId !== ':id' && uuidRegex.test(groupId);

  console.log("useGroupPosts: Hook called with", { groupId, isValidUUID, userId: !!userId });

  // Use React Query for posts data - only enabled with valid UUID
  const {
    data: posts = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['group-posts', groupId, userId],
    queryFn: async () => {
      console.log("useGroupPosts: Fetching posts for group:", groupId);
      
      try {
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

        // If no posts, return empty array
        if (!postsData || postsData.length === 0) {
          return [];
        }

        // Map posts with all their related data
        const postsWithData = await enrichPostsWithCounts(postsData, userId);
        return postsWithData;
      } catch (err) {
        console.error("Error fetching posts:", err);
        throw new Error("Failed to load posts. Please try again later.");
      }
    },
    enabled: Boolean(isValidUUID), // Convert to boolean and only run with valid UUID
    retry: false,
    staleTime: 30 * 1000,
  });

  // Manual refresh function
  const refreshPosts = useCallback(async () => {
    if (!isValidUUID) {
      console.log("useGroupPosts: Cannot refresh - invalid group ID");
      return;
    }

    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setRefreshing(false);
    }
  }, [isValidUUID, refetch]);

  const errorMessage = error instanceof Error ? error.message : null;

  console.log("useGroupPosts: Returning state", {
    postsCount: posts?.length || 0,
    loading,
    refreshing,
    error: errorMessage,
    isValidUUID
  });

  return {
    posts: posts || [],
    loading,
    refreshing,
    error: errorMessage,
    groupName,
    refreshPosts
  };
};

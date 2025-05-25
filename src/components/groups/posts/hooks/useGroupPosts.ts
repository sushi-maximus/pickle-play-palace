
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

  console.log(`🏠 === USE GROUP POSTS HOOK CALLED ===`);
  console.log(`📍 Group ID: ${groupId}`);
  console.log(`✅ Valid UUID: ${isValidUUID}`);
  console.log(`👤 User ID: ${userId}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);

  // Use React Query for posts data - only enabled with valid UUID
  const {
    data: posts = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['group-posts', groupId, userId],
    queryFn: async () => {
      console.log(`\n🎯 === REACT QUERY FUNCTION EXECUTING ===`);
      console.log(`📊 Fetching posts for group: ${groupId}`);
      console.log(`👤 Current user: ${userId}`);
      
      try {
        // Get posts for this group
        console.log(`📡 Making database query for posts...`);
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(`*`)
          .eq("group_id", groupId)
          .order("created_at", { ascending: false });

        if (postsError) {
          console.error(`❌ Database error fetching posts:`, postsError);
          throw postsError;
        }

        console.log(`✅ Raw posts data fetched: ${postsData?.length || 0} posts`);

        // Fetch group info for name
        const name = await fetchGroupInfo(groupId);
        setGroupName(name);
        console.log(`✅ Group name fetched: ${name}`);

        // If no posts, return empty array
        if (!postsData || postsData.length === 0) {
          console.log(`📭 No posts found for group ${groupId}`);
          return [];
        }

        console.log(`🔄 Starting post enrichment process...`);
        // Map posts with all their related data
        const postsWithData = await enrichPostsWithCounts(postsData, userId);
        
        console.log(`🎉 === REACT QUERY FUNCTION COMPLETE ===`);
        console.log(`📊 Returning ${postsWithData.length} enriched posts`);
        
        // Log any posts with heart reactions for debugging
        postsWithData.forEach(post => {
          if (post.heart_count > 0 || post.user_heart) {
            console.log(`💖 Post ${post.id} has heart reactions: count=${post.heart_count}, user_active=${post.user_heart}`);
          }
        });
        
        return postsWithData;
      } catch (err) {
        console.error(`💥 === REACT QUERY ERROR ===`);
        console.error("Error fetching posts:", err);
        console.error("Error details:", JSON.stringify(err, null, 2));
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

    console.log(`🔄 === MANUAL REFRESH TRIGGERED ===`);
    setRefreshing(true);
    try {
      await refetch();
      console.log(`✅ Manual refresh completed successfully`);
    } catch (error) {
      console.error("❌ Error refreshing posts:", error);
    } finally {
      setRefreshing(false);
      console.log(`🏁 Manual refresh process complete`);
    }
  }, [isValidUUID, refetch]);

  const errorMessage = error instanceof Error ? error.message : null;

  console.log(`📊 === USE GROUP POSTS HOOK RETURNING ===`);
  console.log(`📝 Posts count: ${posts?.length || 0}`);
  console.log(`⏳ Loading: ${loading}`);
  console.log(`🔄 Refreshing: ${refreshing}`);
  console.log(`❌ Error: ${errorMessage}`);
  console.log(`🏠 Group name: ${groupName}`);

  return {
    posts: posts || [],
    loading,
    refreshing,
    error: errorMessage,
    groupName,
    refreshPosts
  };
};

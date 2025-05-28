
import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  GroupPost, 
  UseGroupPostsProps, 
  UseGroupPostsResult 
} from "./types/groupPostTypes";
import { fetchGroupInfo } from "./services/postsFetchService";
import { enrichPostsWithCounts } from "./utils/postsMapper";
import { queryKeys } from "@/lib/queryKeys";

export type { GroupPost } from "./types/groupPostTypes";
export type { PostReactionType2 } from "./usePostReactions2";

interface UseGroupPostsPropsExtended extends UseGroupPostsProps {
  key?: number;
}

export const useGroupPosts = (
  { groupId, userId, key }: UseGroupPostsPropsExtended
): UseGroupPostsResult => {
  const [refreshing, setRefreshing] = useState(false);
  const [groupName, setGroupName] = useState<string>("");
  const queryClient = useQueryClient();

  // Validate group ID - must be non-empty and valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUUID = groupId && groupId.trim() !== '' && groupId !== ':id' && uuidRegex.test(groupId);

  console.log(`🏠 === USE GROUP POSTS HOOK CALLED ===`);
  console.log(`📍 Group ID: ${groupId}`);
  console.log(`✅ Valid UUID: ${isValidUUID}`);
  console.log(`👤 User ID: ${userId}`);
  console.log(`🔑 Retry Key: ${key}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  
  // CRITICAL DEBUG - Log query key generation
  const queryKey = queryKeys.posts.list(`group:${groupId}:user:${userId || 'anonymous'}`);
  console.log(`🔑 QUERY KEY GENERATED:`, queryKey);
  console.log(`🔑 QUERY KEY STRING:`, JSON.stringify(queryKey));

  // Use React Query for posts data - only enabled with valid UUID
  const {
    data: posts = [],
    isLoading: loading,
    error,
    refetch,
    dataUpdatedAt,
    isFetching
  } = useQuery({
    queryKey: [...queryKey, key], // Include key for cache busting
    queryFn: async () => {
      console.log(`\n🎯 === REACT QUERY FUNCTION EXECUTING ===`);
      console.log(`📊 Fetching posts for group: ${groupId}`);
      console.log(`👤 Current user: ${userId}`);
      console.log(`🕐 Query function timestamp: ${new Date().toISOString()}`);
      
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
        
        // CRITICAL DEBUG - Log post 543 specifically
        const post543 = postsWithData.find(p => p.id.includes('543') || p.content.includes('543'));
        if (post543) {
          console.log(`🎯 === POST 543 FOUND IN QUERY RESULT ===`);
          console.log(`Post 543 heart data:`, {
            id: post543.id,
            heart_count: post543.heart_count,
            user_heart: post543.user_heart,
            content_preview: post543.content.substring(0, 50)
          });
        } else {
          console.log(`🔍 Post 543 NOT FOUND in results. Available posts:`, 
            postsWithData.map(p => ({ id: p.id, content: p.content.substring(0, 30) }))
          );
        }
        
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
    staleTime: 2 * 60 * 1000, // KISS: 2 minutes stale time for fresh data
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // KISS: Auto-refresh when user returns to app
  });

  console.log(`🔄 === QUERY STATE INFORMATION ===`);
  console.log(`📊 Posts count: ${posts?.length || 0}`);
  console.log(`⏳ Loading: ${loading}`);
  console.log(`🔄 Is Fetching: ${isFetching}`);
  console.log(`🕐 Data Updated At: ${new Date(dataUpdatedAt || 0).toISOString()}`);
  console.log(`❌ Error: ${error?.message}`);

  // Manual refresh function - KISS approach
  const refreshPosts = useCallback(async () => {
    if (!isValidUUID) {
      console.log("useGroupPosts: Cannot refresh - invalid group ID");
      return;
    }

    console.log(`🔄 === MANUAL REFRESH TRIGGERED ===`);
    console.log(`🗑️ Invalidating query cache for key:`, queryKey);
    
    setRefreshing(true);
    try {
      // KISS: Simple invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: [...queryKey, key] });
      await refetch();
      console.log(`✅ Manual refresh completed successfully`);
    } catch (error) {
      console.error("❌ Error refreshing posts:", error);
    } finally {
      setRefreshing(false);
      console.log(`🏁 Manual refresh process complete`);
    }
  }, [isValidUUID, refetch, queryClient, queryKey, key]);

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

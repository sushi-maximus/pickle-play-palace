
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

/**
 * Enhanced function to fetch all groups with error handling and retry logic
 */
export const fetchAllGroupsOptimized = async (): Promise<Group[]> => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`fetchAllGroupsOptimized: Attempt ${attempt}/${maxRetries}`);
      
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      console.log(`fetchAllGroupsOptimized: Successfully fetched ${data?.length || 0} groups`);
      return data || [];
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.error(`fetchAllGroupsOptimized: Attempt ${attempt} failed:`, lastError.message);
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff delay
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`fetchAllGroupsOptimized: Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Failed to fetch groups after multiple attempts");
};

/**
 * Enhanced function to fetch user memberships with error handling and retry logic
 */
export const fetchUserMembershipsOptimized = async (userId: string) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error("Invalid userId provided");
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`fetchUserMembershipsOptimized: Attempt ${attempt}/${maxRetries} for user ${userId}`);
      
      // Get groups created by the user
      const { data: createdGroups, error: createdError } = await supabase
        .from("groups")
        .select("*")
        .eq("created_by", userId);
        
      if (createdError) {
        throw new Error(`Error fetching created groups: ${createdError.message}`);
      }
      
      // Get groups where user is a member
      const { data: membershipData, error: membershipError } = await supabase
        .from("group_members")
        .select("id, role, group_id")
        .eq("user_id", userId)
        .eq("status", "active");
        
      if (membershipError) {
        throw new Error(`Error fetching memberships: ${membershipError.message}`);
      }
      
      // If there are memberships, get the group details
      let memberships = [];
      if (membershipData && membershipData.length > 0) {
        const groupIds = membershipData.map(m => m.group_id);
        
        const { data: groupsData, error: groupsError } = await supabase
          .from("groups")
          .select("*")
          .in("id", groupIds);
          
        if (groupsError) {
          throw new Error(`Error fetching member groups: ${groupsError.message}`);
        }
        
        // Combine membership data with group data
        memberships = membershipData.map(membership => {
          const group = groupsData?.find(g => g.id === membership.group_id);
          return {
            id: membership.id,
            role: membership.role,
            group: group || null
          };
        }).filter(m => m.group !== null);
      }
      
      // Add created groups as admin memberships
      const createdMemberships = (createdGroups || []).map(group => ({
        id: `created-${group.id}`,
        role: "admin" as const,
        group
      }));
      
      // Combine and deduplicate
      const allMemberships = [...memberships];
      createdMemberships.forEach(cm => {
        if (!allMemberships.some(m => m.group?.id === cm.group.id)) {
          allMemberships.push(cm);
        }
      });
      
      console.log(`fetchUserMembershipsOptimized: Successfully fetched ${allMemberships.length} memberships`);
      return allMemberships;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.error(`fetchUserMembershipsOptimized: Attempt ${attempt} failed:`, lastError.message);
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff delay
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`fetchUserMembershipsOptimized: Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Failed to fetch user memberships after multiple attempts");
};

/**
 * Utility function to invalidate group-related cache entries
 */
export const invalidateGroupCaches = (queryClient: any, groupId?: string) => {
  if (groupId) {
    // Invalidate specific group
    queryClient.invalidateQueries({ queryKey: ['groups', 'detail', groupId] });
  } else {
    // Invalidate all group-related caches
    queryClient.invalidateQueries({ queryKey: ['groups'] });
  }
};

/**
 * Utility function to prefetch group data
 */
export const prefetchGroupData = async (queryClient: any, userId?: string) => {
  // Prefetch all groups
  await queryClient.prefetchQuery({
    queryKey: ['groups', 'list', { mode: 'all', searchTerm: '', userId }],
    queryFn: fetchAllGroupsOptimized,
    staleTime: 5 * 60 * 1000
  });

  // Prefetch user memberships if userId provided
  if (userId) {
    await queryClient.prefetchQuery({
      queryKey: ['groups', 'my-groups', userId],
      queryFn: () => fetchUserMembershipsOptimized(userId),
      staleTime: 5 * 60 * 1000
    });
  }
};

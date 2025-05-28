
import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchAllGroupsOptimized, fetchUserMembershipsOptimized } from "../utils/groupDataUtils";
import { 
  UnifiedGroup, 
  UseUnifiedGroupsOptions, 
  UseUnifiedGroupsReturn,
  UnifiedMembership 
} from "./types/unifiedGroupTypes";
import { Database } from "@/integrations/supabase/types";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

type Group = Database['public']['Tables']['groups']['Row'];

export const useUnifiedGroups = ({ mode, searchTerm, userId }: UseUnifiedGroupsOptions): UseUnifiedGroupsReturn => {
  const [filteredGroups, setFilteredGroups] = useState<UnifiedGroup[]>([]);
  const queryClient = useQueryClient();

  console.log("useUnifiedGroups: Hook called with", { mode, searchTerm, userId });

  // Enhanced React Query for groups data with retry and caching
  const {
    data: allGroups = [],
    isLoading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups
  } = useQuery({
    queryKey: queryKeys.groups.list({ mode: 'all', searchTerm: '', userId }),
    queryFn: async () => {
      console.log("useUnifiedGroups: Fetching all groups");
      const groupsData = await fetchAllGroupsOptimized();
      console.log("useUnifiedGroups: Fetched", groupsData.length, "groups");
      return groupsData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  // Enhanced React Query for user memberships
  const {
    data: userMemberships = [],
    isLoading: membershipsLoading,
    error: membershipsError,
    refetch: refetchMemberships
  } = useQuery({
    queryKey: queryKeys.groups.myGroups(userId || 'anonymous'),
    queryFn: async () => {
      if (!userId) {
        console.log("useUnifiedGroups: No userId, returning empty memberships");
        return [];
      }
      console.log("useUnifiedGroups: Fetching user memberships for", userId);
      const membershipsData = await fetchUserMembershipsOptimized(userId);
      console.log("useUnifiedGroups: Fetched", membershipsData.length, "memberships");
      return membershipsData;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Combine groups with membership data efficiently
  const unifiedGroups: UnifiedGroup[] = allGroups.map(group => {
    const membership = userMemberships.find(m => m.group?.id === group.id);
    return {
      ...group,
      isMember: !!membership,
      membershipRole: membership?.role,
      membershipId: membership?.id
    };
  });

  // Optimized filtering with memoization-like effect
  useEffect(() => {
    let filtered = unifiedGroups;
    
    // Filter by mode
    if (mode === 'my-groups') {
      filtered = unifiedGroups.filter(group => group.isMember);
    }
    
    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        (group.description && group.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (group.location && group.location.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    
    setFilteredGroups(filtered);
    console.log("useUnifiedGroups: Filtered groups:", filtered.length, "mode:", mode, "searchTerm:", searchTerm);
  }, [unifiedGroups, mode, searchTerm]);

  // Optimistic refresh mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      console.log("useUnifiedGroups: Starting optimistic refresh");
      
      // Invalidate and refetch both queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.groups.all }),
        userId ? queryClient.invalidateQueries({ queryKey: queryKeys.groups.myGroups(userId) }) : Promise.resolve()
      ]);
      
      // Trigger refetch
      const results = await Promise.all([
        refetchGroups(),
        userId ? refetchMemberships() : Promise.resolve()
      ]);
      
      return results;
    },
    onSuccess: () => {
      console.log("useUnifiedGroups: Refresh completed successfully");
      toast.success("Groups updated successfully");
    },
    onError: (error) => {
      console.error("useUnifiedGroups: Refresh failed:", error);
      toast.error("Failed to refresh groups. Please try again.");
    }
  });

  // Enhanced refresh function with optimistic updates
  const refreshData = useCallback(async () => {
    console.log("useUnifiedGroups: Manual refresh triggered");
    await refreshMutation.mutateAsync();
  }, [refreshMutation]);

  // Legacy refetch function for backward compatibility
  const refetch = useCallback(() => {
    console.log("useUnifiedGroups: Legacy refetch called");
    refreshData();
  }, [refreshData]);

  // Calculate loading state
  const loading = groupsLoading || membershipsLoading || refreshMutation.isPending;
  
  // Calculate error state - fix the type error
  const error = groupsError || membershipsError || refreshMutation.error;
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  // Create legacy-compatible membership objects for my-groups mode
  const memberships: UnifiedMembership[] = mode === 'my-groups' 
    ? filteredGroups.map(group => ({
        id: group.membershipId || `unified-${group.id}`,
        role: group.membershipRole || 'member',
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          location: group.location,
          created_at: group.created_at,
          updated_at: group.updated_at,
          created_by: group.created_by,
          is_private: group.is_private,
          member_count: group.member_count,
          max_members: group.max_members,
          avatar_url: group.avatar_url,
          skill_level_min: group.skill_level_min,
          skill_level_max: group.skill_level_max
        }
      }))
    : [];

  console.log("useUnifiedGroups: Returning state", {
    allGroupsCount: unifiedGroups.length,
    filteredGroupsCount: filteredGroups.length,
    loading,
    error: errorMessage,
    mode
  });

  return {
    allGroups: unifiedGroups,
    filteredGroups,
    loading,
    error: errorMessage,
    refreshData,
    refetch,
    // Legacy compatibility
    groups: mode === 'all' ? filteredGroups : [],
    memberships
  };
};

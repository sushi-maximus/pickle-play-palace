
import { useState, useEffect } from "react";
import { fetchAllGroupsOptimized, fetchUserMembershipsOptimized } from "../utils/groupDataUtils";
import { 
  UnifiedGroup, 
  UseUnifiedGroupsOptions, 
  UseUnifiedGroupsReturn,
  UnifiedMembership 
} from "./types/unifiedGroupTypes";
import { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

export const useUnifiedGroups = ({ mode, searchTerm, userId }: UseUnifiedGroupsOptions): UseUnifiedGroupsReturn => {
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [userMemberships, setUserMemberships] = useState<any[]>([]);
  const [unifiedGroups, setUnifiedGroups] = useState<UnifiedGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<UnifiedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all groups and user memberships
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("useUnifiedGroups: Fetching data for mode:", mode, "userId:", userId);
      
      // Always fetch all groups
      const groupsData = await fetchAllGroupsOptimized();
      setAllGroups(groupsData);
      
      // Fetch user memberships if userId is provided
      let membershipsData = [];
      if (userId) {
        membershipsData = await fetchUserMembershipsOptimized(userId);
        setUserMemberships(membershipsData);
      }
      
      // Combine groups with membership data
      const unified: UnifiedGroup[] = groupsData.map(group => {
        const membership = membershipsData.find(m => m.group?.id === group.id);
        return {
          ...group,
          isMember: !!membership,
          membershipRole: membership?.role,
          membershipId: membership?.id
        };
      });
      
      setUnifiedGroups(unified);
      console.log("useUnifiedGroups: Unified groups created:", unified.length);
    } catch (err) {
      console.error("Error fetching unified groups data:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch groups'));
    } finally {
      setLoading(false);
    }
  };

  // Filter groups based on mode and search term
  useEffect(() => {
    let filtered = unifiedGroups;
    
    // Filter by mode
    if (mode === 'my-groups') {
      filtered = unifiedGroups.filter(group => group.isMember);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        (group.description && group.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (group.location && group.location.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    
    setFilteredGroups(filtered);
    console.log("useUnifiedGroups: Filtered groups:", filtered.length, "mode:", mode, "searchTerm:", searchTerm);
  }, [unifiedGroups, mode, searchTerm]);

  // Fetch data when userId changes
  useEffect(() => {
    fetchData();
  }, [userId]);

  const refreshData = async () => {
    await fetchData();
  };

  const refetch = () => {
    fetchData();
  };

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

  return {
    allGroups: unifiedGroups,
    filteredGroups,
    loading,
    error,
    refreshData,
    refetch,
    // Legacy compatibility - for groups without membership info
    groups: mode === 'all' ? filteredGroups : [],
    // Legacy compatibility - for membership-specific data
    memberships
  };
};


import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

/**
 * Phase 2: Optimized function to fetch all groups with stored member_count
 */
export const fetchAllGroupsOptimized = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }

  return data || [];
};

/**
 * Phase 2: Optimized function to fetch groups where user is a member
 */
export const fetchUserMembershipsOptimized = async (userId: string) => {
  try {
    // Get groups created by the user
    const { data: createdGroups, error: createdError } = await supabase
      .from("groups")
      .select("*")
      .eq("created_by", userId);
      
    if (createdError) {
      console.error("Error fetching created groups:", createdError);
      throw createdError;
    }
    
    // Get groups where user is a member
    const { data: membershipData, error: membershipError } = await supabase
      .from("group_members")
      .select("id, role, group_id")
      .eq("user_id", userId)
      .eq("status", "active");
      
    if (membershipError) {
      console.error("Error fetching memberships:", membershipError);
      throw membershipError;
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
        console.error("Error fetching member groups:", groupsError);
        throw groupsError;
      }
      
      // Combine membership data with group data (member_count is already included)
      memberships = membershipData.map(membership => {
        const group = groupsData.find(g => g.id === membership.group_id);
        return {
          id: membership.id,
          role: membership.role,
          group: group || null
        };
      }).filter(m => m.group !== null);
    }
    
    // Add created groups as admin memberships (member_count is already included)
    const createdMemberships = (createdGroups || []).map(group => ({
      id: `created-${group.id}`,
      role: "admin",
      group
    }));
    
    // Combine and deduplicate
    const allMemberships = [...memberships];
    createdMemberships.forEach(cm => {
      if (!allMemberships.some(m => m.group.id === cm.group.id)) {
        allMemberships.push(cm);
      }
    });
    
    return allMemberships;
  } catch (error) {
    console.error("Error fetching user memberships:", error);
    throw error;
  }
};

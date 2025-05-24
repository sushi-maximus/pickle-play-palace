
import { supabase } from "@/integrations/supabase/client";

/**
 * A utility function to fetch all groups
 */
export const fetchAllGroups = async () => {
  // First fetch all groups
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }

  // For each group, count the number of active members
  const groupsWithMemberCount = await Promise.all(
    (data || []).map(async (group) => {
      const { count, error: countError } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", group.id)
        .eq("status", "active");

      if (countError) {
        console.error(`Error counting members for group ${group.id}:`, countError);
        return { ...group, member_count: 0 };
      }

      return { ...group, member_count: count || 0 };
    })
  );
  
  return groupsWithMemberCount || [];
};

/**
 * A utility function to fetch groups where user is a member
 */
export const fetchUserMemberships = async (userId: string) => {
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
      
      // Combine membership data with group data and add member counts
      const membershipPromises = membershipData.map(async (membership) => {
        const group = groupsData.find(g => g.id === membership.group_id);
        if (!group) return null;

        // Count the actual members for this group
        const { count, error: countError } = await supabase
          .from("group_members")
          .select("*", { count: "exact", head: true })
          .eq("group_id", group.id)
          .eq("status", "active");

        if (countError) {
          console.error(`Error counting members for group ${group.id}:`, countError);
        }

        return {
          id: membership.id,
          role: membership.role,
          group: {
            ...group,
            member_count: count || 0
          }
        };
      });

      const resolvedMemberships = await Promise.all(membershipPromises);
      memberships = resolvedMemberships.filter(m => m !== null);
    }
    
    // Add created groups as admin memberships with member counts
    const createdMembershipPromises = (createdGroups || []).map(async (group) => {
      // Count the actual members for this group
      const { count, error: countError } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", group.id)
        .eq("status", "active");

      if (countError) {
        console.error(`Error counting members for group ${group.id}:`, countError);
      }

      return {
        id: `created-${group.id}`,
        role: "admin",
        group: {
          ...group,
          member_count: count || 0
        }
      };
    });

    const createdMemberships = await Promise.all(createdMembershipPromises);
    
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

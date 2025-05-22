
import { supabase } from "@/integrations/supabase/client";

/**
 * A utility function to check if a user is a member of a group
 */
export const checkGroupMembership = async (userId: string, groupId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .select("id")
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .eq("status", "active")
      .maybeSingle();
      
    if (error) {
      console.error("Error checking group membership:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception checking group membership:", error);
    return false;
  }
};

/**
 * A utility function to check if a user is an admin of a group
 */
export const checkGroupAdmin = async (userId: string, groupId: string): Promise<boolean> => {
  try {
    // First check if user is the creator
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .select("created_by")
      .eq("id", groupId)
      .maybeSingle();
      
    if (groupData && groupData.created_by === userId) {
      return true;
    }
    
    if (groupError) {
      console.error("Error checking group creator:", groupError);
    }
    
    // Then check if user is an admin member
    const { data, error } = await supabase
      .from("group_members")
      .select("id")
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .eq("status", "active")
      .eq("role", "admin")
      .maybeSingle();
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception checking admin status:", error);
    return false;
  }
};

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
      
      // Combine membership data with group data
      memberships = membershipData.map(membership => {
        const group = groupsData.find(g => g.id === membership.group_id);
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

/**
 * A utility function to fetch group details including members
 */
export const fetchGroupDetails = async (groupId: string): Promise<any> => {
  try {
    // First get the group details
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();
      
    if (groupError) {
      console.error('Error fetching group details:', groupError);
      throw groupError;
    }
    
    if (!groupData) {
      return null;
    }
    
    // Count active members
    const { count: memberCount, error: countError } = await supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", groupId)
      .eq("status", "active");
      
    if (countError) {
      console.error(`Error counting members for group ${groupId}:`, countError);
    }
    
    // Get members with their profile info - using a join approach instead of foreign relationships
    const { data: membersData, error: membersError } = await supabase
      .from("group_members")
      .select(`
        id,
        role,
        joined_at,
        user_id
      `)
      .eq("group_id", groupId)
      .eq("status", "active");
      
    if (membersError) {
      console.error(`Error fetching members for group ${groupId}:`, membersError);
    }
    
    // Now fetch the profiles for these members
    let membersWithProfiles = [];
    if (membersData && membersData.length > 0) {
      const userIds = membersData.map(member => member.user_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url")
        .in("id", userIds);
        
      if (profilesError) {
        console.error(`Error fetching profiles for group members:`, profilesError);
      }
      
      // Combine member data with profiles
      membersWithProfiles = membersData.map(member => {
        const profile = profilesData?.find(profile => profile.id === member.user_id) || {
          id: member.user_id,
          first_name: "Unknown",
          last_name: "User",
          avatar_url: null
        };
        
        return {
          ...member,
          profiles: profile
        };
      });
    }
    
    // Return group with member data
    return {
      ...groupData,
      member_count: memberCount || membersWithProfiles.length || 0,
      members: membersWithProfiles
    };
  } catch (error) {
    console.error('Error fetching group details:', error);
    throw error;
  }
};

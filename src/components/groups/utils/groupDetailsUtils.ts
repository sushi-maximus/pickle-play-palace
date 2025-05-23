import { supabase } from "@/integrations/supabase/client";
import { UpdateGroupFormValues } from "../schemas/groupSchemas";

/**
 * Fetches detailed information for a specific group by ID
 * @param groupId The UUID of the group to fetch
 * @returns Group details or null if not found
 */
export const fetchGroupDetails = async (groupId: string) => {
  try {
    // Fetch group data
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .select(`
        id,
        name,
        description,
        created_at,
        created_by,
        updated_at,
        avatar_url,
        location,
        is_private,
        skill_level_min,
        skill_level_max,
        max_members
      `)
      .eq("id", groupId)
      .single();
    
    if (groupError) {
      console.error(`Error fetching group ${groupId}:`, groupError);
      return null;
    }
    
    // Get member count
    const { count: memberCount, error: countError } = await supabase
      .from("group_members")
      .select('id', { count: 'exact', head: true })
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
        .select("id, first_name, last_name, avatar_url, skill_level, dupr_rating, birthday")
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
    return null;
  }
};

/**
 * Updates a group with new information
 * @param groupId The UUID of the group to update
 * @param values The updated values for the group
 * @returns The updated group data
 */
export const updateGroup = async (groupId: string, values: UpdateGroupFormValues) => {
  try {
    const { data: updatedGroup, error } = await supabase
      .from("groups")
      .update({
        name: values.name,
        description: values.description || null,
        location: values.location || null,
        is_private: values.is_private,
        skill_level_min: values.skill_level_min || null,
        skill_level_max: values.skill_level_max || null,
        max_members: values.max_members || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", groupId)
      .select()
      .single();

    if (error) {
      console.error("Error updating group:", error);
      throw new Error(`Failed to update group: ${error.message}`);
    }

    return updatedGroup;
  } catch (error) {
    console.error("Error in updateGroup:", error);
    throw error;
  }
};

/**
 * Promotes a member to admin role in a group
 * @param memberId The ID of the group_members record to update
 * @param groupId The group ID for validation
 * @returns Success status
 */
export const promoteMemberToAdmin = async (memberId: string, groupId: string) => {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .update({ role: "admin" })
      .eq("id", memberId)
      .eq("group_id", groupId) // Ensure we're only updating in the correct group
      .select()
      .single();
      
    if (error) {
      console.error("Error promoting member to admin:", error);
      throw new Error(`Failed to promote member: ${error.message}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error in promoteMemberToAdmin:", error);
    throw error;
  }
};

/**
 * Removes a member from a group
 * @param memberId The ID of the group_members record to remove
 * @param groupId The group ID for validation
 * @returns Success status
 */
export const removeMemberFromGroup = async (memberId: string, groupId: string) => {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", memberId)
      .eq("group_id", groupId); // Ensure we're only deleting in the correct group
      
    if (error) {
      console.error("Error removing member from group:", error);
      throw new Error(`Failed to remove member: ${error.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in removeMemberFromGroup:", error);
    throw error;
  }
};

/**
 * Updates a group's avatar
 * @param groupId The UUID of the group to update
 * @param avatarUrl The URL of the new avatar
 * @returns The updated group data
 */
export const updateGroupAvatar = async (groupId: string, avatarUrl: string) => {
  try {
    const { data: updatedGroup, error } = await supabase
      .from("groups")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", groupId)
      .select()
      .single();

    if (error) {
      console.error("Error updating group avatar:", error);
      throw new Error(`Failed to update group avatar: ${error.message}`);
    }

    return updatedGroup;
  } catch (error) {
    console.error("Error in updateGroupAvatar:", error);
    throw error;
  }
};

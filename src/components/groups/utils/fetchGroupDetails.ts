
import { supabase } from "@/integrations/supabase/client";

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

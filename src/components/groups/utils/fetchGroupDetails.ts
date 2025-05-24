
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type GroupData = Database['public']['Tables']['groups']['Row'] & {
  member_count: number;
  members: any[];
};

/**
 * Fetches detailed information for a specific group by ID
 * @param groupId The UUID of the group to fetch
 * @returns Group details or null if not found
 */
export const fetchGroupDetails = async (groupId: string): Promise<GroupData | null> => {
  try {
    console.log("fetchGroupDetails: Starting fetch for group ID:", groupId);
    
    // Validate groupId
    if (!groupId || typeof groupId !== 'string' || groupId.trim() === '') {
      console.error("fetchGroupDetails: Invalid group ID provided:", groupId);
      throw new Error("Invalid group ID");
    }
    
    // Fetch group data with better error handling
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
        max_members,
        member_count
      `)
      .eq("id", groupId)
      .maybeSingle();
    
    if (groupError) {
      console.error(`fetchGroupDetails: Database error fetching group ${groupId}:`, groupError);
      throw new Error(`Failed to fetch group: ${groupError.message}`);
    }
    
    if (!groupData) {
      console.log("fetchGroupDetails: No group found for ID:", groupId);
      return null;
    }
    
    console.log("fetchGroupDetails: Successfully fetched group data:", groupData.name);
    
    // Get members with their profile info - use separate try-catch for this
    let membersWithProfiles = [];
    try {
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
        console.error(`fetchGroupDetails: Error fetching members for group ${groupId}:`, membersError);
        // Continue with empty members array rather than failing
      } else if (membersData && membersData.length > 0) {
        // Fetch profiles for members
        const userIds = membersData.map(member => member.user_id);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, avatar_url, skill_level, dupr_rating, birthday")
          .in("id", userIds);
          
        if (profilesError) {
          console.error(`fetchGroupDetails: Error fetching profiles:`, profilesError);
          // Continue without profile data
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
    } catch (memberError) {
      console.error("fetchGroupDetails: Error fetching member data:", memberError);
      // Continue with empty members array
    }
    
    console.log("fetchGroupDetails: Successfully processed group with", membersWithProfiles.length, "members");
    
    // Return group with member data
    return {
      ...groupData,
      member_count: groupData.member_count || membersWithProfiles.length || 0,
      members: membersWithProfiles
    };
  } catch (error) {
    console.error('fetchGroupDetails: Unexpected error fetching group details:', error);
    throw error;
  }
};

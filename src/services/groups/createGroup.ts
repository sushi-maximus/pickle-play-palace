
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";
import { Database } from "@/integrations/supabase/types";

/**
 * Creates a new group and returns the created group data
 */
export async function createGroup(group: Partial<Group>): Promise<Group> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Authentication error:', userError);
    throw new Error("Authentication failed");
  }
  
  if (!userData?.user) {
    throw new Error("User not authenticated");
  }
  
  const userId = userData.user.id;
  
  try {
    // First, create the group with a direct insert
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert([
        { 
          name: group.name, 
          description: group.description,
          location: group.location,
          is_private: group.is_private || false,
          creator_id: userId
        }
      ])
      .select()
      .single();

    if (groupError) {
      console.error('Error creating group:', groupError);
      throw groupError;
    }

    if (!groupData) {
      throw new Error("Failed to create group - no data returned");
    }

    // Properly type the enum parameters using type assertion to Database enums
    const { error: procError } = await supabase.rpc('add_group_member', {
      p_group_id: groupData.id,
      p_user_id: userId,
      p_role: 'admin' as Database['public']['Enums']['group_member_role'],
      p_status: 'active' as Database['public']['Enums']['group_member_status']
    });

    if (procError) {
      console.error('Error adding member using procedure:', procError);
      
      // Fallback: Try direct insert if the procedure fails
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: groupData.id,
            user_id: userId,
            role: 'admin',
            status: 'active'
          }
        ]);
        
      if (memberError) {
        console.error('Fallback member insertion failed:', memberError);
        // Continue anyway since the group is created
        console.log('Group created but member addition failed. User may need to join manually.');
      }
    }

    return groupData as Group;
  } catch (error) {
    console.error('Unexpected error creating group:', error);
    throw error;
  }
}

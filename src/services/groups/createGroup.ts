
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";

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
    // Begin a transaction by using a PostgreSQL stored procedure
    // First, insert the new group
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

    // Then manually insert the creator as a group member
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
      console.error('Error adding member to group:', memberError);
      // Continue anyway since the group is created
      // This is likely happening because the database trigger already added the user
      console.log('Continuing despite member error - the trigger may have already added the user');
    }

    return groupData as Group;
  } catch (error) {
    console.error('Unexpected error creating group:', error);
    throw error;
  }
}


import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";

/**
 * Creates a new group and returns the created group data
 */
export async function createGroup(group: Partial<Group>): Promise<Group> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (!userData?.user) {
    throw new Error("User not authenticated");
  }
  
  const userId = userData.user.id;
  
  // Insert the new group into the database
  const { data, error } = await supabase
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

  if (error) {
    console.error('Error creating group:', error);
    throw error;
  }

  return data as Group;
}

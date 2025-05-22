
import { supabase } from "@/integrations/supabase/client";
import { GroupMember } from "@/types/group";

/**
 * Adds the current user as a member to a group
 */
export async function joinGroup(groupId: string): Promise<GroupMember> {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('group_members')
    .insert([
      { 
        group_id: groupId,
        user_id: userId,
        role: 'member',
        status: 'active'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error joining group:', error);
    throw error;
  }

  return data as GroupMember;
}

/**
 * Removes the current user from a group
 */
export async function leaveGroup(groupId: string): Promise<void> {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
}

/**
 * Removes a member from a group
 */
export async function removeMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('id', memberId);
  
  if (error) {
    console.error("Error removing member:", error);
    throw error;
  }
}

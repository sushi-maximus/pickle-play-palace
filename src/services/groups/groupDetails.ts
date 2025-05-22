
import { supabase } from "@/integrations/supabase/client";
import { Group, MemberWithProfile } from "@/types/group";

/**
 * Fetches a single group by its ID
 */
export async function getGroupById(groupId: string): Promise<Group | null> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found code
      return null;
    }
    console.error("Error fetching group:", error);
    throw error;
  }
  
  return data as Group;
}

/**
 * Fetches all members of a group with their profile information
 */
export async function getGroupMembers(groupId: string): Promise<MemberWithProfile[]> {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      profile: profiles (
        first_name,
        last_name,
        avatar_url,
        skill_level,
        dupr_rating
      )
    `)
    .eq('group_id', groupId)
    .order('role', { ascending: false }); // admins first
  
  if (error) {
    console.error("Error fetching group members:", error);
    throw error;
  }
  
  return data as MemberWithProfile[];
}

/**
 * Checks if a user is a member of a group
 */
export async function checkIfUserIsMember(groupId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found code
      return false;
    }
    console.error("Error checking membership:", error);
    throw error;
  }
  
  return !!data;
}

/**
 * Checks if a user is an admin of a group
 */
export async function checkIfUserIsAdmin(groupId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found code
      return false;
    }
    console.error("Error checking admin status:", error);
    throw error;
  }
  
  return !!data;
}

/**
 * Updates group details
 */
export async function updateGroup(groupId: string, updates: Partial<Group>): Promise<Group> {
  const { data, error } = await supabase
    .from('groups')
    .update(updates)
    .eq('id', groupId)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating group:", error);
    throw error;
  }
  
  return data as Group;
}

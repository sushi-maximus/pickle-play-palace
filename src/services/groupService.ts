
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember, GroupWithMemberCount, MemberWithProfile } from "@/types/group";

export async function fetchPublicGroups(): Promise<GroupWithMemberCount[]> {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      member_count:group_members(count)
    `)
    .eq('is_private', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching public groups:", error);
    throw error;
  }

  return (data as any[]).map(group => ({
    ...group,
    member_count: group.member_count[0]?.count || 0
  }));
}

export async function fetchUserGroups(): Promise<GroupWithMemberCount[]> {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  // Get groups user is a member of
  const { data: membershipData, error: membershipError } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId);

  if (membershipError) {
    console.error('Error fetching group memberships:', membershipError);
    throw membershipError;
  }

  if (!membershipData || membershipData.length === 0) {
    return [];
  }

  // Get groups by ids with member count
  const groupIds = membershipData.map(membership => membership.group_id);
  const { data: groupsData, error: groupsError } = await supabase
    .from('groups')
    .select(`
      *,
      member_count:group_members(count)
    `)
    .in('id', groupIds)
    .order('updated_at', { ascending: false });

  if (groupsError) {
    console.error('Error fetching user groups:', groupsError);
    throw groupsError;
  }

  return (groupsData as any[]).map(group => ({
    ...group,
    member_count: group.member_count[0]?.count || 0
  }));
}

export async function createGroup(group: Partial<Group>): Promise<Group> {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
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

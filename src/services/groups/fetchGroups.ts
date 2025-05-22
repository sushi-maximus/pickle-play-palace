
import { supabase } from "@/integrations/supabase/client";
import { GroupWithMemberCount } from "@/types/group";

/**
 * Fetches all public groups with their member count
 */
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

/**
 * Fetches all groups the current user is a member of
 */
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

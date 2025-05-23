
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a user is already a member or has a pending request for a group
 * @param userId The user ID to check
 * @param groupId The group ID to check
 * @returns Object containing membership status information
 */
export async function checkMembershipStatus(userId: string, groupId: string) {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .select("status, role")
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking membership status:", error);
      return { isMember: false, isPending: false, isAdmin: false };
    }
    
    return {
      isMember: data?.status === 'active',
      isPending: data?.status === 'pending',
      isAdmin: data?.role === 'admin' && data?.status === 'active'
    };
  } catch (error) {
    console.error("Exception checking membership status:", error);
    return { isMember: false, isPending: false, isAdmin: false };
  }
}

/**
 * Send a request to join a group
 * @param userId The user ID requesting to join
 * @param groupId The group to join
 * @param message Optional message from the user
 * @returns Success status of the operation
 */
export async function requestToJoinGroup(userId: string, groupId: string, message: string = '') {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .insert([
        {
          user_id: userId,
          group_id: groupId,
          role: "member",
          status: "pending",
          request_message: message || null
        }
      ])
      .select();
      
    if (error) {
      console.error("Error requesting to join group:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Exception requesting to join group:", error);
    return { success: false, error };
  }
}

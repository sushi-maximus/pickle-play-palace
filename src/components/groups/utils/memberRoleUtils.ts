
import { supabase } from "@/integrations/supabase/client";

/**
 * Promotes a member to admin role in a group
 * @param memberId The ID of the group_members record to update
 * @param groupId The group ID for validation
 * @returns Success status
 */
export const promoteMemberToAdmin = async (memberId: string, groupId: string) => {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .update({ role: "admin" })
      .eq("id", memberId)
      .eq("group_id", groupId) // Ensure we're only updating in the correct group
      .select()
      .single();
      
    if (error) {
      console.error("Error promoting member to admin:", error);
      throw new Error(`Failed to promote member: ${error.message}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error in promoteMemberToAdmin:", error);
    throw error;
  }
};

/**
 * Removes a member from a group
 * @param memberId The ID of the group_members record to remove
 * @param groupId The group ID for validation
 * @returns Success status
 */
export const removeMemberFromGroup = async (memberId: string, groupId: string) => {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", memberId)
      .eq("group_id", groupId); // Ensure we're only deleting in the correct group
      
    if (error) {
      console.error("Error removing member from group:", error);
      throw new Error(`Failed to remove member: ${error.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in removeMemberFromGroup:", error);
    throw error;
  }
};

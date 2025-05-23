
import { supabase } from "@/integrations/supabase/client";

/**
 * A utility function to check if a user is a member of a group
 */
export const checkGroupMembership = async (userId: string, groupId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .select("id")
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .eq("status", "active")
      .maybeSingle();
      
    if (error) {
      console.error("Error checking group membership:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception checking group membership:", error);
    return false;
  }
};

/**
 * A utility function to check if a user is an admin of a group
 */
export const checkGroupAdmin = async (userId: string, groupId: string): Promise<boolean> => {
  try {
    // First check if user is the creator
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .select("created_by")
      .eq("id", groupId)
      .maybeSingle();
      
    if (groupData && groupData.created_by === userId) {
      return true;
    }
    
    if (groupError) {
      console.error("Error checking group creator:", groupError);
    }
    
    // Then check if user is an admin member
    const { data, error } = await supabase
      .from("group_members")
      .select("id")
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .eq("status", "active")
      .eq("role", "admin")
      .maybeSingle();
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception checking admin status:", error);
    return false;
  }
};

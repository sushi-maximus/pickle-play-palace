import { supabase } from "@/integrations/supabase/client";
import { CreateGroupFormValues } from "../schemas/groupSchemas";
import { toast } from "sonner";

export async function createGroup(values: CreateGroupFormValues, userId: string) {
  // Step 1: Create the group
  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .insert([
      {
        name: values.name,
        description: values.description || null,
        location: values.location || null,
        created_by: userId,
        is_private: values.is_private,
      },
    ])
    .select();

  if (groupError) {
    console.error("Error details:", groupError);
    throw groupError;
  }

  const newGroup = groupData[0];
  
  // Step 2: Add the creator as a member with admin role
  const { error: memberError } = await supabase
    .from("group_members")
    .insert([
      {
        group_id: newGroup.id,
        user_id: userId,
        role: 'admin',
        status: 'active'
      },
    ]);

  if (memberError) {
    console.error("Error adding creator as member:", memberError);
    toast.error("Group created but failed to add you as a member. Please try again.");
  }
  
  return newGroup;
}

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

/**
 * Update group settings
 * @param groupId The group ID to update
 * @param values The new values for the group
 * @returns The updated group data
 */
export async function updateGroupSettings(groupId: string, values: any) {
  try {
    const { data, error } = await supabase
      .from("groups")
      .update({
        name: values.name,
        description: values.description,
        location: values.location,
        is_private: values.is_private,
        max_members: values.max_members,
        skill_level_min: values.skill_level_min,
        skill_level_max: values.skill_level_max,
        updated_at: new Date()
      })
      .eq("id", groupId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating group settings:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception updating group settings:", error);
    return null;
  }
}

/**
 * Update group permissions
 * @param groupId The group ID to update
 * @param permissions The new permission settings
 * @returns The updated group data
 */
export async function updateGroupPermissions(groupId: string, permissions: any) {
  try {
    const { data, error } = await supabase
      .from("groups")
      .update({
        is_private: permissions.is_private,
        // Add more permissions as the schema evolves
        updated_at: new Date()
      })
      .eq("id", groupId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating group permissions:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception updating group permissions:", error);
    return null;
  }
}

/**
 * Get all members of a group, including pending requests
 * @param groupId The group to get members for
 * @returns Object containing active and pending members
 */
export async function getGroupMembers(groupId: string) {
  try {
    const { data: allMembers, error } = await supabase
      .from("group_members")
      .select(`
        id,
        role,
        status,
        joined_at,
        request_message,
        user_id,
        profiles:user_id (
          id, 
          first_name, 
          last_name, 
          avatar_url, 
          skill_level
        )
      `)
      .eq("group_id", groupId)
      .order("joined_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching group members:", error);
      return { activeMembers: [], pendingMembers: [] };
    }
    
    // Separate active members and pending requests
    const activeMembers = allMembers?.filter(member => member.status === "active") || [];
    const pendingMembers = allMembers?.filter(member => member.status === "pending") || [];
    
    return { activeMembers, pendingMembers };
  } catch (error) {
    console.error("Exception fetching group members:", error);
    return { activeMembers: [], pendingMembers: [] };
  }
}

/**
 * Update a member's role in the group
 * @param groupId The group ID
 * @param memberId The membership ID to update
 * @param newRole The new role for the member
 * @returns Success status
 */
export async function updateMemberRole(groupId: string, memberId: string, newRole: "admin" | "member") {
  try {
    const { error } = await supabase
      .from("group_members")
      .update({
        role: newRole
      })
      .eq("id", memberId)
      .eq("group_id", groupId);
      
    if (error) {
      console.error("Error updating member role:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Exception updating member role:", error);
    return { success: false, error };
  }
}

/**
 * Remove a member from a group
 * @param groupId The group ID
 * @param memberId The membership ID to remove
 * @returns Success status
 */
export async function removeMember(groupId: string, memberId: string) {
  try {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", memberId)
      .eq("group_id", groupId);
      
    if (error) {
      console.error("Error removing member:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Exception removing member:", error);
    return { success: false, error };
  }
}

/**
 * Handle a join request (approve or reject)
 * @param groupId The group ID
 * @param requestId The request ID to handle
 * @param action The action to take (approved or rejected)
 * @returns Success status
 */
export async function handleJoinRequest(groupId: string, requestId: string, action: "approved" | "rejected") {
  try {
    if (action === "approved") {
      const { error } = await supabase
        .from("group_members")
        .update({
          status: "active",
          joined_at: new Date()
        })
        .eq("id", requestId)
        .eq("group_id", groupId);
        
      if (error) {
        console.error("Error approving request:", error);
        return { success: false, error };
      }
    } else {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("id", requestId)
        .eq("group_id", groupId);
        
      if (error) {
        console.error("Error rejecting request:", error);
        return { success: false, error };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Exception ${action} request:`, error);
    return { success: false, error };
  }
}

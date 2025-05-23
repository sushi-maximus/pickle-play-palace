
import { supabase } from "@/integrations/supabase/client";
import { UpdateGroupFormValues } from "../schemas/groupSchemas";

/**
 * Updates a group with new information
 * @param groupId The UUID of the group to update
 * @param values The updated values for the group
 * @returns The updated group data
 */
export const updateGroup = async (groupId: string, values: UpdateGroupFormValues) => {
  try {
    const { data: updatedGroup, error } = await supabase
      .from("groups")
      .update({
        name: values.name,
        description: values.description || null,
        location: values.location || null,
        is_private: values.is_private,
        skill_level_min: values.skill_level_min || null,
        skill_level_max: values.skill_level_max || null,
        max_members: values.max_members || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", groupId)
      .select()
      .single();

    if (error) {
      console.error("Error updating group:", error);
      throw new Error(`Failed to update group: ${error.message}`);
    }

    return updatedGroup;
  } catch (error) {
    console.error("Error in updateGroup:", error);
    throw error;
  }
};

/**
 * Updates a group's avatar
 * @param groupId The UUID of the group to update
 * @param avatarUrl The URL of the new avatar
 * @returns The updated group data
 */
export const updateGroupAvatar = async (groupId: string, avatarUrl: string) => {
  try {
    const { data: updatedGroup, error } = await supabase
      .from("groups")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", groupId)
      .select()
      .single();

    if (error) {
      console.error("Error updating group avatar:", error);
      throw new Error(`Failed to update group avatar: ${error.message}`);
    }

    return updatedGroup;
  } catch (error) {
    console.error("Error in updateGroupAvatar:", error);
    throw error;
  }
};

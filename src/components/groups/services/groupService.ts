
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


import React, { useState } from "react";
import { AlertCircle, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { updateGroup } from "@/components/groups/utils/groupDetailsUtils";
import { updateGroupSchema, UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";
import { toast } from "sonner";
import { BasicInfoCard, AdvancedSettingsCard } from "./settings";

interface GroupSettingsTabProps {
  group: any;
  onGroupUpdate: (updatedGroup: any) => void;
}

export const GroupSettingsTab = ({ group, onGroupUpdate }: GroupSettingsTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateGroupFormValues>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: group.name || "",
      description: group.description || "",
      location: group.location || "",
      is_private: group.is_private || false,
      skill_level_min: group.skill_level_min || "",
      skill_level_max: group.skill_level_max || "",
      max_members: group.max_members || undefined,
    },
  });

  const handleSubmit = async (values: UpdateGroupFormValues) => {
    setIsSubmitting(true);
    try {
      const updatedGroup = await updateGroup(group.id, values);
      onGroupUpdate(updatedGroup);
      toast.success("Group settings updated successfully");
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Failed to update group settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Group Settings</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin Only</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <BasicInfoCard 
            group={group} 
            form={form} 
            isSubmitting={isSubmitting} 
            onGroupUpdate={onGroupUpdate} 
          />
          
          <AdvancedSettingsCard 
            form={form} 
            isSubmitting={isSubmitting} 
          />
        </form>
      </Form>
    </div>
  );
};

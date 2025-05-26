
import React, { useState } from "react";
import { AlertCircle, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { updateGroup } from "@/components/groups/utils"; // Updated import path
import { updateGroupSchema, UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";
import { toast } from "sonner";
import { BasicInfoCard, AdvancedSettingsCard } from "./settings";
import { FacebookErrorBoundary } from "./mobile/FacebookErrorBoundary";
import { FacebookErrorFallback } from "./mobile/FacebookErrorFallback";
import { FacebookLoadingState } from "./mobile/FacebookLoadingState";
import { FacebookNetworkStatus } from "./mobile/FacebookNetworkStatus";
import type { Database } from "@/integrations/supabase/types";
import type { GroupMember } from "./members/types";

type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: GroupMember[];
  member_count: number;
};

interface GroupSettingsTabProps {
  group: Group;
  onGroupUpdate: (updatedGroup: Group) => void;
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

  const handleErrorReset = () => {
    // Reset form to default values
    form.reset();
  };

  return (
    <FacebookErrorBoundary
      fallback={({ error, resetError }) => (
        <FacebookErrorFallback
          error={error}
          resetError={resetError}
          title="Settings Error"
          description="There was a problem loading the group settings. This might be a temporary issue."
        />
      )}
    >
      {/* Main Container - Following Activity page design */}
      <main className="flex-1 bg-gray-50 overflow-hidden min-h-0">
        {/* Network Status Indicator */}
        <FacebookNetworkStatus />
        
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          {/* Settings Header - Following Activity page sticky pattern */}
          <div className="flex-shrink-0 sticky top-0 z-10 pt-safe mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium">Group Settings</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin Only</span>
              </div>
            </div>
          </div>

          {/* Settings Content Area - Enhanced scrolling with momentum and safe areas */}
          <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain webkit-overflow-scrolling-touch min-h-0">
            <div className="pb-4 sm:pb-6 pb-safe">
              {isSubmitting ? (
                <div className="p-3 sm:p-4">
                  <FacebookLoadingState type="settings" count={2} />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              )}
            </div>
          </div>
        </div>
      </main>
    </FacebookErrorBoundary>
  );
};

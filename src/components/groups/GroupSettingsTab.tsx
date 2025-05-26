
import React, { useState } from "react";
import { Settings, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateGroup } from "@/components/groups/utils/updateGroupUtils";
import { updateGroupSchema, UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";
import { toast } from "sonner";
import { GroupAvatarSection } from "./settings";
import { FacebookErrorBoundary } from "./mobile/FacebookErrorBoundary";
import { FacebookErrorFallback } from "./mobile/FacebookErrorFallback";
import { FacebookLoadingState } from "./mobile/FacebookLoadingState";
import { FacebookNetworkStatus } from "./mobile/FacebookNetworkStatus";
import { CombinedSettingsForm } from "./settings/CombinedSettingsForm";
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
      <main className="flex-1 bg-gray-50 overflow-hidden min-h-0">
        <FacebookNetworkStatus />
        
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          {/* Settings Header */}
          <div className="flex-shrink-0 sticky top-0 z-10 pt-safe mb-4">
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium">Group Settings</h3>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin Only</span>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain webkit-overflow-scrolling-touch min-h-0">
            <div className="pb-4 sm:pb-6 pb-safe">
              {isSubmitting ? (
                <div className="p-3 sm:p-4">
                  <FacebookLoadingState type="settings" count={1} />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-center">
                        <GroupAvatarSection group={group} onGroupUpdate={onGroupUpdate} />
                      </div>
                    </div>

                    {/* Combined Settings Form */}
                    <CombinedSettingsForm form={form} isSubmitting={isSubmitting} />

                    {/* Save Button */}
                    <div className="sticky bottom-0 bg-white border-t p-4 -mx-3 mt-6">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-medium"
                        size="lg"
                      >
                        {isSubmitting ? (
                          "Saving Settings..."
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save All Settings
                          </>
                        )}
                      </Button>
                    </div>
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

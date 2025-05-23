
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateGroupSettings } from "../services/groupService";
import { groupSettingsSchema, type GroupSettingsFormValues } from "../schemas/groupSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface GroupSettingsGeneralProps {
  group: any;
  setGroup: (group: any) => void;
}

export const GroupSettingsGeneral = ({ group, setGroup }: GroupSettingsGeneralProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<GroupSettingsFormValues>({
    resolver: zodResolver(groupSettingsSchema),
    defaultValues: {
      name: group.name || "",
      description: group.description || "",
      location: group.location || "",
      is_private: group.is_private || false,
      max_members: group.max_members || undefined,
      skill_level_min: group.skill_level_min || "",
      skill_level_max: group.skill_level_max || "",
    },
  });
  
  const onSubmit = async (values: GroupSettingsFormValues) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedGroup = await updateGroupSettings(id, values);
      
      if (updatedGroup) {
        setGroup({
          ...group,
          ...updatedGroup
        });
        toast.success("Group settings updated successfully");
      } else {
        toast.error("Failed to update group settings");
      }
    } catch (error) {
      console.error("Error updating group settings:", error);
      toast.error("An error occurred while updating group settings");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage basic information about your group.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter group name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter group description" 
                    className="min-h-32" 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Describe the purpose and activities of your group.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Where your group typically meets or plays.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="max_members"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Members</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="No limit"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty for no limit.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col md:flex-row md:space-x-4">
            <FormField
              control={form.control}
              name="skill_level_min"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Minimum Skill Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2.5" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skill_level_max"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Maximum Skill Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 4.0" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="is_private"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Private Group</FormLabel>
                  <FormDescription>
                    When enabled, users must request to join and be approved by an admin.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/groups/${id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};


import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Save, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { updateGroup } from "@/components/groups/utils/groupDetailsUtils";
import { updateGroupSchema, UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";
import { toast } from "sonner";
import { Lock, Globe, Users, Award } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SelectField } from "@/components/auth/form-fields/SelectField";
import { skillLevelOptions } from "@/lib/constants/skill-levels";
import { GroupAvatarUpload } from "@/components/groups/details/GroupAvatarUpload";

interface GroupSettingsTabProps {
  group: any;
  onGroupUpdate: (updatedGroup: any) => void;
}

export const GroupSettingsTab = ({ group, onGroupUpdate }: GroupSettingsTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const form = useForm<UpdateGroupFormValues>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: group.name || "",
      description: group.description || "",
      location: group.location || "",
      is_private: group.is_private || false,
      skill_level_min: group.skill_level_min || "",
      skill_level_max: group.skill_level_max || "",
      max_members: group.max_members || 0,
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

  const handleAvatarUploaded = (avatarUrl: string) => {
    setShowAvatarUpload(false);
    onGroupUpdate({ ...group, avatar_url: avatarUrl });
    toast.success("Group avatar updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Group Settings</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin Only</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Manage the basic details of your group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        placeholder="Describe what your group is about" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
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
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center">
                        {field.value ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Private Group
                          </>
                        ) : (
                          <>
                            <Globe className="w-4 h-4 mr-2" />
                            Public Group
                          </>
                        )}
                      </FormLabel>
                      <FormDescription>
                        {field.value 
                          ? "Private groups require approval to join" 
                          : "Public groups can be joined by anyone"}
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
              
              <Button type="submit" disabled={isSubmitting} className="mt-4">
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Skill Level Range
          </CardTitle>
          <CardDescription>
            Set the skill level range for players in this group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  control={form.control}
                  name="skill_level_min"
                  label="Minimum Skill Level"
                  placeholder="Select minimum skill level"
                  options={skillLevelOptions}
                />
                
                <SelectField
                  control={form.control}
                  name="skill_level_max"
                  label="Maximum Skill Level"
                  placeholder="Select maximum skill level"
                  options={skillLevelOptions}
                />
              </div>
              
              <FormField
                control={form.control}
                name="max_members"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Maximum Members
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="1000"
                          placeholder="Enter maximum number of members"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the maximum number of members allowed in this group
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              
              <Button type="submit" disabled={isSubmitting} className="mt-4">
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Advanced Settings
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Group Avatar
          </CardTitle>
          <CardDescription>
            Upload or update your group's avatar image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                {group.avatar_url ? (
                  <AvatarImage src={group.avatar_url} alt={group.name} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {group.name?.substring(0, 2).toUpperCase() || "GP"}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="text-sm text-muted-foreground mt-2">Current Avatar</p>
            </div>
            
            <div className="flex flex-col items-center">
              {showAvatarUpload ? (
                <GroupAvatarUpload
                  groupId={group.id}
                  onSuccess={handleAvatarUploaded}
                  onCancel={() => setShowAvatarUpload(false)}
                />
              ) : (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAvatarUpload(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Avatar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

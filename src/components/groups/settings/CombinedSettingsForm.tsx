
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Lock, Globe, Users, Award, MapPin, Type, FileText } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";
import { SelectField } from "@/components/auth/form-fields/SelectField";
import { skillLevelOptions } from "@/lib/constants/skill-levels";

interface CombinedSettingsFormProps {
  form: UseFormReturn<UpdateGroupFormValues>;
  isSubmitting: boolean;
}

export const CombinedSettingsForm = ({ form, isSubmitting }: CombinedSettingsFormProps) => {
  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Type className="h-5 w-5 text-gray-600" />
          <h4 className="text-lg font-medium">Basic Information</h4>
        </div>
        
        <div className="space-y-4">
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
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </FormLabel>
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
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Privacy Settings Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-gray-600" />
          <h4 className="text-lg font-medium">Privacy & Access</h4>
        </div>
        
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
      </div>

      {/* Skill Level & Membership Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-gray-600" />
          <h4 className="text-lg font-medium">Skill Level & Membership</h4>
        </div>
        
        <div className="space-y-4">
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
            render={({ field }) => (
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
                    value={field.value === undefined || field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Set the maximum number of members allowed in this group (leave empty for unlimited)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};


import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Users, Award } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";
import { SelectField } from "@/components/auth/form-fields/SelectField";
import { skillLevelOptions } from "@/lib/constants/skill-levels";

interface AdvancedSettingsFormProps {
  form: UseFormReturn<UpdateGroupFormValues>;
  isSubmitting: boolean;
}

export const AdvancedSettingsForm = ({ form, isSubmitting }: AdvancedSettingsFormProps) => {
  return (
    <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
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
          );
        }}
      />
      
      <Button type="submit" disabled={isSubmitting}>
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
  );
};

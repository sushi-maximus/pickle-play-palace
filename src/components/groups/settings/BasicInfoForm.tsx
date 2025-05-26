
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Lock, Globe } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";

interface BasicInfoFormProps {
  form: UseFormReturn<UpdateGroupFormValues>;
  isSubmitting: boolean;
}

export const BasicInfoForm = ({ form, isSubmitting }: BasicInfoFormProps) => {
  return (
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
    </div>
  );
};

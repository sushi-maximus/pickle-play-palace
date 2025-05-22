
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { profileSchema, ProfileFormValues } from "./schemas/profileSchema";
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { AdditionalInfoFields } from "./form-sections/AdditionalInfoFields";
import { formatProfileDataForUpdate, mapProfileDataToFormValues } from "./utils/profileUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileFormProps {
  userId: string;
  profileData: any;
}

export const ProfileForm = ({ userId, profileData }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const { refreshProfile } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "Male", 
      skillLevel: "2.5",
      birthday: undefined,
      duprRating: "",
    },
  });

  // Set form values when profile data is available
  useEffect(() => {
    if (profileData) {
      console.log("Initial profile data:", profileData);
      
      const formValues = mapProfileDataToFormValues(profileData);
      console.log("Setting form values to:", formValues);
      
      // Use setValue for each field individually to ensure the SelectFields update correctly
      Object.entries(formValues).forEach(([key, value]) => {
        form.setValue(key as keyof ProfileFormValues, value);
      });
      
      // Set data ready after a small delay to ensure smooth transition
      setTimeout(() => setIsDataReady(true), 300);
    }
  }, [profileData, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      console.log("Saving profile with values:", values);
      const updateData = formatProfileDataForUpdate(values);
      console.log("Update data being sent to Supabase:", updateData);
      
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);
      
      if (error) throw error;
      
      // Refresh the profile data after successful update
      await refreshProfile();
      
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update failed", {
        description: "Failed to update profile. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show skeleton UI while data is loading
  if (!isDataReady) {
    return (
      <div className="space-y-6 w-full">
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="flex justify-end mt-4">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <PersonalInfoFields control={form.control} />
        <AdditionalInfoFields control={form.control} />
        
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

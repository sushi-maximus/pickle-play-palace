
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
import { ProfileErrorMessage } from "./ProfileErrorMessage";
import { ButtonLoader } from "@/components/ui/ButtonLoader";
import { useOptimisticMutations } from "@/hooks/useOptimisticMutations";
import { FormErrorBoundary } from "@/components/error-boundaries";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileFormProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

export const ProfileForm = ({ profile, onProfileUpdate }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { refreshProfile } = useAuth();
  const { updateProfileOptimistically, rollbackOptimisticUpdate } = useOptimisticMutations();

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
    mode: "onChange"
  });

  // Set form values when profile data is available
  useEffect(() => {
    if (profile) {
      console.log("Initial profile data:", profile);
      
      const formValues = mapProfileDataToFormValues(profile);
      console.log("Setting form values to:", formValues);
      
      // Use setValue for each field individually to ensure the SelectFields update correctly
      Object.entries(formValues).forEach(([key, value]) => {
        form.setValue(key as keyof ProfileFormValues, value);
      });
      
      // Set data ready after a small delay to ensure smooth transition
      setTimeout(() => setIsDataReady(true), 300);
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      setFormError(null);
      
      console.log("Saving profile with values:", values);
      const updateData = formatProfileDataForUpdate(values);
      console.log("Update data being sent to Supabase:", updateData);
      
      // Optimistic update
      const optimisticProfile = { ...profile, ...updateData };
      updateProfileOptimistically(profile.id, updateData);
      onProfileUpdate(optimisticProfile);
      
      const { error, data } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the parent component with the actual server response
      if (data) {
        onProfileUpdate(data);
      }
      
      // Refresh the profile data after successful update
      await refreshProfile();
      
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully",
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setFormError(error.message || "Failed to update profile. Please try again.");
      
      // Rollback optimistic update
      rollbackOptimisticUpdate(['profile']);
      onProfileUpdate(profile); // Revert to original profile
      
      toast.error("Update failed", {
        description: "Failed to update profile. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    setFormError(null);
    // Trigger form submission again
    form.handleSubmit(onSubmit)();
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
    <FormErrorBoundary formName="Profile" onRetry={handleRetry}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          {formError && <ProfileErrorMessage error={formError} onRetry={handleRetry} />}
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <PersonalInfoFields control={form.control} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Additional Information</h3>
              <AdditionalInfoFields control={form.control} />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              disabled={isLoading || !form.formState.isDirty} 
              className="w-full md:w-auto transition-all"
            >
              <ButtonLoader 
                isLoading={isLoading}
                loadingText="Updating..."
                size="sm"
              >
                Save Changes
              </ButtonLoader>
            </Button>
          </div>
        </form>
      </Form>
    </FormErrorBoundary>
  );
};

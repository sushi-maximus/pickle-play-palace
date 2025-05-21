
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { skillLevelOptions } from "@/lib/constants/skill-levels";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { InputField } from "@/components/auth/form-fields/InputField";
import { SelectField } from "@/components/auth/form-fields/SelectField";

// Define the exact values allowed for gender and skill level
const GENDER_VALUES = ["Male", "Female"] as const;
const SKILL_LEVEL_VALUES = ["2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"] as const;

// Create type aliases for better type safety
type Gender = typeof GENDER_VALUES[number];
type SkillLevel = typeof SKILL_LEVEL_VALUES[number];

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name cannot exceed 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name cannot exceed 50 characters"),
  gender: z.enum(GENDER_VALUES, { required_error: "Please select your gender" }),
  skillLevel: z.enum(SKILL_LEVEL_VALUES, { required_error: "Please select your skill level" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userId: string;
  profileData: any;
}

export const ProfileForm = ({ userId, profileData }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Simple log to check what data is coming in
  useEffect(() => {
    if (profileData) {
      console.log("Initial profile data:", profileData);
    }
  }, [profileData]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "Male", 
      skillLevel: "2.5", 
    },
  });

  // Set form values when profile data is available
  useEffect(() => {
    if (profileData) {
      // Simple approach - set the values directly
      const formValues = {
        firstName: profileData.first_name || "",
        lastName: profileData.last_name || "",
        gender: profileData.gender || "Male",
        skillLevel: profileData.skill_level || "2.5",
      };
      
      console.log("Setting form values to:", formValues);
      form.reset(formValues);
    }
  }, [profileData, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      console.log("Saving profile with values:", values);
      
      const updateData = {
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        skill_level: values.skillLevel
      };
      
      console.log("Update data being sent to Supabase:", updateData);
      
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            control={form.control}
            name="firstName"
            label="First Name"
            placeholder="John"
          />
          <InputField
            control={form.control}
            name="lastName"
            label="Last Name"
            placeholder="Doe"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            control={form.control}
            name="gender"
            label="Gender"
            placeholder="Select gender"
            options={genderOptions}
          />
          <SelectField
            control={form.control}
            name="skillLevel"
            label="Skill Level"
            placeholder="Select skill level"
            options={skillLevelOptions}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

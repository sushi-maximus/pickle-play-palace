
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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
  birthday: z.date().optional(),
  duprRating: z.string().optional().refine((val) => {
    if (!val) return true;
    const parsed = parseFloat(val);
    return !isNaN(parsed) && parsed >= 2.0 && parsed <= 8.0;
  }, "DUPR rating must be between 2.0 and 8.0"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userId: string;
  profileData: any;
}

export const ProfileForm = ({ userId, profileData }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Log the incoming profile data for debugging
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
      birthday: undefined,
      duprRating: "",
    },
  });

  // Set form values when profile data is available
  useEffect(() => {
    if (profileData) {
      // Create a safe copy of the profile data to use for the form
      const formValues = {
        firstName: profileData.first_name || "",
        lastName: profileData.last_name || "",
        // Ensure gender is a valid enum value
        gender: GENDER_VALUES.includes(profileData.gender) ? profileData.gender : "Male",
        // Ensure skill level is a valid enum value
        skillLevel: SKILL_LEVEL_VALUES.includes(profileData.skill_level) ? profileData.skill_level : "2.5",
        birthday: profileData.birthday ? new Date(profileData.birthday) : undefined,
        duprRating: profileData.dupr_rating ? String(profileData.dupr_rating) : "",
      } as ProfileFormValues;
      
      console.log("Setting form values to:", formValues);
      
      // Use setValue for each field individually to ensure the SelectFields update correctly
      Object.entries(formValues).forEach(([key, value]) => {
        form.setValue(key as keyof ProfileFormValues, value);
      });
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
        skill_level: values.skillLevel,
        birthday: values.birthday ? values.birthday.toISOString() : null,
        dupr_rating: values.duprRating ? parseFloat(values.duprRating) : null
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Birthday Field */}
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Birthday</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DUPR Rating Field */}
          <InputField
            control={form.control}
            name="duprRating"
            label="DUPR Rating"
            placeholder="4.5"
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

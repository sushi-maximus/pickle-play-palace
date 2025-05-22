
import { z } from "zod";

// Define the exact values allowed for gender and skill level
export const GENDER_VALUES = ["Male", "Female"] as const;
export const SKILL_LEVEL_VALUES = ["2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"] as const;

// Create type aliases for better type safety
export type Gender = typeof GENDER_VALUES[number];
export type SkillLevel = typeof SKILL_LEVEL_VALUES[number];

export const profileSchema = z.object({
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
  phoneNumber: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;


import { z } from "zod";

// Schema for creating a new group
export const createGroupSchema = z.object({
  name: z.string().min(2, "Group name must be at least 2 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  is_private: z.boolean().default(false),
});

export type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

// Add new schema for group settings
export const groupSettingsSchema = z.object({
  name: z.string().min(2, "Group name must be at least 2 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  is_private: z.boolean().default(false),
  max_members: z.number().positive().optional(),
  skill_level_min: z.string().optional(),
  skill_level_max: z.string().optional(),
});

export type GroupSettingsFormValues = z.infer<typeof groupSettingsSchema>;

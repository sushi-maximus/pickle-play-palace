
import { z } from "zod";

// Schema for creating a new group
export const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  is_private: z.boolean().default(true),
});

export type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

// Schema for updating an existing group
export const updateGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  is_private: z.boolean(),
});

export type UpdateGroupFormValues = z.infer<typeof updateGroupSchema>;

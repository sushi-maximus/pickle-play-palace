
import { z } from "zod";

// Schema for creating a new group
export const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  is_private: z.boolean().default(false),
});

export type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

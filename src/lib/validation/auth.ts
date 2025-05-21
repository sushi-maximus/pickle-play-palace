
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required").max(50, "First name cannot exceed 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name cannot exceed 50 characters"),
  gender: z.enum(["Male", "Female"], { required_error: "Please select your gender" }),
  skillLevel: z.enum(["2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"], { required_error: "Please select your skill level" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupSchema = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

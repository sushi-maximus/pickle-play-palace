import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputField } from "@/components/auth/form-fields/InputField";
import { supabase } from "@/integrations/supabase/client";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error("Reset failed", {
          description: error.message || "Unable to send reset email. Please try again.",
          duration: 5000,
        });
        return;
      }

      setIsSuccess(true);
      
      toast.success("Reset email sent", {
        description: "Please check your email for password reset instructions.",
        duration: 5000,
      });

      form.reset();
      
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Reset error", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isSuccess && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Reset email sent! Please check your inbox for further instructions.
            </AlertDescription>
          </Alert>
        )}

        <InputField
          control={form.control}
          name="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
        />

        <Button 
          className="w-full" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
};

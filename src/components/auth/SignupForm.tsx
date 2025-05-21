
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { 
  Form,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { SignupSchema, signupSchema } from "@/lib/validation/auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

// Import the form sections
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { PasswordFields } from "./form-sections/PasswordFields";
import { TermsAndPolicy } from "./form-sections/TermsAndPolicy";

export const SignupForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      gender: undefined,
      skillLevel: undefined,
    },
  });

  const onSubmit = async (values: SignupSchema) => {
    try {
      setIsLoading(true);
      setSignupError(null);
      
      // Log form values to ensure they're correct
      console.log("Form values submitted:", {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        skillLevel: values.skillLevel,
      });
      
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        skillLevel: values.skillLevel,
      };
      
      const { error } = await signUp(values.email, values.password, userData);
      
      if (error) {
        console.error("Error during signup:", error);
        setSignupError(error.message || "Failed to create account. Please try again.");
        return;
      }
      
      // Navigate to login page
      navigate("/login");
      // Reset scroll position to the top of the page
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Join Pickle Ninja to connect with players and organize games.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {signupError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                Error: {signupError}
              </div>
            )}
            
            <PersonalInfoFields control={form.control} />
            <PasswordFields control={form.control} />
            <TermsAndPolicy />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary underline underline-offset-4">
                Log In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

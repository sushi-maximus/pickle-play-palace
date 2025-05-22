
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
  
  console.log('Rendering SignupForm component');
  
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
      agreeToTerms: false,
    },
    mode: "onSubmit", // Only validate on submit
    reValidateMode: "onSubmit", // Only revalidate on submit
  });

  console.log("Form errors:", form.formState.errors);
  console.log("Form values:", form.getValues());

  const onSubmit = async (values: SignupSchema) => {
    try {
      setIsLoading(true);
      setSignupError(null);
      
      console.log("Form values submitted:", {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        skillLevel: values.skillLevel,
        agreeToTerms: values.agreeToTerms,
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
    <Card className="w-full max-w-md shadow-lg border-opacity-50">
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Join Pickle Ninja to connect with players and organize games.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-6 pt-4">
            {signupError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                Error: {signupError}
              </div>
            )}
            
            <PersonalInfoFields control={form.control} />
            <PasswordFields control={form.control} />
            <TermsAndPolicy />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button 
              className="w-full transition-all" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline underline-offset-4 transition-colors">
                Log In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

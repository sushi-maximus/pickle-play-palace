
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Form,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { LoginSchema, loginSchema } from "@/lib/validation/auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { LoginErrorMessage } from "./LoginErrorMessage";
import { ResendVerificationDialog } from "./ResendVerificationDialog";
import { InputField } from "./form-fields/InputField";

export const LoginForm = () => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    try {
      setIsLoading(true);
      setLoginError(null);
      
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        setLoginError(error.message);
        return;
      }
    } catch (error: any) {
      setLoginError(error.message || "Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenResendDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-opacity-50">
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-4">
            {loginError && (
              <LoginErrorMessage 
                errorMessage={loginError}
                onResendVerification={handleOpenResendDialog}
              />
            )}
            
            <InputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="your.email@example.com"
              type="email"
            />
            
            <InputField
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
              isPassword={true}
            />
            
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline underline-offset-4 transition-colors">
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button 
              className="w-full transition-all" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline underline-offset-4 transition-colors">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
      
      <ResendVerificationDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
};

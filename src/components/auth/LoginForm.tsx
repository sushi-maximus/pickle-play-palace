
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {loginError && (
              <LoginErrorMessage 
                errorMessage={loginError}
                onResendVerification={handleOpenResendDialog}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary underline underline-offset-4">
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary underline underline-offset-4">
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

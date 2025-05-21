
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EyeIcon, EyeOffIcon, AlertCircleIcon, MailIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LoginSchema, loginSchema } from "@/lib/validation/auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, resendVerificationEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");

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
      setUserEmail(values.email); // Store email in case we need to show verification message
      
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.toLowerCase().includes("verification")) {
          setVerificationRequired(true);
          toast.error("Email verification required", {
            description: "Please check your inbox and verify your email before logging in."
          });
        } else {
          toast.error("Login failed", {
            description: error.message || "Invalid login credentials."
          });
        }
      } else {
        toast.success("Login successful", {
          description: "Welcome back to Pickle Ninja!"
        });
        navigate("/");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
      toast.error("Email required", {
        description: "Please enter your email address first."
      });
      return;
    }
    
    try {
      setIsResendingEmail(true);
      const { error } = await resendVerificationEmail(userEmail);
      
      if (error) {
        toast.error("Failed to resend verification email", {
          description: error.message || "Please try again later."
        });
      } else {
        toast.success("Verification email sent", {
          description: "Please check your inbox for a new verification link.",
          duration: 6000
        });
      }
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Log in to your account</CardTitle>
        <CardDescription>
          Welcome back to Pickle Ninja
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {verificationRequired && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircleIcon className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800">
                  <p>Please verify your email address before logging in.</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-amber-600 font-medium underline underline-offset-4"
                    onClick={handleResendVerification}
                    type="button"
                    disabled={isResendingEmail}
                  >
                    {isResendingEmail ? (
                      <>
                        <span className="mr-2">Sending verification email...</span>
                        <div className="h-4 w-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>
                        <MailIcon className="h-3 w-3 mr-1" />
                        Resend verification email
                      </>
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      type="email" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        setUserEmail(e.target.value);
                      }}
                    />
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
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Your password" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary underline underline-offset-4">
                Forgot Password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">Logging in...</span>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Log In"
              )}
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
    </Card>
  );
};


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
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const LoginForm = () => {
  const { signIn, resendVerificationEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    setResendStatus("loading");
    try {
      const { error } = await resendVerificationEmail(resendEmail);
      
      if (error) {
        setResendStatus("error");
        return;
      }
      
      setResendStatus("success");
      setTimeout(() => {
        setIsDialogOpen(false);
        // Reset after dialog closes
        setTimeout(() => setResendStatus("idle"), 500);
      }, 3000);
    } catch (error) {
      setResendStatus("error");
    }
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
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                <div>
                  <p>{loginError}</p>
                  {loginError.includes("Email not confirmed") && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="h-auto p-0 text-sm">
                          Resend verification email
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Resend verification email</DialogTitle>
                          <DialogDescription>
                            Enter your email address to receive a new verification link.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                value={resendEmail}
                                onChange={(e) => setResendEmail(e.target.value)}
                                type="email"
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={resendStatus === "loading" || !resendEmail}
                          >
                            {resendStatus === "loading" 
                              ? "Sending..." 
                              : resendStatus === "success" 
                              ? "Email sent!" 
                              : "Send verification email"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
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
    </Card>
  );
};
